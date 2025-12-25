import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })

@Component({
  selector: 'app-root',  // Có thể để app-root nếu muốn, nhưng không sao
  // standalone: true,
  imports: [
    CommonModule,
    RouterLink,     // Để routerLink trên button hoạt động
    RouterOutlet    // QUAN TRỌNG: Để hiển thị các trang con
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  totalKoc: number = 20;  // Dữ liệu giả
  totalVideos: number = 50;  // Dữ liệu giả
  totalGMV: number = 10000;  // Dữ liệu giả

  constructor() { }

  ngOnInit(): void {
    // Logic để lấy dữ liệu từ backend (nếu có)
  }
}
