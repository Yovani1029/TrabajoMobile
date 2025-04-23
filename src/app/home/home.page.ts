import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationsService } from 'src/app/core/services/notifications.service'; // Importa el NotificationsService
import { PushNotificationsService } from 'src/app/core/services/push-notifications.service'; // Importa el PushNotificationsService
import { MyCustomPlugin } from 'my-custom-plugin/src';

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
    private notificationsService: NotificationsService, // Inyecta el servicio NotificationsService
    private pushNotificationsService: PushNotificationsService // Inyecta el servicio PushNotificationsService
  ) {}

  ngOnInit() {
    this.pushNotificationsService.initPush(); // Inicializa las notificaciones push
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

  // Enviar una notificación de llamada entrante
  sendCallNotification() {
    const token = 'FCM_TOKEN_DESTINO';  // Token del usuario destinatario
    const meetingId = 'UUID_GENERADO';  // UUID para la sala de videollamada
    const contactName = 'Nombre del contacto';  // Nombre del remitente
    const userId = 'ID_USUARIO_DESTINO';  // ID del usuario destinatario

    this.notificationsService.sendIncomingCallNotification(token, meetingId, contactName, userId);
  }

  async testPlugin() {
    try {
      const res = await MyCustomPlugin.testPluginMethod({ msg: '¡Plugin funcionando!' });
      console.log('Respuesta del plugin:', res);
    } catch (error) {
      console.error('Error al probar el plugin:', error);
    } 
  }
}
