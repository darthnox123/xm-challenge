export interface Photo {
  id: string;
  author: string;
  downloadUrl: string;
}

export function buildPhotoUrl(id: string, width: number, height: number): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}
