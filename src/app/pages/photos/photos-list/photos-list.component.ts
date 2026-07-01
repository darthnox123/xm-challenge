import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { Photo } from '../../../core/models/photo.model';
import { PhotoApiService } from '../../../core/services/photo-api.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { AsyncPipe } from '@angular/common';
import { PhotoCardComponent } from '../../../shared/components/photo-card/photo-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  imports: [PhotoCardComponent, LoadingSpinnerComponent, MatButton, AsyncPipe]
})
export class PhotosListComponent implements OnInit {
  private readonly photoApiService = inject(PhotoApiService);
  private readonly favoritesService = inject(FavoritesService);

  private readonly batchSize = 24;
  private readonly scrollThreshold = 200;
  private readonly seenIds = new Set<string>();

  photos: Photo[] = [];
  loading = false;
  error = false;
  favoriteIds$: Observable<Set<string>> = this.favoritesService.favorites$.pipe(
    map(favorites => new Set(favorites.map(p => p.id)))
  );

  ngOnInit(): void {
    this.loadPhotos();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  loadPhotos(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.error = false;
    this.photoApiService
      .getPhotos(this.batchSize)
      .pipe(finalize(() => {
        this.loading = false;
        if (!this.error) {
          this.checkScrollPosition();
        }
      }))
      .subscribe({
        next: batch => {
          const newPhotos = batch.filter(photo => !this.seenIds.has(photo.id));
          newPhotos.forEach(photo => this.seenIds.add(photo.id));
          this.photos = [...this.photos, ...newPhotos];
        },
        error: err => {
          this.error = true;
          console.error('Failed to load photos', err);
        }
      });
  }

  onPhotoSelected(photo: Photo): void {
    this.favoritesService.add(photo);
  }

  private checkScrollPosition(): void {
    if (this.loading) {
      return;
    }
    const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - this.scrollThreshold;
    if (scrolledToBottom) {
      this.loadPhotos();
    }
  }
}
