function Ticker() {
  this.head = [];
  this.update = [];
  this.render = [];
  this.tail = [];
  this._running = false;
  this._lastTime = null;
  this._rafId = null;
  this.tick = this.tick.bind(this);
}

Ticker.prototype.tick = function(now) {
  this._rafId = requestAnimationFrame(this.tick);
  if (this._lastTime === null) this._lastTime = now;
  var elapsed = now - this._lastTime;
  this.fire(elapsed);
  this._lastTime = now;
};

Ticker.prototype.fire = function(elapsed) {
  var invoke = function(fn) {
    return fn(elapsed);
  };
  var heads = Array.from(this.head);
  this.head = [];
  heads.forEach(invoke);
  this.update.forEach(invoke);
  this.render.forEach(invoke);
  var tails = Array.from(this.tail);
  this.tail = [];
  tails.forEach(invoke);
};

Ticker.prototype.register = function(listener, phase) {
  phase = phase || "render";
  this[phase].push(listener);
};

Ticker.prototype.unregister = function(listener, phase) {
  phase = phase || "render";
  var arr = this[phase],
    idx = arr.indexOf(listener);
  if (idx > -1) arr.splice(idx, 1);
};

Ticker.prototype.start = function() {
  if (this._running) return;
  this._rafId = requestAnimationFrame(this.tick);
  this._running = true;
};

Ticker.prototype.stop = function() {
  cancelAnimationFrame(this._rafId);
  this._rafId = null;
  this._running = false;
};

module.exports = Ticker;
