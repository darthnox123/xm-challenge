import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

import { PhotosListComponent } from './photos-list.component';
import { PhotoApiService } from '../../../core/services/photo-api.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Photo } from '../../../core/models/photo.model';

describe('PhotosListComponent', () => {
  let fixture: ComponentFixture<PhotosListComponent>;
  let component: PhotosListComponent;
  let getPhotosSpy: jasmine.Spy;
  let addSpy: jasmine.Spy;
  let getPhotosSubject: Subject<Photo[]>;

  const photoA: Photo = { id: 'a', author: 'A', downloadUrl: 'https://picsum.photos/id/a/200/300' };
  const photoB: Photo = { id: 'b', author: 'B', downloadUrl: 'https://picsum.photos/id/b/200/300' };

  beforeEach(() => {
    getPhotosSubject = new Subject<Photo[]>();
    getPhotosSpy = jasmine.createSpy('getPhotos').and.returnValue(getPhotosSubject.asObservable());
    addSpy = jasmine.createSpy('add');

    TestBed.configureTestingModule({
    imports: [PhotosListComponent],
    providers: [
        { provide: PhotoApiService, useValue: { getPhotos: getPhotosSpy } },
        {
            provide: FavoritesService,
            useValue: { favorites$: new Subject<Photo[]>().asObservable(), add: addSpy }
        }
    ],
    schemas: [NO_ERRORS_SCHEMA]
});
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(PhotosListComponent);
    component = fixture.componentInstance;
  }

  it('loads a batch of photos on init', () => {
    createComponent();
    fixture.detectChanges();

    expect(getPhotosSpy).toHaveBeenCalledTimes(1);
    getPhotosSubject.next([photoA, photoB]);

    expect(component.photos).toEqual([photoA, photoB]);
  });

  it('adds a photo to favorites on selection without navigating', () => {
    createComponent();
    fixture.detectChanges();
    getPhotosSubject.next([photoA]);

    component.onPhotoSelected(photoA);

    expect(addSpy).toHaveBeenCalledWith(photoA);
  });

  it('ignores loadPhotos calls while a request is already in flight', () => {
    createComponent();
    fixture.detectChanges();

    component.loadPhotos();

    expect(getPhotosSpy).toHaveBeenCalledTimes(1);
  });

  it('de-duplicates photos that reappear across batches', () => {
    createComponent();
    fixture.detectChanges();
    getPhotosSubject.next([photoA, photoB]);

    getPhotosSubject = new Subject<Photo[]>();
    getPhotosSpy.and.returnValue(getPhotosSubject.asObservable());
    component.loadPhotos();
    getPhotosSubject.next([photoA]);

    expect(component.photos).toEqual([photoA, photoB]);
  });

  it('sets an error flag and stops loading when the request fails', () => {
    createComponent();
    fixture.detectChanges();

    getPhotosSubject.error(new Error('network down'));

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('clears the error flag and allows retrying', () => {
    createComponent();
    fixture.detectChanges();
    getPhotosSubject.error(new Error('network down'));

    getPhotosSubject = new Subject<Photo[]>();
    getPhotosSpy.and.returnValue(getPhotosSubject.asObservable());
    component.loadPhotos();

    expect(component.error).toBeFalse();
    getPhotosSubject.next([photoA]);
    expect(component.photos).toEqual([photoA]);
  });
});
