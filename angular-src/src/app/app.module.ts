import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng-mdb-pro/pro/alerts';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { ShoppingcarService } from './services/shoppingcar.service';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from './services/user.service';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductComponent } from './components/product/product.component';
import { ShoppingcartComponent } from './components/shoppingcart/shoppingcart.component';
import { TesterComponent } from './components/tester/tester.component';


const appRoutes = [
  { path:'', component: HomeComponent },
  { path:'tester', component: TesterComponent },
  { path:'register', component: RegisterComponent },
  { path:'login', component: LoginComponent },
  { path:'products', component: ProductComponent },
  { path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
  { path:'profile', component: ProfileComponent, canActivate:[AuthGuard] },
  { path:'cart', component: ShoppingcartComponent, canActivate:[AuthGuard] }
]


@NgModule({
  declarations: [ // Aqui van todos los componentes
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    ProductComponent,
    ShoppingcartComponent,
    TesterComponent
  ],
  imports: [  // Aqui van todos los modulos
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MDBBootstrapModules.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'Your_api_key' }),
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [  // Aqui van todos los servicios
    MDBSpinningPreloader,
    ValidateService,
    AuthService,
    AuthGuard,
    ProductService,
    ShoppingcarService,
    UserService
  ],
  bootstrap: [AppComponent],  // Aqui va el componente dnd va a arrancar la app
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
