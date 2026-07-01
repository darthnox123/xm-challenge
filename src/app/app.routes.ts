import { Routes } from '@angular/router';

import { PhotosListComponent } from './pages/photos/photos-list/photos-list.component';
import { FavoritesListComponent } from './pages/favorites/favorites-list/favorites-list.component';
import { PhotoDetailComponent } from './pages/favorites/photo-detail/photo-detail.component';

export const routes: Routes = [
  { path: '', component: PhotosListComponent },
  { path: 'favorites', component: FavoritesListComponent },
  { path: 'photos/:id', component: PhotoDetailComponent },
  { path: '**', redirectTo: '' }
];
