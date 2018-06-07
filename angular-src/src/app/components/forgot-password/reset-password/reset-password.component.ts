import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  
  email: String;
  token: String;
  username: String;
  password_match: String;
  password: String;
  confirmPassword: String;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessagesService: FlashMessagesService
  ) {
    const token = route.snapshot.queryParams['token'];
    const password_expires_time = localStorage.getItem('reset_password_expires');
    const expire = new Date(password_expires_time);
    this.email = localStorage.getItem('forgot_password_email');
    this.username = localStorage.getItem('forgot_password_username');
    this.token = localStorage.getItem('reset_password_token');
    if(this.email == null || this.username == null || token != this.token || expire.getTime() < new Date().getTime()){
      this.router.navigate(['/forgotPassword']);
    }
  }
  
  ngOnInit() {

    //localStorage.clear();
  }
  
  onSubmitChangePassword(){
    if(this.password_match != "Yes"){
      this.flashMessagesService.show('Please confirm your password', {
        cssClass: 'alert-danger',
        timeout: 5000
      });
    } else{
      const user = {password: this.password, username: this.username};
      
      this.authService.changePassword(user).subscribe(data => {
        if(data.success){
          
          // Redirect some url based on the user's role
          if(data.user.role == 'user'){
            this.router.navigate(['/passwordChanged']);
          } else if(data.role == 'super'){
          
          } else {
          
          }
          
        } else {
          this.flashMessagesService.show(data.msg, {
            cssClass: 'alert-danger',
            timeout: 5000
          });
        }
      });
    }
  }
  
  confirm(){
    if(this.password == this.confirmPassword){
      this.password_match = "Yes";
    }else{
      this.password_match = "No";
    }
  }
}