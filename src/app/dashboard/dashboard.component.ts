import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KocData } from '../models/koc.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-root',  
  // standalone: true,
  imports: [
    CommonModule,
    // RouterLink,     
    // RouterOutlet    
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  period: 'week' | 'month' | '3months' = 'month';

  stats = {
    totalVideos: 12450,
    totalGMV: 8500000000,
    totalViews: 45678900,
    totalKOCs: 320
  };

  ngOnInit() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.loadChart();
  }

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

  changePeriod(period: 'week' | 'month' | '3months') {
    this.period = period;
    this.loadChart();
  }

  loadChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d')!;
    
    // Dữ liệu mẫu - bạn sẽ thay bằng API thực tế
    const data = this.getChartData();

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Doanh thu (GMV)',
            data: data.gmv,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Lượt xem',
            data: data.views,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  getChartData() {
    if (this.period === 'week') {
      return {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        gmv: [120, 180, 150, 220, 300, 280, 350],
        views: [4500, 6200, 5800, 8100, 12000, 11000, 14000]
      };
    } else if (this.period === 'month') {
      return {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        gmv: [1800, 2200, 2500, 3000],
        views: [85000, 92000, 110000, 125000]
      };
    } else {
      return {
        labels: ['Tháng 10', 'Tháng 11', 'Tháng 12'],
        gmv: [6500, 7800, 8500],
        views: [280000, 320000, 380000]
      };
    }
  }
}
