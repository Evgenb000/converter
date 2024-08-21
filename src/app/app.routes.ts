import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'cart', component: AppComponent },
  { path: 'contact-us', component: AppComponent },
  { path: 'about-us', component: AppComponent },
];
