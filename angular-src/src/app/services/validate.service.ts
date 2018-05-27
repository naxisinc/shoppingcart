import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateBt_1_99 (value) {
    const re = /^[1-9][0-9]?$/;
    return re.test(value);
  }

  validateRegister(user){
    if(user.name == undefined || user.email == undefined || user.password == undefined ||
      user.name == '' || user.email == '' || user.password == ''){
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
