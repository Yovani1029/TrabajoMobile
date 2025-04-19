import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { PushNotificationsService } from './push-notifications.service'; // Importamos PushNotificationsService

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private apiUrl = 'https://ravishing-courtesy-production.up.railway.app/notifications';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private pushNotificationsService: PushNotificationsService 
  ) {}



  // 👉 Método para enviar una notificación de llamada entrante
  sendIncomingCallNotification(token: string, meetingId: string, contactName: string, userId: string) {
    const user = this.authService.getUser();
    if (!user) return;

    const payload = {
      token: token, // Token FCM del destinatario
      notification: {
        title: 'Llamada entrante',
        body: `${contactName} te está llamando`
      },
      android: {
        priority: 'high',
        data: {
          userId: userId, // ID del usuario que recibe la llamada
          meetingId: meetingId, // UUID generado para la llamada
          type: 'incoming_call',
          name: contactName, // Nombre del remitente
          userFrom: user.uid // ID del remitente
        }
      }
    };

    // Obtener el token de acceso para autenticación
    const accessToken = localStorage.getItem('accessToken'); 

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    // Enviar la notificación mediante POST
    return this.http.post(this.apiUrl, payload, { headers })
      .toPromise()
      .then(response => {
        console.log('Notificación enviada con éxito:', response);
      })
      .catch(error => {
        console.error('Error al enviar la notificación:', error);
      });
  }
}
