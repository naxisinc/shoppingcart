import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ShoppingcarService } from '../../services/shoppingcar.service';
import { ToastService } from '../../../../node_modules/ng-mdb-pro/pro/alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  shoppingcartQtyItems: number;

  constructor(
    private authService: AuthService,
    private shoppingcarService: ShoppingcarService,
    private toastrService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    //al refrescar la pagina pierdo la info q esta en el service por lo tanto necesitaba guardar
    //el numero de items del carro en el localStorage para q cuando se refresque la pagina poder
    //asignarlo nuevamente al servicio y una vez en el servivio poder usarlo 
    this.shoppingcarService.updatingQty(JSON.parse(localStorage.getItem('cart')));
    this.shoppingcarService.currentQty.subscribe(shoppingcartQtyItems => this.shoppingcartQtyItems = shoppingcartQtyItems);
  }

  onLogoutClick(){
    this.authService.logout();
    this.toastrService.success('You are logged out');
    this.router.navigate(['login']);
  }

}
