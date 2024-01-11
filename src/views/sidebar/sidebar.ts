import { openSidebar } from '@/lib/sidebar';

((): void => {
  const settingsButton = document.getElementById('open-settings');

  settingsButton?.addEventListener('click', () => {
    void openSidebar('settings');
  });
})();
