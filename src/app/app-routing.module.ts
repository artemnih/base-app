import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './components/demo/demo.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DemoComponent,
      },
      {
        path: 'mfe',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:3000/remoteEntry.js',
            exposedModule: './Module'
          }).then(m => m.FlightsModule),
      }
    ]
  }
];

export const UsersRouting = RouterModule.forRoot(routes);
