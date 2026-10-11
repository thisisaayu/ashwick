// Pointer input and the live draft layer for Ashwick's full-screen canvas.
window.ASHWICK_CANVAS = (canvas, sound, finishStrokeGroup) => {
  let draft = null, stroke = null, flushTimer, lastAt = 0, lastPoint = null;
  canvas.addEventListener('pointerdown', event => {
    sound.startTrace();
    canvas.setPointerCapture(event.pointerId);
    clearTimeout(flushTimer);
    draft = draft || [];
    stroke = [[event.clientX, event.clientY]];
    draft.push(stroke);
    lastAt = event.timeStamp;
    lastPoint = [event.clientX, event.clientY];
    document.querySelector('#hint').classList.add('off');
  });
  canvas.addEventListener('pointermove', event => {
    if (!stroke) return;
    const last = stroke[stroke.length - 1];
    const dt = Math.max(8, event.timeStamp - lastAt);
    const distance = Math.hypot(event.clientX - lastPoint[0], event.clientY - lastPoint[1]);
    sound.updateTrace(distance / dt * 1000);
    lastAt = event.timeStamp;
    lastPoint = [event.clientX, event.clientY];
    if (Math.hypot(event.clientX - last[0], event.clientY - last[1]) > 3) stroke.push([event.clientX, event.clientY]);
  });
  const end = () => {
    if (!stroke) return;
    stroke = null;
    sound.stopTrace();
    lastPoint = null;
    flushTimer = setTimeout(() => {
      const group = draft.filter(points => points.length > 2);
      draft = null;
      if (group.length) finishStrokeGroup(group);
    }, 750);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  return { get draft() { return draft; } };
};
