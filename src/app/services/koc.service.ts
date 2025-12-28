import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { db } from '../firebase';
import { KocData } from '../models/koc.model';

@Injectable({ providedIn: 'root' })
export class KocService {

  private kocSubject = new BehaviorSubject<KocData[]>([]);

  constructor() {
    this.listenRealtime();
  }

  private listenRealtime() {
    const ref = collection(db, 'kocs');

    onSnapshot(ref, snapshot => {
      const data: KocData[] = snapshot.docs.map(doc => {
        const raw = doc.data() as Partial<KocData>;

        return {
          channelName: raw.channelName ?? '',
          linkChannel: raw.linkChannel ?? '',
          isDuplicate: raw.isDuplicate ?? false,
          dateFound: raw.dateFound ?? '',

          cast: raw.cast ?? '',
          commission: raw.commission ?? '',
          note: raw.note ?? '',
          recontact: raw.recontact ?? '',

          labels: raw.labels ?? [],
          products: raw.products ?? [],
          status: raw.status ?? '',

          staff: raw.staff ?? '',
          manager: raw.manager ?? '',

          gmv: raw.gmv ?? 0,
          views: raw.views ?? 0,
          likes: raw.likes ?? 0,
          comments: raw.comments ?? 0,
          shares: raw.shares ?? 0,
          saves: raw.saves ?? 0,

          createdAt: raw.createdAt ?? null
        };
      });

      this.kocSubject.next(data);
    });
  }

  getKocs(): Observable<KocData[]> {
    return this.kocSubject.asObservable();
  }

  addKoc(data: KocData) {
    const ref = collection(db, 'kocs');
    return addDoc(ref, data);
  }
}
