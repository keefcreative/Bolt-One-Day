/**
 * Reset Campaign Banner Script
 *
 * Quick commands to run in browser console:
 *
 * // Clear dismissal (show banner immediately):
 * localStorage.removeItem('designworks_class2025_banner_dismissed_until');
 * localStorage.removeItem('designworks_class2025_banner_dismissed');
 * location.reload();
 *
 * // Check dismissal status:
 * console.log('Dismissed until:', localStorage.getItem('designworks_class2025_banner_dismissed_until'));
 *
 * Or paste this entire script into the console:
 */

(function() {
  console.log('🔄 Resetting campaign banner state...');

  const newKey = 'designworks_class2025_banner_dismissed_until';
  const legacyKey = 'designworks_class2025_banner_dismissed';

  const dismissedUntil = localStorage.getItem(newKey);
  const legacyValue = localStorage.getItem(legacyKey);

  console.log('Current dismissal status:');
  console.log('  Dismissed until:', dismissedUntil);
  console.log('  Legacy dismissed:', legacyValue);

  if (dismissedUntil) {
    const expiresAt = new Date(dismissedUntil);
    const now = new Date();
    if (expiresAt > now) {
      const hoursRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
      console.log(`  ⏰ Currently dismissed for ${hoursRemaining} more hours`);
    } else {
      console.log('  ✅ Dismissal has expired');
    }
  }

  // Clear both keys
  localStorage.removeItem(newKey);
  localStorage.removeItem(legacyKey);

  console.log('✅ Banner state cleared!');
  console.log('🔄 Reloading page...');

  setTimeout(() => {
    window.location.reload();
  }, 500);
})();
