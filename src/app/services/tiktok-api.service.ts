import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TikTokCrawlResponse {
  isAd: boolean;
  dataRetrievalTime: string | undefined;
  saves: number;
  videoId: string;
  videoLink: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  actualAirDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class TikTokApiService {

  private API_URL = 'http://localhost:3333/api/tiktok';

  constructor(private http: HttpClient) {}

  crawlVideo(videoLink: string): Observable<TikTokCrawlResponse> {
    return this.http.post<TikTokCrawlResponse>(
      `${this.API_URL}/crawl`,
      { videoLink }
    );
  }
}
