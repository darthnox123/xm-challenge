import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { Photo } from '../models/photo.model';

describe('FavoritesService', () => {
  const photoA: Photo = { id: 'a', author: 'Author A', downloadUrl: 'https://picsum.photos/id/a/200/300' };
  const photoB: Photo = { id: 'b', author: 'Author B', downloadUrl: 'https://picsum.photos/id/b/200/300' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts empty when there is nothing in storage', () => {
    const service = TestBed.inject(FavoritesService);
    expect(service.getById('a')).toBeUndefined();
    service.favorites$.subscribe(favorites => expect(favorites).toEqual([]));
  });

  it('adds a photo and persists it to localStorage', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(photoA);

    expect(service.isFavorite('a')).toBeTrue();
    const stored = JSON.parse(localStorage.getItem('gallery.favorites.v1') as string);
    expect(stored).toEqual([photoA]);
  });

  it('does not add the same photo twice', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(photoA);
    service.add(photoA);

    let count = 0;
    service.favorites$.subscribe(favorites => (count = favorites.length));
    expect(count).toBe(1);
  });

  it('removes a photo and persists the change', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(photoA);
    service.add(photoB);
    service.remove('a');

    expect(service.isFavorite('a')).toBeFalse();
    expect(service.isFavorite('b')).toBeTrue();
    const stored = JSON.parse(localStorage.getItem('gallery.favorites.v1') as string);
    expect(stored).toEqual([photoB]);
  });

  it('hydrates from pre-existing localStorage on construction', () => {
    localStorage.setItem('gallery.favorites.v1', JSON.stringify([photoA]));
    const service = TestBed.inject(FavoritesService);

    expect(service.isFavorite('a')).toBeTrue();
    expect(service.getById('a')).toEqual(photoA);
  });

  it('falls back to an empty list when storage contains corrupted JSON', () => {
    localStorage.setItem('gallery.favorites.v1', '{not valid json');
    const service = TestBed.inject(FavoritesService);

    expect(service.getById('a')).toBeUndefined();
    service.favorites$.subscribe(favorites => expect(favorites).toEqual([]));
  });
});
