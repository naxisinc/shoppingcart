import { Component, OnInit, ViewChild  } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ShoppingcarService } from '../../services/shoppingcar.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../node_modules/ng-mdb-pro/pro/alerts';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Object;
  @ViewChild('frame') public contentModal;
  
  constructor(
    private productService: ProductService,
    private shoppingcarService: ShoppingcarService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      if(data.success){
        this.products = data.products;
      } else {
        console.log('something is wrong with products');
      }
    });
  }

  addProdToTheCar(idProd) {
    if(!this.authService.loggedIn()) {
      this.router.navigate(['login']);
      //more thing
    }
    else {
      var session = JSON.parse(localStorage.getItem('user')); //getting the session values
      
      // creando un objeto Cart
      var newCart = {
        idUser : session.id,
        idProd : idProd
      }

      this.shoppingcarService.addCar(newCart).subscribe(data => {
        if(data.success){
          // Updating shoppingcart badget and localStorage
          var value = JSON.parse(localStorage.getItem('cart'));
          localStorage.setItem('cart', value + 1);
          this.shoppingcarService.updatingQty(value + 1);

          this.contentModal.show();

          this.toastService.success(data.msg);
        } else {
          this.toastService.warning(data.msg);
        }
      });
    }
  }


}
