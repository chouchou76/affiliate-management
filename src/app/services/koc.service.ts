import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
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
}


// import { Injectable } from '@angular/core';
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   deleteDoc,
//   doc,
//   updateDoc
// } from 'firebase/firestore';
// import { BehaviorSubject, Observable, from, concatMap } from 'rxjs';
// import { db } from '../firebase';
// import { KocData } from '../models/koc.model';
// import { HttpClient } from '@angular/common/http';

// @Injectable({ providedIn: 'root' })
// export class KocService {

//   /** 🔹 REALTIME STATE */
//   private kocSubject = new BehaviorSubject<KocData[]>([]);

//   constructor(private http: HttpClient) {
//     this.listenRealtime();
//   }


//   getKocs(): Observable<KocData[]> {
//     return this.kocSubject.asObservable();
//   }

//   addKoc(data: KocData) {
//     const ref = collection(db, 'kocs');
//     return addDoc(ref, data);
//   }

//   updateKoc(id: string, data: Partial<KocData>) {
//     const ref = doc(db, 'kocs', id);
//     return updateDoc(ref, data);
//   }

//   deleteKoc(id: string) {
//     const ref = doc(db, 'kocs', id);
//     return deleteDoc(ref);
//   }

//   private listenRealtime() {
//     const ref = collection(db, 'kocs');

//     onSnapshot(ref, snapshot => {
//       const data: KocData[] = snapshot.docs.map(d => ({
//         id: d.id,
//         ...(d.data() as KocData),
//         selected: false,
//         crawlStatus: 'idle'
//       }));

//       this.kocSubject.next(data);
//     });
//   }


//   bulkCrawl(kocs: KocData[]): Observable<any> {
//     return from(kocs).pipe(
//       concatMap(koc => this.crawlOne(koc))
//     );
//   }


//   private crawlOne(koc: KocData) {
//     if (!koc.id || !koc.videoLink) {
//       return Promise.resolve();
//     }

//     return this.http
//       .post<any>('/api/tiktok/crawl', {
//         videoLink: koc.videoLink
//       })
//       .toPromise()
//       .then(data => {
//         const payload: Partial<KocData> = {
//           videoId: data.videoId,
//           title: data.title,
//           views: data.views,
//           likes: data.likes,
//           comments: data.comments,
//           shares: data.shares,
//           saves: data.saves,
//           isAd: data.isAd ?? false,
//           actualAirDate: data.actualAirDate,
//           dataRetrievalTime: this.formatNow()
//         };

//         return this.updateKoc(koc.id!, payload);
//       });
//   }

//   private formatNow(): string {
//     const d = new Date();
//     return d.toLocaleString('vi-VN', {
//       hour12: false,
//       timeZone: 'Asia/Ho_Chi_Minh'
//     });
//   }
// }
