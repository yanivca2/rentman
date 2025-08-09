export const enum EntityType {
    ITEM,
    FOLDER,
};

export enum SelectionType {
    UNSELECTED,
    INDETERMINATE,
    SELECTED,
};

export interface TreeNode {
    id: string;
    title: string;
    type: EntityType;
    parent_id: string | null;
    children?: TreeNode[];
    collapsed?: boolean;
    selectionType?: SelectionType;
}
