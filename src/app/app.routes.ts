import { Routes } from '@angular/router';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { LoginComponent } from './components/login/login';
import { NotificationContainer } from './components/notification-container/notification-container';
import { DashboardLayout } from './shared/layouts/dashboard-layout/dashboard-layout';
import { Blank } from './components/blank/blank';

export const routes: Routes = [
    { path: 'notification-container', component: NotificationContainer },
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', component: LoginComponent },
        ]
    },
    {
        path: '',
        component: DashboardLayout,
        children: [
            { path: 'blank', component: Blank }
        ]
    }
];
