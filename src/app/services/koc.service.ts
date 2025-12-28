import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

@Injectable({ providedIn: 'root' })
export class KocService {
  async addKoc(data: any) {
    return await addDoc(collection(db, 'kocs'), {
      ...data,
      createdAt: new Date()
    });
  }

  async getKocs() {
    const snap = await getDocs(collection(db, 'kocs'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}
