import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'gallery.favorites.v1';
  private readonly favoritesSubject = new BehaviorSubject<Photo[]>(this.readStorage());

  readonly favorites$: Observable<Photo[]> = this.favoritesSubject.asObservable();

  add(photo: Photo): void {
    const current = this.favoritesSubject.value;
    if (current.some(p => p.id === photo.id)) {
      return;
    }
    this.writeStorage([...current, photo]);
  }

  remove(id: string): void {
    const current = this.favoritesSubject.value;
    this.writeStorage(current.filter(p => p.id !== id));
  }

  isFavorite(id: string): boolean {
    return this.favoritesSubject.value.some(p => p.id === id);
  }

  getById(id: string): Photo | undefined {
    return this.favoritesSubject.value.find(p => p.id === id);
  }

  private readStorage(): Photo[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private writeStorage(photos: Photo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(photos));
    this.favoritesSubject.next(photos);
  }
}
