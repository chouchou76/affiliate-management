import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { BehaviorSubject, Observable, from, concatMap, map, catchError, of } from 'rxjs';
import { db } from '../firebase';
import { KocData } from '../models/koc.model';
import { HttpClient } from '@angular/common/http';

export type CrawlResult = {
  id: string;
  status: 'success' | 'error';
};

@Injectable({ providedIn: 'root' })
export class KocService {

  private kocSubject = new BehaviorSubject<KocData[]>([]);

  constructor(private http: HttpClient) {
    this.listenRealtime();
  }

  getKocs(): Observable<KocData[]> {
    return this.kocSubject.asObservable();
  }

  addKoc(data: KocData) {
    return addDoc(collection(db, 'kocs'), data);
  }

  updateKoc(id: string, data: Partial<KocData>) {
    return updateDoc(doc(db, 'kocs', id), data);
  }

  deleteKoc(id: string) {
    return deleteDoc(doc(db, 'kocs', id));
  }

  private listenRealtime() {
    const ref = collection(db, 'kocs');

    onSnapshot(ref, snapshot => {
      const data: KocData[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as KocData),
        selected: false,
        crawlStatus: 'idle'
      }));

      this.kocSubject.next(data);
    });
    // onSnapshot(ref, snapshot => {
    //   const current = this.kocSubject.value;

    //   const data = snapshot.docs.map(d => {
    //     const old = current.find(k => k.id === d.id);
    //     return {
    //       id: d.id,
    //       ...(d.data() as KocData),
    //       selected: old?.selected ?? false,
    //       crawlStatus: old?.crawlStatus ?? 'idle'
    //     };
    //   });

    //   this.kocSubject.next(data);
    // });

  }

  /** =====================
   *  BULK CRAWL – CHUẨN
   *  ===================== */
  bulkCrawl(kocs: KocData[]): Observable<CrawlResult> {
    return from(kocs).pipe(
      concatMap(koc => this.crawlOne(koc))
    );
  }

  private crawlOne(koc: KocData): Observable<CrawlResult> {
    if (!koc.id || !koc.videoLink) {
      return of({ id: koc.id!, status: 'error' });
    }

    return this.http.post<any>('/api/tiktok/crawl', {
      videoLink: koc.videoLink
    }).pipe(
      concatMap(data => {
        const payload: Partial<KocData> = {
          videoId: data.videoId,
          title: data.title,
          views: data.views,
          likes: data.likes,
          comments: data.comments,
          shares: data.shares,
          saves: data.saves,
          isAd: data.isAd ?? false,
          actualAirDate: data.actualAirDate,
          dataRetrievalTime: this.formatNow()
        };

        return from(this.updateKoc(koc.id!, payload)).pipe(
          map(() => ({
            id: koc.id!,
            status: 'success' as const
          }))
        );
      }),
      catchError(() =>
        of({
          id: koc.id!,
          status: 'error' as const
        })
      )
    );
  }

  
  private formatNow(): string {
    return new Date().toLocaleString('vi-VN', {
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh'
    });
  }


  async bulkAddExcel(kocs: any[]) {
    const ref = collection(db, 'kocs');

    for (const k of kocs) {
      await addDoc(ref, k);
    }
  }

  async getKocsSnapshot() {
    const snap = await getDocs(collection(db, 'kocs'));
    return snap.docs.map(d => d.data() as KocData);
  }

  
}

