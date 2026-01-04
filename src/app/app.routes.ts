import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KocListComponent } from './koc-list/koc-list.component';


export const routes: Routes = [
  { path: '', redirectTo: 'koc-list', pathMatch: 'full' },  // trang mặc định
  { path: 'dashboard', component: DashboardComponent },
  { path: 'koc-list', component: KocListComponent },
];