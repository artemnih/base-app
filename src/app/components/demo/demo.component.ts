import { Component, OnInit } from '@angular/core';
import { AuthService } from '@labshare/base-ui-services';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  private onAuthorizationResult;

  constructor(private authService: AuthService) {
    this.onAuthorizationResult = this.authService.onAuthorizationResult();
  }

  ngOnInit(): void {
    this.authService.onAuthCallback();
    this.onAuthorizationResult.subscribe((result: any) => {
      if (result.authorizationState === 'authorized') {
        console.log(`authorized`);
      }
    });
  }

  auth() {
    this.authService.login();
  }

}
