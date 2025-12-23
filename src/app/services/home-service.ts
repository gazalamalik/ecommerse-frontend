import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductCategoryDto, ProductDto, ProductFiltersDto } from '../models/productDto.model';
import { BannerDto } from '../models/CommonHome.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
   private apiUrl = environment.homeApiUrl;
   constructor(private http: HttpClient) {}

  //get Banner data
  getBanners(): Observable<BannerDto[]> {
    return this.http.get<BannerDto[]>(`${this.apiUrl}/Banners`);
  }
  //get Categories data 
  getCategories(): Observable<ProductCategoryDto[]> {
    return this.http.get<ProductCategoryDto[]>(`${this.apiUrl}/Categories`);
  } 
  //get product data 
  getProductData(categoryId: number): Observable<ProductDto[]> {
   return this.http.get<ProductDto[]>(`${this.apiUrl}/products/${categoryId}`);
  }
  getFilterOptions(categoryId: number): Observable<ProductFiltersDto> {
    return this.http.get<ProductFiltersDto>(`${this.apiUrl}/filters/${categoryId}`);
  }
}



