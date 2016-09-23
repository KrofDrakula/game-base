class Ticker {
  constructor() {
    this.next = [];
    this.update = [];
    this.render = [];
    this._lastTime = null;
    this._rafId = null;
    this.tick = this.tick.bind(this);
  }
  tick(now) {
    if (this._lastTime === null)
      this._lastTime = now;
    const elapsed = now - this._lastTime;
    this.fire(elapsed);
    this._lastTime = now;
    this._rafId = requestAnimationFrame(this.tick);
  }
  fire(elapsed) {
    const invoke = fn => fn(elapsed);
    this.next.forEach(invoke);
    this.update.forEach(invoke);
    this.render.forEach(invoke);
    this.next.length = 0;
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
    this._rafId = requestAnimationFrame(this.tick);
  }
  stop() {
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }
}

module.exports = Ticker;
