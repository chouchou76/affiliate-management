import { Component } from '@angular/core';
import { AddKocComponent } from './add-koc/add-koc.component';
import { KocListComponent } from './koc-list/koc-list.component';

@Component({
  selector: 'app-root',
  template: `<h1>Welcome to the TikTok Management Dashboard!</h1>`,
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'tiktok-management-dashboard';
  kocList: any[] = [];

  updateKocList(kocData: any): void {
    this.kocList = [...this.kocList, kocData]; 
    console.log('Updated kocList:', this.kocList);
  }
}