import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError = '';

  constructor(
    private formBuilder: FormBuilder,
    private _http: HttpClient,
    private _route: Router) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginFormValue = this.loginForm.value;
    this.loginError = '';
    this._http.get<any>("http://localhost:3000/users")
      .subscribe({
        next: (response) => {
          const user = response.find((user: any) => user.email === loginFormValue.email && user.password === loginFormValue.password)
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this._route.navigate(['home']);
          } else {
            this.loginError = 'User Not Found';
            this._route.navigate(['login']);
          }
        },
        error: () => {
          this.loginError = 'Something was wrong';
        }
      });
  }

}
