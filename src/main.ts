import { AppRoutingModule } from './app/app-routing.module';  // Import AppRoutingModule

import { DashboardComponent } from './app/dashboard/dashboard.component'; // Root component

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9_1tGbAOzlU6WM0hqof5oSwfYis8K4f4",
  authDomain: "koc-management.firebaseapp.com",
  projectId: "koc-management",
  storageBucket: "koc-management.firebasestorage.app",
  messagingSenderId: "647635907150",
  appId: "1:647635907150:web:29cb343854fe75ece8091f",
  measurementId: "G-RJ7C90VP9R"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);