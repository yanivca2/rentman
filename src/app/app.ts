import { Component, signal, inject, OnInit } from '@angular/core';
import { SelectionTreePanelComponent } from './components/selection-tree-panel/selection-tree-panel.component';

@Component({
  selector: 'app-root',
  imports: [SelectionTreePanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Rentman Selection tree');
}
