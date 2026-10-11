// Ashwick's lantern and casting gesture.
window.ASHWICK_MAGE = (mage, sound, colors) => {
  let returnTimer;
  return {
    cast(sigil, viewportWidth) {
      sound.casting();
      mage.style.setProperty('--c', colors[sigil.k][1]);
      mage.style.setProperty('--f', sigil.cx < viewportWidth / 2 ? -1 : 1);
      mage.classList.add('cast');
      clearTimeout(returnTimer);
      returnTimer = setTimeout(() => mage.classList.remove('cast'), 1400);
    }
  };
};
