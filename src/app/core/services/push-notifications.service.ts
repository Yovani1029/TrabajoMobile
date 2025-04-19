import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService { 

  constructor(private firestoreService: FirestoreService, private authService: AuthService) {}

  async initPush() {
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === 'granted') {
      await PushNotifications.register();

PushNotifications.addListener('registration', (token: Token) => {
  console.log('Token FCM registrado:', token.value);
  alert('Token FCM registrado:\n' + token.value); // 🔥 Agregamos alert
  this.saveFCMToken(token.value);
});

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación recibida:', notification);
      });
    } else {
      console.log('Permiso de notificaciones denegado');
    }
  }

  private saveFCMToken(token: string) {
    const user = this.authService.getUser();
    if (user) {
      this.firestoreService.updateUserToken(user.uid, token);
    }
  }
}
