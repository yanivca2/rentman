# Rentman - Selectable Tree Component

This project demonstrates a hierarchical tree selection system where:


## TL;DR

To start the application, including the Angular application and a supporting JSON server, run:
```
npm install
npm run start
```

## Selection System Overview

- **Items** have their selection state stored directly in the `selectedMap` of the store
- **Folders** have their selection state computed based on their children:
  - `SELECTED`: All child items are selected
  - `UNSELECTED`: No child items are selected  
  - `INTERMEDIATE`: Some child items are selected

## Key Features

### Store (`SelectableTreeStore`)
- `treeStructureWithSelection`: Computed property that provides selection state for all nodes
- `toggleItemSelection(node)`: Toggle selection of a specific item
- `toggleCollapsed(node)`: Toggle collapse state of a folder node
- `unselectAllItems()`: Removes all selected items

### Components
- `SelectionTreeComponent`: Recursive tree component that displays nodes with selection icons
- `SelectionTreePanelComponent`: Container component that manages the store and provides selection controls

### Directives
- `IndeterminateDirective`: Set the indetermined state of a checkbox

## Usage

The selection system automatically:
1. Loads tree data from the `DataService`
2. Computes folder selection states based on child items
3. Provides visual indicators for selection states
4. Handles recursive folder selection (selecting a folder selects all its child items)


## A brief note on the project

This project was built with the standard Angular CLI, so many of the initial files were scaffolded automatically. I've organized the project to include a "server" folder in the root directory, which contains the `response.json` file. All other project-specific code I create is located within the folders under `src/app`.

As part of this assessment, I took the opportunity to explore and implement some newer Angular features, including Signals and the NgRx SignalStore, both of which were new to me. This was a fun learning experience and I enjoyed the development process, which took me about a full day of work to complete.

I hope you enjoy reviewing this project as much as I enjoyed working on it. :)