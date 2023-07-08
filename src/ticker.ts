export type Phase = "head" | "update" | "render" | "tail";

export type Listener = (delta: number) => void;

class Ticker {
  phases = Object.freeze({
    head: new Set<Listener>(),
    update: new Set<Listener>(),
    render: new Set<Listener>(),
    tail: new Set<Listener>(),
  });

  #running: boolean = false;

  get running() {
    return this.#running;
  }

  #rafId: number | null = null;
  #lastTime: number | null = null;
  #sequence: Phase[] = ["head", "update", "render", "tail"];

  private tick = (now: number) => {
    this.#rafId = requestAnimationFrame(this.tick);
    const delta = this.#lastTime === null ? 0 : now - this.#lastTime;
    for (const phase of this.#sequence) {
      for (const listener of this.phases[phase]) {
        try {
          listener(delta);
        } catch (err) {
          console.error(err);
        }
      }
    }
    this.phases.head.clear();
    this.phases.tail.clear();
  };

  register(listener: Listener, phase: Phase = "render") {
    this.phases[phase].add(listener);
  }

  unregister(listener: Listener, phase: Phase = "render") {
    this.phases[phase].delete(listener);
  }

  start = () => {
    if (this.running) {
      console.warn("Ticker already running");
      return;
    }
    this.#running = true;
    this.tick(performance.now());
  };

  stop = () => {
    cancelAnimationFrame(this.#rafId!);
    this.#rafId = null;
    this.#running = false;
  };
}

export default Ticker;
