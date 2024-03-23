import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'settings',
    async loadComponent() {
      const m = await import('./settings/settings.component');

      return m.SettingsComponent;
    },
  },
  {
    path: 'popup',
    async loadComponent() {
      const m = await import('./popup/popup.component');

      return m.PopupComponent;
    },
  },
];
