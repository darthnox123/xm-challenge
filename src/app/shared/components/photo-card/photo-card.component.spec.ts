import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { PhotoCardComponent } from './photo-card.component';
import { Photo } from '../../../core/models/photo.model';

describe('PhotoCardComponent', () => {
  let fixture: ComponentFixture<PhotoCardComponent>;
  let component: PhotoCardComponent;

  const photo: Photo = { id: '42', author: 'Jane Doe', downloadUrl: 'https://picsum.photos/id/42/5000/3333' };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatIconModule, PhotoCardComponent]
});
    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    component.photo = photo;
    fixture.detectChanges();
  });

  it('renders the thumbnail image', () => {
    const el: HTMLElement = fixture.nativeElement;
    const img = el.querySelector('img') as HTMLImageElement;

    expect(img.src).toBe('https://picsum.photos/id/42/300/300');
    expect(img.alt).toBe('Jane Doe');
  });

  it('does not show the favorite badge by default', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.favorite-badge')).toBeNull();
  });

  it('shows the favorite badge when isFavorite is true', () => {
    component.isFavorite = true;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.favorite-badge')).not.toBeNull();
  });

  it('emits select with the photo on click', () => {
    let emitted: Photo | undefined;
    component.select.subscribe(p => (emitted = p));

    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('.photo-card') as HTMLElement).click();

    expect(emitted).toEqual(photo);
  });
});
