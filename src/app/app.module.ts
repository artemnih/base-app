import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsersRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AuthService,
  ConfigService,
  AuthKeys,
  AuthBaseService,
  WindowService,
  EventService,
  StorageService,
} from '@labshare/base-ui-services';
import { DemoComponent } from './components/demo/demo.component';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { WebStorageStateStore } from 'oidc-client';

@Injectable({
  providedIn: 'platform',
})
export class MyAuthWebService extends AuthBaseService {

  constructor(eventService: EventService, configService: ConfigService, storageService: StorageService, window: WindowService, router: Router) {
    super(eventService, configService, storageService,window, router as any);
  }

  public init() {
    if (this.configService.get(AuthKeys.AuthConfig).storage === 'local') {
      this.extraSettings = {
        userStore: new WebStorageStateStore({
          store: this.window.nativeWindow.localStorage,
        }),
      };
    }
  }

  public async login() {
    await this.clearStaleLoginState();

    return this.userManager.signinRedirect().catch(err => {
      throw new Error('Cannot login to auth service: ' + err);
    });
  }

  public async logout() {
    await this.clearStaleLoginState();

    const signOutOptions: { client_id?: string } = {};

    if (this.authConfig.clientId) {
      signOutOptions.client_id = this.authConfig.clientId;
    }

    return this.userManager.signoutRedirect(signOutOptions).catch(err => {
      throw new Error('could not log out: ' + err);
    });
  }

  private async clearStaleLoginState(): Promise<void> {
    try {
      await this.userManager.clearStaleState();
    } catch (err) {
      // Ignore errors - we do not want to interfere with the authentication flow if cleanup fails
    }
  }
}

function initialize(http: HttpClient, configService: ConfigService, authService: AuthService) {
  return async () => {
    const url = 'http://localhost:4200/assets/config.json';
    const configuration = await lastValueFrom(http.get(url));

    configService.load(configuration);
    (authService as any).init();

    if (configService.has(AuthKeys.AuthConfig)) {
      const authConfiguration = configService.get(AuthKeys.AuthConfig);
      await authService.configure(authConfiguration).toPromise();
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    UsersRouting,
    ReactiveFormsModule,
  ],
  providers: [
    Title,
    { provide: AuthService, useClass: MyAuthWebService, },
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
}
