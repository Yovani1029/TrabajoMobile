import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient
  ) {}

  register(email: string, password: string, name: string, lastName: string, phone: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return this.saveUserData(user.uid, name, lastName, phone);
        } else {
          return Promise.reject('No se pudo crear el usuario.');
        }
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
        throw error;
      });
  }

  private saveUserData(userId: string, name: string, lastName: string, phone: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userRef, { name, lastName, phone }).catch((error) => {
      console.error('Error al guardar datos del usuario en Firestore:', error);
      throw error;
    });
  }

  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  loginApi(userCredentials: any): Observable<void> {
    return this.http.post('https://ravishing-courtesy-production.up.railway.app/user/login', userCredentials).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('accessToken', token);
          console.log('Token guardado en LocalStorage:', token);
        } else {
          throw new Error('No se recibió token en la respuesta.');
        }
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión con la API:', error);
        throw error;
      })
    );
  }

  
  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
        throw error;
      });
  }


  getUser(): User | null {
    return this.auth.currentUser;
  }
}