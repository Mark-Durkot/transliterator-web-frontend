import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransliteratorComponent } from './transliterator.component';

describe('TransliteratorComponent', () => {
  let component: TransliteratorComponent;
  let fixture: ComponentFixture<TransliteratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransliteratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransliteratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
