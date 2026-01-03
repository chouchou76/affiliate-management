// import { Injectable } from '@angular/core';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   orderBy,
//   onSnapshot
// } from 'firebase/firestore';
// import { db } from '../firebase';

// export interface Product {
//   id?: string;
//   name: string;
//   createdAt: any;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   private ref = collection(db, 'products');

//   async getProducts(): Promise<Product[]> {
//     const q = query(this.ref, orderBy('createdAt', 'asc'));
//     const snapshot = await getDocs(q);

//     return snapshot.docs.map(d => ({
//       id: d.id,
//       ...(d.data() as Product)
//     }));
//   }

//   async addProduct(name: string): Promise<void> {
//     await addDoc(this.ref, {
//       name,
//       createdAt: new Date()
//     });
//   }

//   listenProducts(callback: (products: Product[]) => void) {
//     const q = query(this.ref, orderBy('createdAt', 'asc'));

//     return onSnapshot(q, snap => {
//       const data = snap.docs.map(d => ({
//         id: d.id,
//         ...(d.data() as Product)
//       }));
//       callback(data);
//     });
//   }
// }
