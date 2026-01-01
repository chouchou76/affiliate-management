import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddKocComponent } from './add-koc/add-koc.component';
import { KocListComponent } from './koc-list/koc-list.component';
import { KocService } from './services/koc.service';
import { KocData } from './models/koc.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddKocComponent,
    KocListComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  kocList: KocData[] = [];

  constructor(private kocService: KocService) {
    this.loadData();
  }

  loadData() {
    this.kocService.getKocs().subscribe(data => {
      this.kocList = data;
    });
  }
  reloadKocs() {}
  onSaved() {}

  selectedKoc: KocData | null = null;
  showPopup = false;

  openAdd() {
    this.selectedKoc = null;
    this.showPopup = true;
  }

  openEdit(koc: KocData) {
    this.selectedKoc = koc;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedKoc = null;
  }
}