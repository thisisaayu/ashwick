// Pointer input and the live draft layer for Ashwick's full-screen canvas.
window.ASHWICK_CANVAS = (canvas, sound, finishStrokeGroup, drawingStarted) => {
  let draft = null, stroke = null, flushTimer, lastAt = 0, lastPoint = null, activeTouchId = null, lastTouchAt = 0;
  const begin = event => {
    if (stroke || (event.isPrimary === false) || (event.button !== undefined && event.button !== 0)) return;
    drawingStarted();
    sound.startTrace();
    if (event.pointerId !== undefined && canvas.setPointerCapture) {
      try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
    }
    clearTimeout(flushTimer);
    draft = draft || [];
    stroke = [[event.clientX, event.clientY]];
    draft.push(stroke);
    lastAt = event.timeStamp;
    lastPoint = [event.clientX, event.clientY];
    document.querySelector('#hint').classList.add('off');
  };
  const move = event => {
    if (!stroke) return;
    const last = stroke[stroke.length - 1];
    const dt = Math.max(8, event.timeStamp - lastAt);
    const distance = Math.hypot(event.clientX - lastPoint[0], event.clientY - lastPoint[1]);
    sound.updateTrace(distance / dt * 1000);
    lastAt = event.timeStamp;
    lastPoint = [event.clientX, event.clientY];
    if (Math.hypot(event.clientX - last[0], event.clientY - last[1]) > 3) stroke.push([event.clientX, event.clientY]);
  };
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
  if ('PointerEvent' in window) {
    canvas.addEventListener('pointerdown', begin);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('lostpointercapture', end);
  } else {
    const touchPoint = (event, touch) => ({
      clientX: touch.clientX,
      clientY: touch.clientY,
      timeStamp: event.timeStamp
    });
    canvas.addEventListener('touchstart', event => {
      lastTouchAt = Date.now();
      if (!stroke && event.changedTouches.length) {
        const touch = event.changedTouches[0];
        begin(touchPoint(event, touch));
        if (stroke) activeTouchId = touch.identifier;
      }
      event.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', event => {
      const touch = Array.from(event.changedTouches).find(item => item.identifier === activeTouchId);
      if (touch) move(touchPoint(event, touch));
      event.preventDefault();
    }, { passive: false });
    const touchEnd = event => {
      if (Array.from(event.changedTouches).some(item => item.identifier === activeTouchId)) {
        activeTouchId = null;
        end();
      }
    };
    canvas.addEventListener('touchend', touchEnd, { passive: true });
    canvas.addEventListener('touchcancel', touchEnd, { passive: true });
    canvas.addEventListener('mousedown', event => { if (Date.now() - lastTouchAt > 700) begin(event); });
    canvas.addEventListener('mousemove', event => { if (Date.now() - lastTouchAt > 700) move(event); });
    canvas.addEventListener('mouseup', () => { if (Date.now() - lastTouchAt > 700) end(); });
    canvas.addEventListener('mouseleave', () => { if (Date.now() - lastTouchAt > 700) end(); });
  }
  return { get draft() { return draft; } };
};
