import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TokenStorageService } from 'src/app/services/token-storage-service.service';
import { Employe } from 'src/app/classes/employe';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ERole } from 'src/app/classes/role';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-side-login',
   standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule , 
    MatIconModule,
      CommonModule,
    MatCardModule,
     MatProgressBarModule,
  ],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss'],
 
})
export class AppSideLoginComponent {
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isLoginFailed = false;
  errorMessage = '';
  errorMsg: string;
  authError: string = '';
  passwordStrength: number | null = null;


  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  get f() {
    return this.form.controls;
  }

  submit() {
  const loginData = {
    email: this.f['uname'].value!,
    password: this.f['password'].value!
  };
  // Reset messages
  this.errorMsg = '';
  this.authError = '';
  this.isLoginFailed = false;

  if (!loginData.email || !loginData.password) {
    this.authError = "L'e-mail et le mot de passe sont requis.";
    return;
  }
 this.authService.login(loginData).subscribe({
    next: (res) => {
      this.tokenStorage.saveToken(res.accessToken);
      this.tokenStorage.saveUser(res);
      if (res.roles?.length > 0) {
        this.tokenStorage.saveRole(res.roles[0]);
      }
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.isLoginFailed = true;

      if (err.status === 404) {
        this.authError = "Cet e-mail n'existe pas.";
      } else if (err.status === 401) {
        this.authError = "Mot de passe incorrect.";
      } else {
        this.authError = "Erreur de connexion. Veuillez réessayer.";
      }

      console.error("Erreur de login:", err);
    }
  });



}

logout() {
  this.tokenStorage.signOut();
  this.router.navigate(['/login']);
}

onPasswordInput() {
  const password = this.form.get('password')?.value || '';
  this.passwordStrength = this.calculateStrength(password);
}

calculateStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 30;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;
  return Math.min(strength, 100);
}




}
