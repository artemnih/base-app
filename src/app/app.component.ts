import { Component } from '@angular/core';
import { AuthService } from '@labshare/base-ui-services';
import { EventKey, EventService } from 'ngx-event-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private eventS: EventService, private authService: AuthService) {
    this.eventS.get(new EventKey<string>('appp')).subscribe((event: string) => {
    })
  }

  testAuth() {
    console.log(this.authService)
  }
}
