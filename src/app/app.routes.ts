import { Routes } from '@angular/router';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', component: LoginComponent },
        ]
    }
];
