import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSummary } from './product-summary';

describe('ProductSummary', () => {
  let component: ProductSummary;
  let fixture: ComponentFixture<ProductSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
