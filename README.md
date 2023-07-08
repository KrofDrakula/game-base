# Game Base

Base classes for game development. Low overhead, high performance.

## Ticker

Ticker allows scheduling `update` and `render` functions to fire on every animation frame in definite order to avoid layout thrashing and unnecessary style recalculations.

In the `update` phase, all functions should only read properties and attributes from the DOM without modifying it. Instead, these changes should be collected and flushed within the `render` phase. This enables the browser to only do one style and layout recalculation and one paint on every frame.

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
