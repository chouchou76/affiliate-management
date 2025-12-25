import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css'],
  imports: [CommonModule]
})
export class VideoListComponent implements OnInit {
  videoList = [
    { title: 'Video 1', views: 1000, likes: 500, comments: 50 },
    { title: 'Video 2', views: 2000, likes: 1500, comments: 100 },
    { title: 'Video 3', views: 3000, likes: 2500, comments: 200 },
  ];

  constructor() { }

  ngOnInit(): void {
    // Logic để lấy dữ liệu từ backend (nếu có)
  }
}
