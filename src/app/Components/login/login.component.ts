import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  // login(): void {
  //   this.authService.login(this.username, this.password).subscribe(
  //     response => {
  //       // Handle successful login (store token, navigate, etc.)
  //     },
  //     error => {
  //       this.errorMessage = 'Login failed. Please check your credentials.';
  //     }
  //   );
  // }

}
