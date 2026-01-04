import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { KocListComponent } from './koc-list/koc-list.component';
import { AddKocComponent } from './add-koc/add-koc.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'koc-list', component: KocListComponent },
  { path: 'add-koc', component: AddKocComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Dùng RouterModule.forRoot để cấu hình routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
