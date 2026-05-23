import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createPageEventEmitter,
  PageEvent,
  PageEventEmitter,
} from './pageEvent';

describe('createPageEventEmitter', () => {
  let emitter: PageEventEmitter;

  beforeEach(() => {
    emitter = createPageEventEmitter();
  });

  it('should call registered handler when event is emitted', () => {
    const handler = vi.fn();
    emitter.on('paginate:start', handler);
    emitter.emit('paginate:start', { page: 1 });
    expect(handler).toHaveBeenCalledOnce();
    const event: PageEvent = handler.mock.calls[0][0];
    expect(event.type).toBe('paginate:start');
    expect(event.payload).toEqual({ page: 1 });
    expect(typeof event.timestamp).toBe('number');
  });

  it('should not call handler after off() is called', () => {
    const handler = vi.fn();
    emitter.on('paginate:page', handler);
    emitter.off('paginate:page', handler);
    emitter.emit('paginate:page');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should support multiple handlers for the same event', () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    emitter.on('paginate:complete', h1);
    emitter.on('paginate:complete', h2);
    emitter.emit('paginate:complete');
    expect(h1).toHaveBeenCalledOnce();
    expect(h2).toHaveBeenCalledOnce();
  });

  it('should include error in emitted event', () => {
    const handler = vi.fn();
    const err = new Error('oops');
    emitter.on('paginate:error', handler);
    emitter.emit('paginate:error', undefined, err);
    const event: PageEvent = handler.mock.calls[0][0];
    expect(event.error).toBe(err);
  });

  it('should clear all handlers for a specific event type', () => {
    const handler = vi.fn();
    emitter.on('paginate:start', handler);
    emitter.clear('paginate:start');
    emitter.emit('paginate:start');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should clear all handlers when no type is provided', () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    emitter.on('paginate:start', h1);
    emitter.on('paginate:complete', h2);
    emitter.clear();
    emitter.emit('paginate:start');
    emitter.emit('paginate:complete');
    expect(h1).not.toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  it('should not throw when emitting with no listeners', () => {
    expect(() => emitter.emit('paginate:page', { page: 2 })).not.toThrow();
  });
});
