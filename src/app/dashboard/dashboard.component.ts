import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KocData } from '../models/koc.model';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })

@Component({
  selector: 'app-root',  
  // standalone: true,
  imports: [
    CommonModule,
    RouterLink,     
    RouterOutlet    
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor() { }

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

  ngOnInit(): void {
    // Logic để lấy dữ liệu từ backend (nếu có)
  }
}
