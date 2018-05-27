import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../node_modules/ng-mdb-pro/pro/alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private toastrService: ToastService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    }

    //console.log(user);
    
    //Required Fields
    if(!this.validateService.validateRegister(user)){
      this.toastrService.error('Please fill in all fields');
      return false;
    }
    
    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.toastrService.error('Please use a valid email');
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.toastrService.success('You are registered, now you can log in');
        this.router.navigate(['/login']);
      } else {
        this.toastrService.error('Something was wrong');
        this.router.navigate(['/register']);
      }
    });
  }

  

}
