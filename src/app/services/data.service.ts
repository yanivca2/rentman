import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, combineLatestWith } from 'rxjs';

type Column = 'id' | 'title' | 'parent_id'

export interface Entity {
  id: number;
  title: string;
}

export interface Item extends Entity {
  folder_id: number;
}

export interface Folder extends Entity {
  parent_id: number | null;
}

interface ServerResponse {
  columns: Column[];
  data: (number | string | null)[][];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all folders from the server
   * @returns Observable of Folder array
   */
  getFolders(): Observable<Folder[]> {
    return this.http.get<ServerResponse>(`${this.baseUrl}/folders`).pipe(
      map(response => {
        return this.parseFolders(response)})
    );
  }

  /**
   * Retrieves all items from the server
   * @returns Observable of Item array
   */
  getItems(): Observable<Item[]> {
    return this.http.get<ServerResponse>(`${this.baseUrl}/items`).pipe(
      map(response => {
        return this.parseItems(response)})
    );
  }

  /**
   * Retrieves both folders and items from the server
   * @returns Observable with both folders and items
   */
  getFoldersAndItems(): Observable<{ folders: Folder[], items: Item[] }> {
    return this.getFolders().pipe(
      combineLatestWith(this.getItems()),
      map(([folders, items]) => ({
        folders,
        items
      }))
    );
  }

  /**
   * Parses the server response format for folders into Folder objects
   * @param foldersData The raw folders data from server
   * @returns Array of Folder objects
   */
  private parseFolders(foldersData: ServerResponse): Folder[] {
    return this.parseEntity<Folder>(foldersData);
  }

  /**
   * Parses the server response format for items into Item objects
   * @param itemsData The raw items data from server
   * @returns Array of Item objects
   */
  private parseItems(itemsData: ServerResponse): Item[] {
    return this.parseEntity<Item>(itemsData);
  }

  private parseEntity<T>(foldersData: ServerResponse): T[] {
    return foldersData.data.map(row => {
      return foldersData.columns.reduce<T>((accumulated: T, currentColumn: Column, currentIndex: number) => {
        return {
          ...accumulated,
          [currentColumn]: row[currentIndex]
        };
      }, {} as T);
    });
  }
}
