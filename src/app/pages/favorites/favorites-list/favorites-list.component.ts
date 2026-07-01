import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Photo } from '../../../core/models/photo.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { AsyncPipe } from '@angular/common';
import { PhotoCardComponent } from '../../../shared/components/photo-card/photo-card.component';

@Component({
    selector: 'app-favorites-list',
    templateUrl: './favorites-list.component.html',
    styleUrls: ['./favorites-list.component.scss'],
    imports: [PhotoCardComponent, AsyncPipe]
})
export class FavoritesListComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  favorites$: Observable<Photo[]> = this.favoritesService.favorites$;

  onPhotoSelected(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
