import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { db } from '../firebase';
import { KocData } from '../models/koc.model';
import { doc, updateDoc } from 'firebase/firestore';
import { KocListComponent } from '../koc-list/koc-list.component';
import { AddKocComponent } from '../add-koc/add-koc.component';

@Injectable({ providedIn: 'root' })
export class KocService {
  
  private kocSubject = new BehaviorSubject<KocData[]>([]);

  constructor() {
    this.listenRealtime();
  }

  updateKoc(id: string, data: Partial<KocData>) {
    const ref = doc(db, 'kocs', id);
    return updateDoc(ref, data);
  }

  private listenRealtime() {
    const ref = collection(db, 'kocs');

    onSnapshot(ref, snapshot => {
      const data: KocData[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as KocData)
      }));

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
