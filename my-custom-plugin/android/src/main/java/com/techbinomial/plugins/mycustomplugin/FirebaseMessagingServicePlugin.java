package com.techbinomial.plugins.mycustomplugin;  // ⚡ Cambia esto al paquete de tu app/plugin

import android.util.Log;
import com.getcapacitor.PluginCall;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class FirebaseMessagingServicePlugin extends FirebaseMessagingService {

  private static final String TAG = "FirebaseMessagingService";

  @Override
  public void onNewToken(String token) {
    super.onNewToken(token);

    Log.d(TAG, "Nuevo token FCM: " + token);

    // Aquí puedes enviar el token al servidor si quieres
    // o emitir un evento a tu app con Capacitor

    // Ejemplo (opcional):
    // sendTokenToServer(token);
  }

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    super.onMessageReceived(remoteMessage);

    Log.d(TAG, "Mensaje FCM recibido: " + remoteMessage.getData());

    // Puedes procesar el mensaje aquí
    if (remoteMessage.getNotification() != null) {
      String title = remoteMessage.getNotification().getTitle();
      String body = remoteMessage.getNotification().getBody();

      Log.d(TAG, "Título: " + title);
      Log.d(TAG, "Cuerpo: " + body);

      // Opcional: emitir un evento a la app si está en primer plano
      // CapacitorBridge.getInstance().notifyListeners("notificationReceived", data);
    }
  }

}
