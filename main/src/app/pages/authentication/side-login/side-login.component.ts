import { Component } from '@angular/core';
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
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  get f() {
    return this.form.controls;
  }

  submit() {
    const loginData = new Employe(0, '', '', this.f['uname'].value!, this.f['password'].value!, '');

    this.authService.login(loginData).subscribe({
      next: (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.router.navigate(['/dashboard']); // Rediriger vers le dashboard
      },
      error: (err) => {
        console.error(err);
        this.isLoginFailed = true;
        this.errorMessage = 'Email ou mot de passe incorrect';
      },
    });
  }
}
