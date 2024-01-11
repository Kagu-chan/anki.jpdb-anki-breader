// import '@/lib/includes';
// import './popup.scss';

import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { openSidebar } from '@/lib/sidebar';

// ((): void => {
//   const settingsButton = document.getElementById('open-settings');
//   const sidebarButton = document.getElementById('open-sidebar');

//   settingsButton?.addEventListener('click', () => {
//     void openSidebar('settings');
//   });
//   sidebarButton?.addEventListener('click', () => {
//     void openSidebar('sidebar');
//   });
// })();

@Component({
  selector: 'app-popup',
  template: '<h1>Hello Friend</h1>',
})
class PopupComponent {}

@NgModule({
  declarations: [PopupComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [PopupComponent],
})
class PopupModule {}

void platformBrowserDynamic().bootstrapModule(PopupModule);
