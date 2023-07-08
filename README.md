# Game Base

Base classes for game development. Low overhead, high performance.

## Ticker

Ticker allows scheduling `update` and `render` functions to fire on every animation frame in definite order to avoid layout thrashing and unnecessary style recalculations.

In the `update` phase, all functions should only read properties and attributes from the DOM without modifying it. Instead, these changes should be collected and flushed within the `render` phase. This enables the browser to only do one style and layout recalculation and one paint on every frame.

Phases available to register listeners for are executed in the following order:

- `head` (cleared after every frame)
- `update`
- `render`
- `tail` (cleared after every frame)

### Example

```ts
import { Ticker } from "game-base";

const ticker = new Ticker();

const div = document.querySelector("#some-div")! as HTMLDivElement;

let w = 0;
let h = 0;

const onUpdate = () => {
  const rect = div.getBoundingClientRect();
  w = rect.width;
  h = rect.heigth;
};

const onRender = () => {
  rect.style.background = `rgb(${w % 256}, ${h % 256}, 0)`;
  rect.textContent = `${w} × ${h}`;
};

ticker.register(onUpdate, "update");
ticker.register(onRender, "render");

// the listeners will not fire until ticker is started
ticker.start();
```

### API

All listeners should be of type `(delta: number) => void`. `delta` is the number of milliseconds passed since the last animation frame.

When starting `Ticker` all registered listeners will be called with `delta = 0`.

Ticker will ignore errors thrown by each listener and continue with execution. Errors will be logged to the console.

| method                         | description                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `register(listener, phase?)`   | Registers a function to run in the given phase. Defaults to `render`.                                              |
| `unregister(listener, phase?)` | Unregisters a function that runs in the given phase. Defaults to `render`.                                         |
| `start()`                      | Starts the ticker. It immediately fires all listeners with `delta = 0` and registers with `requestAnimationFrame`. |
| `stop()`                       | Stops the ticker by unregistering the next `requestAnimationFrame`.                                                |
| `running`                      | A boolean representing the ticker's running state.                                                                 |
| `phases`                       | A dictionary of `Set<Listener>`s containing all of the registered listeners.                                       |
