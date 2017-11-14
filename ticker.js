class Ticker {
  constructor(autostart = false) {
    this.head = [];
    this.update = [];
    this.render = [];
    this.tail = [];
    this._autostart = autostart;
    this._running = false;
    this._lastTime = null;
    this._rafId = null;
    this.tick = this.tick.bind(this);
  }
  tick(now) {
    this._rafId = requestAnimationFrame(this.tick);
    if (this._lastTime === null)
      this._lastTime = now;
    const elapsed = now - this._lastTime;
    this.fire(elapsed);
    this._lastTime = now;
  }
  fire(elapsed) {
    const invoke = fn => fn(elapsed);
    this.head.forEach(invoke);
    this.head = [];
    this.update.forEach(invoke);
    this.render.forEach(invoke);
    this.tail.forEach(invoke);
    this.tail = [];
  }
  register(listener, phase = 'render') {
    this[phase].push(listener);
    if (this._autostart)
      this.start();
  }
  unregister(listener, phase = 'render') {
    let arr = this[phase],
        idx = arr.indexOf(listener);
    if (idx > -1)
      arr.splice(idx, 1);
    if (this._autostart && this.head.length && this.update.length && this.render.length && this.tail.length)
      this.stop();
  }
  start() {
    if (this._running) return;
    this._rafId = requestAnimationFrame(this.tick);
    this._running = true;
  }
  stop() {
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._running = false;
  }
}

module.exports = Ticker;
