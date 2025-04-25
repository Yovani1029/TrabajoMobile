import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc, collection, addDoc, getDoc, query, where, getDocs, onSnapshot } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { DocumentReference, DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  createUserData(userId: string, data: any): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userRef, data));
  }

  getUserData(userId: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(
      getDoc(userRef).then((snapshot) =>
        snapshot.exists() ? snapshot.data() : null
      )
    );
  }

  updateUserData(userId: string, data: any): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, data));
  }

  async addContact(currentUserId: string, contactData: any): Promise<DocumentReference<DocumentData> | null> {
    const contactExists = await this.checkIfContactExists(currentUserId, contactData.phone);

    if (contactExists) {
      alert('El contacto ya existe.');
      return null;
    }

    const contactsRef = collection(this.firestore, `users/${currentUserId}/contacts`);
    const docRef = await addDoc(contactsRef, contactData);
    return docRef;
  }

  async checkIfContactExists(userId: string, phone: string): Promise<boolean> {
    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
    const q = query(contactsRef, where('phone', '==', phone));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  getContacts(currentUserId: string): Observable<any[]> {
    const contactsRef = collection(this.firestore, `users/${currentUserId}/contacts`);
    return new Observable<any[]>((observer) => {
      onSnapshot(
        contactsRef,
        (snapshot) => {
          observer.next(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        },
        (error) => observer.error(error)
      );
    });
  }

  updateUserToken(userId: string, token: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { token }));
  }
}