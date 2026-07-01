import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Photo } from '../models/photo.model';

interface PicsumListItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoApiService {
  private readonly http = inject(HttpClient);

  private readonly listUrl = 'https://picsum.photos/v2/list';
  // picsum's dataset has ~990 photos; keep a margin so `page` never runs past the last full page.
  private readonly totalPhotos = 950;
  private readonly maxRetries = 3;
  private readonly minDelayMs = 200;
  private readonly maxDelayMs = 300;

  getPhotos(limit: number, attempt = 0): Observable<Photo[]> {
    const params = new HttpParams()
      .set('page', this.randomPage(limit))
      .set('limit', limit);

    return this.http.get<PicsumListItem[]>(this.listUrl, { params }).pipe(
      map(items => items.map(item => this.toPhoto(item))),
      delay(this.randomDelayMs()),
      switchMap(photos =>
        photos.length === 0 && attempt < this.maxRetries ? this.getPhotos(limit, attempt + 1) : of(photos)
      )
    );
  }

  private toPhoto(item: PicsumListItem): Photo {
    return {
      id: item.id,
      author: item.author,
      downloadUrl: item.download_url
    };
  }

  private randomPage(limit: number): number {
    const maxPage = Math.max(1, Math.floor(this.totalPhotos / limit));
    return Math.floor(Math.random() * maxPage) + 1;
  }

  private randomDelayMs(): number {
    return this.minDelayMs + Math.random() * (this.maxDelayMs - this.minDelayMs);
  }
}
