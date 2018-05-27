import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ShoppingcarService {

  private qtySource = new BehaviorSubject<number>(0);
  currentQty = this.qtySource.asObservable();

  constructor(private http: Http) { }

  updatingQty(shoppingcartQtyItems: number) {
    this.qtySource.next(shoppingcartQtyItems);
  }

  changeQtyOfItems(data){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/cart/change-qty', data, {headers: headers})
      .map(res => res.json());
  }

  getItemsByUserID(UserData){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/cart/my-items', UserData, {headers: headers})
      .map(res => res.json());
  }
  
  addCar(newCart){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/cart/addcart', newCart, {headers: headers})
      .map(res => res.json());
  }
  
  getShoppingCart(userID){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/cart/'+userID, {headers: headers})
      .map(res => res.json());
  }

  removeItem(ids){
    return this.http.delete('http://localhost:3000/cart/'+ids.idCart+'/'+ids.idProd)
      .map(res => res.json());
  }

  checkout(data){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/cart/pay', data, {headers: headers})
      .map(res => res.json());
  }
  

}
