import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatProgressSpinnerModule, LoadingSpinnerComponent]
});
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.detectChanges();
  });

  it('renders without error', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a spinner and loading text', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-spinner')).not.toBeNull();
    expect(el.textContent).toContain('Loading...');
  });
});
