import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@labshare/base-ui-services';
import { APP_ROUTES } from 'src/app/app-routing.module';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  private onAuthorizationResult;
  public apps = [] as any[];
  public form = new FormGroup({
    name: new FormControl('demo'),
    path: new FormControl('demo'),
    remote: new FormControl('http://localhost:3000/remoteEntry.js'),
    exposed: new FormControl('./Module'),
    ngModule: new FormControl('FlightsModule'),
  })

  constructor(private authService: AuthService, private router: Router,) {
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

  addApp() {
    const { name, path, remote, exposed, ngModule } = this.form.value;
    const appRoute = {
      name: name,
      route: {
        path: path,
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: remote,
            exposedModule: exposed
          }).then(m => m[ngModule]),
      }
    }

    this.apps.push(appRoute);

    const lazyRoutes = this.apps.map(app => app.route);
    const routes = [...APP_ROUTES, ...lazyRoutes];
    this.router.resetConfig(routes);
  }

}
