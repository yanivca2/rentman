import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionType, TreeNode } from '../../common/types';
import { IndeterminateDirective } from '../../directives/indeterminate';

export interface EventEmitterData {
  node: TreeNode;
}

@Component({
  selector: 'selection-tree',
  standalone: true,
  imports: [CommonModule, IndeterminateDirective],
  templateUrl: './selection-tree.component.html',
  styleUrl: './selection-tree.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionTreeComponent {
  @Input() treeData: TreeNode[] = [];
  @Input() level = 1;
  @Output() toggleSelection = new EventEmitter<EventEmitterData>();
  @Output() toggleCollapsed = new EventEmitter<EventEmitterData>();

  readonly SelectionType = SelectionType;

  onToggleSelection(node: TreeNode) {
    this.toggleSelection.emit({ node });
  }

  onChildToggleSelection({node}: EventEmitterData) {
    this.toggleSelection.emit({ node });
  }

  onToggleCollapsed(node: TreeNode) {
    this.toggleCollapsed.emit({ node });
  }

  onChildToggleCollapsed({node}: EventEmitterData) {
    this.toggleCollapsed.emit({ node });
  }
} 