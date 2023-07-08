import Ticker from "./ticker.js";
import { afterAll, beforeAll, beforeEach, expect, test, vi } from "vitest";

let raf = global.requestAnimationFrame;
let caf = global.cancelAnimationFrame;

beforeAll(() => {
  global.requestAnimationFrame = vi.fn((f) => setTimeout(f, 16));
  global.cancelAnimationFrame = vi.fn(clearTimeout);
});

beforeEach(() => {
  (global.requestAnimationFrame as ReturnType<typeof vi.fn>).mockClear();
  (global.cancelAnimationFrame as ReturnType<typeof vi.fn>).mockClear();
});

afterAll(() => {
  global.requestAnimationFrame = raf;
  global.cancelAnimationFrame = caf;
});

test("should register listeners to render phase by default", () => {
  const t = new Ticker();
  const f = () => {};
  t.register(f);
  expect(t.phases.render).toEqual(new Set([f]));
  expect(t.phases.update).to.be.empty;
  expect(t.phases.head).to.be.empty;
  expect(t.phases.tail).to.be.empty;
});

test("should register listeners to requested phase", () => {
  const t = new Ticker();
  const f = () => {};
  t.register(f, "update");
  expect(t.phases.render).to.be.empty;
  expect(t.phases.update).toEqual(new Set([f]));
  expect(t.phases.head).to.be.empty;
  expect(t.phases.tail).to.be.empty;
});

test("should remove listeners from default phase if found", () => {
  const t = new Ticker();
  const f = () => {};
  t.register(f);
  expect(t.phases.render).to.contain(f);
  t.unregister(f);
  expect(t.phases.render).to.be.empty;
});

test("should remove listeners from specified phase if found", () => {
  const t = new Ticker();
  const f = () => {};
  t.register(f, "update");
  expect(t.phases.update).to.contain(f);
  t.unregister(f, "update");
  expect(t.phases.update).to.be.empty;
});

test("should ignore listeners that aren't found for unregister", () => {
  const t = new Ticker();
  const f = () => {};
  t.register(f, "update");
  t.unregister(f); // defaults to 'render'
  expect(t.phases.update).to.contain(f);
});

test("should trigger registered listeners in correct order", () => {
  const t = new Ticker();
  const collector = vi.fn();
  t.register(() => collector("render"), "render");
  t.register(() => collector("update"), "update");
  t.register(() => collector("head"), "head");
  t.register(() => collector("tail"), "tail");
  t.start();
  t.stop();
  expect(collector.mock.calls[0][0]).toEqual("head");
  expect(collector.mock.calls[1][0]).toEqual("update");
  expect(collector.mock.calls[2][0]).toEqual("render");
  expect(collector.mock.calls[3][0]).toEqual("tail");
});

test("should unregister head listener after tick", () => {
  const t = new Ticker();
  const f = vi.fn();
  t.register(f, "head");
  expect(t.phases.head).to.contain(f);
  t.start();
  t.stop();
  expect(f.mock.calls.length).toBe(1);
  expect(t.phases.head).to.be.empty;
});

test("should unregister tail listener after tick", () => {
  const t = new Ticker();
  const f = vi.fn();
  t.register(f, "tail");
  expect(t.phases.tail).to.contain(f);
  t.start();
  t.stop();
  expect(f.mock.calls.length).toBe(1);
  expect(t.phases.tail).to.be.empty;
});

test("should register and unregister itself for rAF when starting/stopping", () => {
  const t = new Ticker();
  t.start();
  expect(global.requestAnimationFrame).toHaveBeenCalledOnce();
  t.stop();
  expect(global.cancelAnimationFrame).toHaveBeenCalledOnce();
});
