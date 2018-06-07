import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
  mdlIsOpen: any = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessagesService: FlashMessagesService
  ) {
    
    if (route.snapshot.paramMap.get('logout')) {
      this.mdlIsOpen = true;
    } else {
      this.mdlIsOpen = false;
    }

  }

  ngOnInit() {

  }

  onLoginSubmit(){
    const user ={
      username: this.username,
      password: this.password
    };

    this.authService.authenticateUser(user).subscribe(data => {      
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessagesService.show('You are logged in', {
          cssClass: 'alert-success',
          timeout: 5000
        });
        
        this.router.navigate(['/home']);

      } else {
        this.flashMessagesService.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }
  setmodal() {
    this.mdlIsOpen = false;
  }
}
