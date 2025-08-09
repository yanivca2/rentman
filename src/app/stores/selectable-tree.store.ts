import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { DataService } from '../services/data.service';
import { EntityType, SelectionType, TreeNode } from '../common/types';

interface TreeNodeInner extends Omit<TreeNode, 'selectionType'> {
    id: string;
    title: string;
    type: EntityType;
    parent_id: string | null;
    children?: TreeNode[];
    collapsed?: boolean;
}

interface TreeState {
    folders: TreeNode[];
    items: TreeNode[];
    loading: boolean;
    error: string | null;
    selectedMap: Map<string, SelectionType>;
    collapsedMap: Map<string, boolean>;
}

const initialState: TreeState = {
    folders: [],
    items: [],
    loading: false,
    error: null,
    selectedMap: new Map(),
    collapsedMap: new Map(),
};

@Injectable({ providedIn: 'root' })
export class SelectableTreeStore extends signalStore(
    withState(initialState),
    withComputed((state) => ({
        treeStructure: computed(() => {
            const nodes = [...state.folders(), ...state.items()];
            const selectedMap = state.selectedMap();

            if (!nodes || nodes.length === 0) {
                return [];
            }

            // Create a map for quick lookup
            const nodeMap = new Map<string, TreeNode>();
            nodes.forEach(node => {
                nodeMap.set(node.id, { ...node, children: [] });
            });

            // Build the tree structure
            const rootNodes: TreeNode[] = [];

            nodes.forEach(node => {
                const treeNode = nodeMap.get(node.id)!;

                if (node.parent_id === null) {
                    rootNodes.push(treeNode);
                } else {
                    const parent = nodeMap.get(node.parent_id);
                    if (parent) {
                        if (!parent.children) parent.children = [];
                        parent.children.push(treeNode);
                    }
                }
            });

            const computeNodeSelection = (node: TreeNode): TreeNode => {
                if (node.type === EntityType.ITEM) {
                    // For items, get selection from selectedMap.
                    const selection = selectedMap.get(node.id) || SelectionType.UNSELECTED;
                    return { ...node, selectionType: selection };
                } else {
                    // For folders, compute selection based on children.
                    const childrenWithSelection = node.children?.map((child: TreeNode) => computeNodeSelection(child)) || [];

                    if (childrenWithSelection.length === 0) {
                        return { ...node, selectionType: SelectionType.UNSELECTED };
                    }

                    const allSelected = childrenWithSelection.every(child => child.selectionType === SelectionType.SELECTED);
                    const allUnselected = childrenWithSelection.every(child => child.selectionType === SelectionType.UNSELECTED);

                    let selection: SelectionType;
                    if (allSelected) {
                        selection = SelectionType.SELECTED;
                    } else if (allUnselected) {
                        selection = SelectionType.UNSELECTED;
                    } else {
                        selection = SelectionType.INDETERMINATE;
                    }

                    return {
                        ...node,
                        children: childrenWithSelection,
                        selectionType: selection,
                        collapsed: state.collapsedMap().get(node.id) ?? false
                    };
                }
            };

            return rootNodes.map((node: TreeNode) => computeNodeSelection(node));
        }),

        selectedIds: computed(() => {
            const selectedMap = state.selectedMap();
            return Array.from(
                selectedMap.keys()
            )
            .filter(
                key => selectedMap.get(key)
            )
            .sort(
                (item1: string, item2: string) => Number(item1) - Number(item2)
            );
        }),
        isLoading: computed(() => state.loading()),
        hasError: computed(() => state.error() !== null),
    })),

    withMethods((store, dataService = inject(DataService)) => ({
        loadData() {
            // Update loading state.
            patchState(store, (state) => ({ loading: true, error: null }));

            dataService.getFoldersAndItems().subscribe({
                next: ({ folders, items }) => {
                    const folderEntities: TreeNodeInner[] = [];
                    const itemEntities: TreeNodeInner[] = [];

                    // Convert folders to tree nodes.
                    folders.forEach(folder => {
                        folderEntities.push({
                            // Keeping folder id unique.
                            id: `folder_${folder.id}`,
                            title: folder.title,
                            type: EntityType.FOLDER,
                            parent_id: folder.parent_id ? `folder_${folder.parent_id}` : null,
                        });
                    });

                    // Convert items to tree nodes.
                    items.forEach(item => {
                        itemEntities.push({
                            id: item.id.toString(),
                            title: item.title,
                            type: EntityType.ITEM,
                            parent_id: item.folder_id ? `folder_${item.folder_id}` : null,
                        });
                    });

                    // Update state with loaded data.
                    patchState(store, (state) => ({ folders: folderEntities, items: itemEntities, loading: false }));
                },
                error: (error) => {
                    patchState(store, (state) => ({ error: error.message || 'Failed to load data', loading: false }));
                }
            });
        },

        toggleSelection(node: TreeNode) {
            const currentSelectedMap = store.selectedMap();
            const newSelectedMap = new Map(currentSelectedMap);
            const currentSelectionType = node.selectionType;
            const newSelectionType = 
                // This condition unselects INDETERMINATE as well.
                currentSelectionType === SelectionType.UNSELECTED ? SelectionType.SELECTED : SelectionType.UNSELECTED;

            const setSelected = (node: TreeNode, newSelectionType: SelectionType) => {
                if (node.type === EntityType.ITEM) {
                    newSelectedMap.set(node.id, newSelectionType);
                }
                else {
                    node.children?.forEach((childNode: TreeNode) => setSelected(childNode, newSelectionType))
                }
            }

            setSelected(node, newSelectionType);

            patchState(store, { selectedMap: newSelectedMap })
        },

        toggleCollapsed(node: TreeNode) {
            const currentCollapsedMap = store.collapsedMap();
            const newCollapsedMap = new Map(currentCollapsedMap);
            
            newCollapsedMap.set(node.id, !(newCollapsedMap.get(node.id) ?? false));

            patchState(store, { collapsedMap: newCollapsedMap });
        },

        unselectAllItems() {
            patchState(store, { selectedMap: new Map() });
        },
    }))
) { }
