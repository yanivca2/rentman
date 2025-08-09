import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SelectableTreeStore } from '../../stores/selectable-tree.store';
import { EventEmitterData, SelectionTreeComponent } from '../selection-tree/selection-tree.component';
import { TreeNode } from '../../common/types';

@Component({
  selector: 'selection-tree-panel',
  standalone: true,
  imports: [SelectionTreeComponent],
  templateUrl: './selection-tree-panel.component.html',
  styleUrl: './selection-tree-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionTreePanelComponent implements OnInit {
  constructor(private store: SelectableTreeStore) {}

  get treeData(): TreeNode[] {
    return this.store.treeStructure();
  }

  get isLoading(): boolean {
    return this.store.isLoading();
  }

  get hasError(): boolean {
    return this.store.hasError();
  }

  get selectedIds(): string[] {
    return this.store.selectedIds();
  }

  ngOnInit() {
    this.store.loadData();
  }

  onSelectionToggle({node}: EventEmitterData) {
    this.store.toggleSelection(node);
  }

  onCollapseToggle({node}: EventEmitterData) {
    this.store.toggleCollapsed(node);
  }

  onClearSelectionClick() {
    this.store.unselectAllItems();
  }
} 