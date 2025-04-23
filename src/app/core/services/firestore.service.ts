import { Inject, Injectable } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, DocumentReference, getDoc } from 'firebase/firestore';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { DocumentData } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = Inject(Firestore)
  
  constructor(   ) {
   // this.firestore = getFirestore();
    
  }

  createUserData(userId: string, data: any): Observable<void> {
    const userRef = doc(this.firestore, 'users', userId);
    return from(setDoc(userRef, data));
  }

  getUserData(userId: string): Observable<any> {
    const userRef = doc(this.firestore, 'users', userId);
    return from(getDoc(userRef).then(snapshot => snapshot.exists() ? snapshot.data() : null));
  }

  updateUserData(userId: string, data: any): Observable<void> {
    const userRef = doc(this.firestore, 'users', userId);
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
    return docRef as DocumentReference<DocumentData>;  // Fuerza el tipo de retorno a DocumentReference<DocumentData>
  }
  

  async checkIfContactExists(userId: string, phone: string): Promise<boolean> {
    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
    const q = query(contactsRef, where('phone', '==', phone));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;  
  }

  getContacts(currentUserId: string): Observable<any[]> {
    const contactsRef = collection(this.firestore, `users/${currentUserId}/contacts`);
    return new Observable<any[]>(observer => {
      onSnapshot(contactsRef, (snapshot: any) => {
        observer.next(snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })));
      }, (error: any) => observer.error(error));
    });
  }

  updateUserToken(userId: string, token: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, { token });
  }
}
