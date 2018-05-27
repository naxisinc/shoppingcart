import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ShoppingcarService } from '../../services/shoppingcar.service';
import { ToastService } from '../../../../node_modules/ng-mdb-pro/pro/alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;

  constructor(
    private authService: AuthService,
    private toastrService: ToastService,
    private shoppingcarService: ShoppingcarService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      email: this.email,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success)
      {
        this.authService.storeUserData(data.token, data.user);
        this.toastrService.success('You are logged in');
        this.router.navigate(['dashboard']);
        
        // obteniendo la cantidad de items en el cart para este user
        this.shoppingcarService.getItemsByUserID(data.user).subscribe(data => {
          if(data.success){
            // almacenando la cantidad de items
            localStorage.setItem('cart', data.qty);

            // poner el valor en el icon
            this.shoppingcarService.updatingQty(data.qty);
          } else {
            console.log(data.msg);
          }
        });
        
      } else {
        this.toastrService.error(data.msg);
        this.router.navigate(['login']);
      }
    });
    
    
  }

}
