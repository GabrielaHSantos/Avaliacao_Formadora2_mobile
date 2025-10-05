import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DadosApiPage } from './dados-api.page';

describe('DadosApiPage', () => {
  let component: DadosApiPage;
  let fixture: ComponentFixture<DadosApiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
