import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PhotoApiService } from './photo-api.service';

describe('PhotoApiService', () => {
  let service: PhotoApiService;
  let httpMock: HttpTestingController;

  const rawItem = {
    id: '0',
    author: 'Alejandro Escamilla',
    width: 5000,
    height: 3333,
    url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
    download_url: 'https://picsum.photos/id/0/5000/3333'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotoApiService]
    });
    service = TestBed.inject(PhotoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the picsum v2 list endpoint with a page in range and the requested limit', fakeAsync(() => {
    service.getPhotos(24).subscribe();

    const req = httpMock.expectOne(r => r.url === 'https://picsum.photos/v2/list');
    expect(req.request.method).toBe('GET');

    const page = Number(req.request.params.get('page'));
    expect(page).toBeGreaterThanOrEqual(1);
    expect(page).toBeLessThanOrEqual(100);
    expect(req.request.params.get('limit')).toBe('24');

    req.flush([rawItem]);
    tick(300);
  }));

  it('maps the raw picsum response to the Photo model', fakeAsync(() => {
    let result: any;
    service.getPhotos(1).subscribe(photos => (result = photos));

    const req = httpMock.expectOne(r => r.url === 'https://picsum.photos/v2/list');
    req.flush([rawItem]);
    tick(300);

    expect(result).toEqual([
      { id: '0', author: 'Alejandro Escamilla', downloadUrl: 'https://picsum.photos/id/0/5000/3333' }
    ]);
  }));

  it('delays the emission to simulate real API latency', fakeAsync(() => {
    let emitted = false;
    service.getPhotos(1).subscribe(() => (emitted = true));

    const req = httpMock.expectOne(r => r.url === 'https://picsum.photos/v2/list');
    req.flush([rawItem]);

    tick(199);
    expect(emitted).toBeFalse();

    tick(101);
    expect(emitted).toBeTrue();
  }));
});
