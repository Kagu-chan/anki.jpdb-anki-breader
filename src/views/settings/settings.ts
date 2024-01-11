import { openSidebar } from '@/lib/sidebar';

((): void => {
  const closeButton = document.getElementById('close-settings');

  closeButton?.addEventListener('click', () => {
    void openSidebar('sidebar');
  });
})();
