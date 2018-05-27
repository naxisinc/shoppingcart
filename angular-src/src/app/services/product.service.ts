import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ProductService {

  constructor(private http: Http) { }

  getProducts(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/products', {headers: headers})
      .map(res => res.json());
  }

}
