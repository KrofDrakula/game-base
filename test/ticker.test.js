const expect = require('chai').expect;
const sinon = require('sinon');
const Ticker = require('../ticker.js');

describe('Ticker', () => {
  
  beforeEach(() => {
    global.requestAnimationFrame = sinon.spy(() => 1337);
    global.cancelAnimationFrame = sinon.spy();
  });
  
  afterEach(() => {
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
  });
  
  it('should register listeners to render phase by default', () => {
    let t = new Ticker, f = () => {};
    t.register(f);
    expect(t.render.length).to.equal(1);
    expect(t.render[0]).to.equal(f);
    expect(t.update).to.be.empty;
    expect(t.next).to.be.empty;
  });
  it('should register listeners to requested phase', () => {
    let t = new Ticker, f = () => {};
    t.register(f, 'update');
    expect(t.render).to.be.empty;
    expect(t.update.length).to.equal(1);
    expect(t.update[0]).to.equal(f);
    expect(t.next).to.be.empty;
  });
  it('should remove listeners from default phase if found', () => {
    let t = new Ticker, f = () => {};
    t.register(f);
    expect(t.render).to.contain(f);
    t.unregister(f);
    expect(t.render).to.be.empty;
  });
  it('should remove listeners from specified phase if found', () => {
    let t = new Ticker, f = () => {};
    t.register(f, 'update');
    expect(t.update).to.contain(f);
    t.unregister(f, 'update');
    expect(t.update).to.be.empty;
  });
  it('should ignore listeners that aren\'t found for unregister', () => {
    let t = new Ticker, f = () => {};
    t.register(f, 'update');
    t.unregister(f); // defaults to 'render'
    expect(t.update).to.contain(f);
  });
  it('should trigger registered listeners in correct order', () => {
    let t = new Ticker, collector = sinon.spy();
    t.register(() => collector('render'), 'render');
    t.register(() => collector('update'), 'update');
    t.register(() => collector('next'), 'next');
    t.tick(1);
    expect(collector.firstCall.calledWith('next')).to.be.true;
    expect(collector.secondCall.calledWith('update')).to.be.true;
    expect(collector.thirdCall.calledWith('render')).to.be.true;
  });
  it('should unregister next listener after tick', () => {
    let t = new Ticker, f = sinon.spy();
    t.register(f, 'next');
    expect(t.next).to.contain(f);
    t.tick(1);
    expect(f.calledOnce).to.be.true;
    expect(t.next).to.be.empty;
  });
  it('should register itself for rAF when starting', () => {
    let t = new Ticker, raf = global.requestAnimationFrame;
    t.start();
    expect(global.requestAnimationFrame.calledOnce).to.be.true;
  });
  it('should cancel the correct rAF ID when stopping', () => {
    let t = new Ticker, raf = global.requestAnimationFrame, caf = global.cancelAnimationFrame;
    t.start();
    expect(raf.calledOnce).to.be.true;
    t.stop();
    expect(caf.calledOnce).to.be.true;
    expect(caf.firstCall.calledWith(1337)).to.be.true;
  });
});
