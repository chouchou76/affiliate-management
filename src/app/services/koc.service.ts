import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { KocData } from '../models/koc.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KocService {
  private firestore = inject(Firestore);
  private kocCollection = collection(this.firestore, 'kocs');

  addKoc(kocData: KocData): Promise<void> {
    return addDoc(this.kocCollection, kocData).then(() => {});
  }

  getKocs(): Observable<KocData[]> {
    return collectionData(this.kocCollection, { idField: 'id' }) as Observable<KocData[]>;
  }
}
