import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { FavoritesListComponent } from './favorites-list.component';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Photo } from '../../../core/models/photo.model';

describe('FavoritesListComponent', () => {
  let fixture: ComponentFixture<FavoritesListComponent>;
  let component: FavoritesListComponent;
  let navigateSpy: jasmine.Spy;

  const photoA: Photo = { id: 'a', author: 'A', downloadUrl: 'https://picsum.photos/id/a/200/300' };

  beforeEach(() => {
    navigateSpy = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
    imports: [FavoritesListComponent],
    providers: [
        { provide: FavoritesService, useValue: { favorites$: of([photoA]) } },
        { provide: Router, useValue: { navigate: navigateSpy } }
    ],
    schemas: [NO_ERRORS_SCHEMA]
});

    fixture = TestBed.createComponent(FavoritesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a card for each favorite', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('app-photo-card').length).toBe(1);
  });

  it('navigates to the detail page when a photo is selected', () => {
    component.onPhotoSelected(photoA);
    expect(navigateSpy).toHaveBeenCalledWith(['/photos', 'a']);
  });
});
