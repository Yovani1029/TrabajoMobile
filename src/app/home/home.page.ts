import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationsService } from 'src/app/core/services/notifications.service'; 
import { PushNotificationsService } from 'src/app/core/services/push-notifications.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  contacts$: Observable<any[]> = new Observable<any[]>();

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService, 
    private pushNotificationsService: PushNotificationsService
  ) {}

  ngOnInit() {
    this.pushNotificationsService.initPush();
    this.loadContacts();
  }

  loadContacts() {
    const user = this.authService.getUser();
    if (user) {
      this.contacts$ = this.firestoreService.getContacts(user.uid);
    }
  }

  addContact() {
    this.router.navigate(['/add-contact']);
  }

  logout() {
    this.authService.logout()
      .then(() => {
        alert('Sesión cerrada exitosamente');
        this.router.navigate(['/login']); // Redirigir al login
      })
      .catch(error => {
        console.error('Error al cerrar sesión', error);
      });
  }
}