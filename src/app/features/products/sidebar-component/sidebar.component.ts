import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() categories: string[] = [];
  @Input() brands: string[] = [];
  @Input() colors: string[] = [];
  @Input() discounts: number[] = [];
  @Input() priceRange!: { min: number; max: number };
  selectedPrice!: number;
  @Input() selectedCategories: string[] = [];

  @Output() categoryChange = new EventEmitter<string>();
  @Output() brandChange = new EventEmitter<string>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() discountChange = new EventEmitter<number>();
  @Output() priceChange = new EventEmitter<number>();

  toggleCategory(cat: string) { this.categoryChange.emit(cat); }
  toggleBrand(brand: string) { this.brandChange.emit(brand); }
  toggleColor(color: string) { this.colorChange.emit(color); }
  toggleDiscount(discount: number) { this.discountChange.emit(discount); }
  ngOnChanges(): void {
  if (this.priceRange) {
    this.selectedPrice = this.priceRange.max;
    }
  }

  isSelected(cat: string): boolean {
    return this.selectedCategories.includes(cat);
  }
}

