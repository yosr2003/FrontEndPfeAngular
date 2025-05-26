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

  this.authService.login(loginData).subscribe({
    next: (res) => {
      console.log("Login successful", res);
      this.tokenStorage.saveToken(res.accessToken);
        if (res.roles && res.roles.length > 0) {
      this.tokenStorage.saveRole(res.roles[0]);
      console.log("res.roles[0]*******************", res.roles[0])
    }

      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error("Login failed", err);
      this.errorMsg = "Email ou mot de passe incorrect";
    }
  });
}

logout() {
  this.tokenStorage.signOut();
  this.router.navigate(['/login']);
}
}
