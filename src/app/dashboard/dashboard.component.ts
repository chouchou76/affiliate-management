// dashboard.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { KocData } from '../models/koc.model';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  registerables // nếu muốn đăng ký tất cả
} from 'chart.js';

Chart.register(...registerables); // hoặc chỉ đăng ký những cái cần

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective 
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Doanh thu (GMV)',
        data: [1800, 2200, 2500, 3000],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Lượt xem',
        data: [85000, 92000, 110000, 125000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  period: 'week' | 'month' | '3months' = 'month';

  stats = {
    totalVideos: 12450,
    totalGMV: 8500000000,
    totalViews: 45678900,
    totalKOCs: 320
  };

  ngOnInit() {
    // có thể load data từ API ở đây
  }

  ngAfterViewInit() {
    // chart đã sẵn sàng
  }

  ngOnDestroy() {
    // ng2-charts tự handle destroy
  }

  changePeriod(period: 'week' | 'month' | '3months') {
    this.period = period;
    this.updateChartData();
  }

  private updateChartData() {
    let data;
    if (this.period === 'week') {
      data = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        gmv: [120, 180, 150, 220, 300, 280, 350],
        views: [4500, 6200, 5800, 8100, 12000, 11000, 14000]
      };
    } else if (this.period === 'month') {
      data = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        gmv: [1800, 2200, 2500, 3000],
        views: [85000, 92000, 110000, 125000]
      };
    } else {
      data = {
        labels: ['Tháng 10', 'Tháng 11', 'Tháng 12'],
        gmv: [6500, 7800, 8500],
        views: [280000, 320000, 380000]
      };
    }

    this.lineChartData.labels = data.labels;
    this.lineChartData.datasets[0].data = data.gmv;
    this.lineChartData.datasets[1].data = data.views;

    // Cập nhật chart
    this.chart?.update();
  }
}