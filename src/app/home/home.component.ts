import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products!: any[];

  limit = 10;
  page = 1;

  totalProducts = 0;
  totalPages = 0;

  searchForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private _http: HttpClient,
    private _route: Router) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchText: new FormControl(''),
    });

    this.searchForm.controls.searchText.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(value => {
        this.totalPages = 0;
        this.getFilteredProducts(value);
      })

    this._http.get<any>("http://localhost:3000/products")
      .subscribe({
        next: (response) => {
          this.totalProducts = response.length;
        },
        error: () => {
        }
      });
    this.totalPages = 0;
    this.getFilteredProducts();
  }

  searchProduct(): void {
    this.totalPages = 0;
    this.getFilteredProducts();
  }

  limitChange(): void {
    this.totalPages = 0;
    this.getFilteredProducts();
  }

  pageChange(isPrevious: boolean): void {
    if (isPrevious) {
      if (this.page > 1) {
        this.page = this.page - 1;
      }
    } else {
      if (this.page < this.totalPages) {
        this.page = this.page + 1;
      }
    }
    if (this.page < 1 || this.page > this.totalPages) {
      return
    }
    this.getFilteredProducts();
  }

  getFilteredProducts(searchText?: string): void {
    let params = new HttpParams().set('_page', this.page).set('_limit', this.limit);
    if (searchText && searchText !== '') {
      params = params.set('q', searchText);
    }
    this._http.get<any>(`http://localhost:3000/products?${params}`)
      .subscribe({
        next: (response) => {
          this.products = response;
          if (this.totalPages === 0) {
            this.totalPages = Math.round(this.totalProducts / this.limit);
          }
        },
        error: () => {
        }
      });
  }

}
