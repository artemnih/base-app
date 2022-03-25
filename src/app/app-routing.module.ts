import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './components/demo/demo.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DemoComponent,
      }
    ]
  }
];

export const UsersRouting = RouterModule.forRoot(routes);
