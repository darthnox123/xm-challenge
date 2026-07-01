import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Photo, buildPhotoUrl } from '../../../core/models/photo.model';

import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-photo-card',
    templateUrl: './photo-card.component.html',
    styleUrls: ['./photo-card.component.scss'],
    imports: [MatIcon]
})
export class PhotoCardComponent {
  @Input() photo!: Photo;
  @Input() isFavorite = false;
  @Output() select = new EventEmitter<Photo>();

  get thumbnailUrl(): string {
    return buildPhotoUrl(this.photo.id, 300, 300);
  }

  onClick(): void {
    this.select.emit(this.photo);
  }
}
