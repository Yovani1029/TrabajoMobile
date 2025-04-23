import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { PushNotificationsService } from 'src/app/core/services/push-notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone : false
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private pushNotification: PushNotificationsService
  ) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(userCredential => {
        console.log('Login exitoso', userCredential);
        this.pushNotification.save
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error en login', error);
      });
  }
}
