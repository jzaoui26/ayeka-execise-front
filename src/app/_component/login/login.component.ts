// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  formHasError: boolean;
  inSubmitForm: boolean;

  usernameBase: string = 'ayeka';
  passwordBase: string = 'ayeka!613#';

  username: string;
  password: string;



  constructor(private authService: AuthService, private router: Router) {


  }

  ngOnInit() {

    this.username   = this.usernameBase;
    this.password   = this.passwordBase;


    if(this.authService.isLoggedIn())
    {
      this.router.navigate(['/map']);
    }
    else
    {
      this.authService.logout();
    }

  }

  public formNoError(): void {
    this.formHasError = false;
  }

  login(formLogin: NgForm) {

    this.formHasError = false;
    this.inSubmitForm = true;
    //
    this.model = formLogin.form.value;
    this.model.action = 'login';

    // submission
    this.authService.loginForm(this.model).subscribe(
      response => {
        if (response.status === 'success') {
          this.authService.setUser(response);
        } else {
          this.formHasError = true;
        }

        this.inSubmitForm = false;
      },
      error => {
        this.formHasError = true;
        console.error(error);

        this.inSubmitForm = false;
      }
    );
  }
}
