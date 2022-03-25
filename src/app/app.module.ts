import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsersRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BaseUIServicesModule,
  AuthService,
  ConfigService,
  AppType,
  initializeFromUrl,
} from '@labshare/base-ui-services';
import { DemoComponent } from './components/demo/demo.component';

let APP_CONF = {
  "production": false,
  "services": {
    "auth": {
      "responseType": "code",
      "url": "https://a-ci.labshare.org/_api",
      "clientId": "metadata-ui",
      "tenant": "metadata",
      "storage": "local"
    },
    "logging": {
      "url": "https://logging.ci.aws.labshare.org/api/log",
      "application": "ngx-facility",
      "environment": "CI",
      "subTag": "facility"
    }
  }
};

function initialize(http: HttpClient, config: ConfigService, auth: AuthService): () => Promise<any> {
  return async () => {
    return initializeFromUrl(http, config, auth, 'http://localhost:4200/assets/config.json');
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BaseUIServicesModule.forRoot({ appConf: APP_CONF, appType: AppType.Site, appBuildVersion: '123' }),
    CommonModule,
    UsersRouting,
    ReactiveFormsModule,
  ],
  providers: [
    Title,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [HttpClient, ConfigService, AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
