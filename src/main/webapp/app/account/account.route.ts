import { Routes } from '@angular/router';

import activateRoute from './activate/activate.route';
import passwordRoute from './password/password.route';
import registerRoute from './register/register.route';
import settingsRoute from './settings/settings.route';

const accountRoutes: Routes = [activateRoute, passwordRoute, registerRoute, settingsRoute];

export default accountRoutes;
