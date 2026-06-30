import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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
  private readonly listUrl = 'https://picsum.photos/v2/list';
  private readonly maxPage = 100;
  private readonly minDelayMs = 200;
  private readonly maxDelayMs = 300;

  constructor(private readonly http: HttpClient) {}

  getPhotos(limit: number): Observable<Photo[]> {
    const params = new HttpParams()
      .set('page', this.randomPage())
      .set('limit', limit);

    return this.http.get<PicsumListItem[]>(this.listUrl, { params }).pipe(
      map(items => items.map(item => this.toPhoto(item))),
      delay(this.randomDelayMs())
    );
  }

  private toPhoto(item: PicsumListItem): Photo {
    return {
      id: item.id,
      author: item.author,
      downloadUrl: item.download_url
    };
  }

  private randomPage(): number {
    return Math.floor(Math.random() * this.maxPage) + 1;
  }

  private randomDelayMs(): number {
    return this.minDelayMs + Math.random() * (this.maxDelayMs - this.minDelayMs);
  }
}
