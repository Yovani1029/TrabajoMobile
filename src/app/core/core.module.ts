import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';  // Asegúrate de importar el servicio
import { FirestoreService } from './services/firestore.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule,HttpClientModule],
  providers: [FirestoreService, AuthService]
})
export class CoreModule {}
