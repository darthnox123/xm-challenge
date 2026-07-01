import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Photo, buildPhotoUrl } from '../../../core/models/photo.model';
import { FavoritesService } from '../../../core/services/favorites.service';

import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-photo-detail',
    templateUrl: './photo-detail.component.html',
    styleUrls: ['./photo-detail.component.scss'],
    imports: [MatButton]
})
export class PhotoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoritesService = inject(FavoritesService);

  photo: Photo | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.photo = id ? this.favoritesService.getById(id) : undefined;

    if (!this.photo) {
      this.router.navigate(['/favorites']);
    }
  }

  get imageUrl(): string {
    return this.photo ? buildPhotoUrl(this.photo.id, 800, 1200) : '';
  }

  onRemove(): void {
    if (!this.photo) {
      return;
    }
    this.favoritesService.remove(this.photo.id);
    this.router.navigate(['/favorites']);
  }
}
