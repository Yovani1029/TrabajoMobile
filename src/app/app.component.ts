import { Component } from '@angular/core';
import { PushNotificationsService } from './core/services/push-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private pushNotificationsService: PushNotificationsService) {
    this.initNotifications()
  }
    initNotifications() {
      this.pushNotificationsService.initPush(); 
    
    }
}
