import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  productId!: number;
  product!: any;

  constructor(private activatedRoute: ActivatedRoute, private _http: HttpClient) { }

  ngOnInit(): void {
    console.log('sdsaasdads')
    this.activatedRoute.queryParams.subscribe((param) => {
      console.log('param', param)
      if (param.id) {
        this.productId = Number(param.id);
        this.getProductDetail();
      } else {
        // no id found
      }
    });
  }

  getProductDetail(): void {
    let params = new HttpParams().set('id', this.productId);
    this._http.get<any>(`http://localhost:3000/products?${params}`)
      .subscribe({
        next: (response) => {
          this.product = response[0];
        },
        error: () => {
        }
      });
  }

}
