import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  addShippingAddressToUser(address) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/shipping-address/', address, {headers: headers})
      .map(res => res.json());
  }

  getShippingAddress(userID) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/users/shipping-address/'+userID, {headers: headers})
      .map(res => res.json());
  }
  
  // Esta ruta esta en desuso en la app,
  // la cree para poder borrar address facilmente
  delShippingAddress(ids) {
    return this.http.delete('http://localhost:3000/users/shipping-address/'+ids.idUser+'/'+ids.idShippingAddress)
      .map(res => res.json());
  }

}
