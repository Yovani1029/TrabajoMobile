import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  standalone: false
})
export class AddContactPage {
  fullName: string = '';
  phone: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  async addContact() {
    const user = await this.authService.getUser();
    if (user) {
      const contactData = {
        fullName: this.fullName,
        phone: this.phone
      };
      try {
        await this.firestoreService.addContact(user.uid, contactData);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al agregar contacto:', error);
      }
    }
  }
}
