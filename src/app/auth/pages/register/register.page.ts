import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    const { name, lastName, phone, email, password } = this.registerForm.value;

    this.authService.register(email, password, name, lastName, phone)
      .then(() => {
        console.log('Usuario registrado exitosamente');
        this.router.navigate(['/login']); // O donde quieras enviarlo después de registrarlo
      })
      .catch(error => {
        console.error('Error en registro:', error);
        // Aquí podrías mostrar un Toast o Alert bonito si quieres
      });
  }

}
