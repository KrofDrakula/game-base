class Ticker {
  constructor() {
    this.head = [];
    this.update = [];
    this.render = [];
    this.tail = [];
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
    const heads = Array.from(this.head);
    this.head = [];
    heads.forEach(invoke);
    this.update.forEach(invoke);
    this.render.forEach(invoke);
    const tails = Array.from(this.tail);
    this.tail = [];
    tails.forEach(invoke);
  }
  register(listener, phase = 'render') {
    this[phase].push(listener);
  }
  unregister(listener, phase = 'render') {
    let arr = this[phase],
        idx = arr.indexOf(listener);
    if (idx > -1)
      arr.splice(idx, 1);
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
