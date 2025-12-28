import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddKocComponent } from './add-koc/add-koc.component';
import { KocListComponent } from './koc-list/koc-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AddKocComponent,
    KocListComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  kocList: any[] = [];

  updateKocList(koc: any) {
    this.kocList.push(koc);
  }
}
