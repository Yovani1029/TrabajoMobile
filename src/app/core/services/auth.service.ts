import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';  // Añadir la importación de HttpClient

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient
  ) {}

  register(email: string, password: string, name: string, lastName: string, phone: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return this.saveUserData(user.uid, name, lastName, phone);
        } else {
          return Promise.resolve();
        }
      });
  }

  private saveUserData(userId: string, name: string, lastName: string, phone: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userRef, { name, lastName, phone });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginApi(userCredentials: any) {
    this.http.post('https://ravishing-courtesy-production.up.railway.app/user/login', userCredentials)
      .subscribe((response: any) => {
        const token = response.token; 
        localStorage.setItem('accessToken', token); 
        console.log('Token guardado en LocalStorage:', token);
      });
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  getUser() {
    return this.auth.currentUser;
  }
}
