import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { HeaderComponent } from './header.component';

@Component({
    template: '',
    imports: [MatToolbarModule,
        MatButtonModule]
})
class DummyComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        MatToolbarModule,
        MatButtonModule,
        RouterTestingModule.withRoutes([
            { path: '', component: DummyComponent },
            { path: 'favorites', component: DummyComponent }
        ]),
        HeaderComponent, DummyComponent
    ]
}).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('highlights Photos as active when on /', async () => {
    await router.navigate(['/']);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('active')).toBeTrue();
    expect(buttons[1].classList.contains('active')).toBeFalse();
  });

  it('highlights Favorites as active when on /favorites', async () => {
    await router.navigate(['/favorites']);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('active')).toBeFalse();
    expect(buttons[1].classList.contains('active')).toBeTrue();
  });
});
