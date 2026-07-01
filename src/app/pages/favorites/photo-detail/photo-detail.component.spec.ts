import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

import { PhotoDetailComponent } from './photo-detail.component';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Photo } from '../../../core/models/photo.model';

describe('PhotoDetailComponent', () => {
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let navigateSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;
  let getByIdSpy: jasmine.Spy;

  const photoA: Photo = { id: 'a', author: 'A', downloadUrl: 'https://picsum.photos/id/a/5000/3333' };

  function setup(routeId: string | null): void {
    navigateSpy = jasmine.createSpy('navigate');
    removeSpy = jasmine.createSpy('remove');
    getByIdSpy = jasmine.createSpy('getById').and.returnValue(routeId === 'a' ? photoA : undefined);

    TestBed.configureTestingModule({
    imports: [PhotoDetailComponent],
    providers: [
        { provide: Router, useValue: { navigate: navigateSpy } },
        { provide: FavoritesService, useValue: { getById: getByIdSpy, remove: removeSpy } },
        {
            provide: ActivatedRoute,
            useValue: { snapshot: { paramMap: convertToParamMap(routeId ? { id: routeId } : {}) } }
        }
    ],
    schemas: [NO_ERRORS_SCHEMA]
});

    fixture = TestBed.createComponent(PhotoDetailComponent);
    fixture.detectChanges();
  }

  it('renders the photo found by route id', () => {
    setup('a');
    expect(fixture.componentInstance.photo).toEqual(photoA);
    expect(fixture.nativeElement.querySelector('img').src).toBe('https://picsum.photos/id/a/800/1200');
  });

  it('removes the photo and navigates back to favorites on remove', () => {
    setup('a');
    fixture.componentInstance.onRemove();

    expect(removeSpy).toHaveBeenCalledWith('a');
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });

  it('redirects to favorites when the id is not a favorite', () => {
    setup('missing');
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
    expect(fixture.componentInstance.photo).toBeUndefined();
  });
});
