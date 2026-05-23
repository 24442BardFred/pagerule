import { describe, it, expect, vi } from 'vitest';
import { createPageHooks, withHooks, PageHooks } from './pageHooks';

describe('createPageHooks', () => {
  it('should call onStart handler with correct payload', () => {
    const hooks = createPageHooks();
    const handler = vi.fn();
    hooks.onStart(handler);
    hooks.emitter.emit('paginate:start', { totalItems: 100, pageSize: 10 });
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].payload).toEqual({ totalItems: 100, pageSize: 10 });
  });

  it('should call onPage handler with correct payload', () => {
    const hooks = createPageHooks();
    const handler = vi.fn();
    hooks.onPage(handler);
    hooks.emitter.emit('paginate:page', { page: 2, totalPages: 5 });
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].payload).toEqual({ page: 2, totalPages: 5 });
  });

  it('should call onComplete handler with correct payload', () => {
    const hooks = createPageHooks();
    const handler = vi.fn();
    hooks.onComplete(handler);
    hooks.emitter.emit('paginate:complete', { totalPages: 5, elapsed: 42 });
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].payload).toEqual({ totalPages: 5, elapsed: 42 });
  });

  it('should call onError handler when error event is emitted', () => {
    const hooks = createPageHooks();
    const handler = vi.fn();
    const err = new Error('fail');
    hooks.onError(handler);
    hooks.emitter.emit('paginate:error', undefined, err);
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].error).toBe(err);
  });

  it('should expose the underlying emitter', () => {
    const hooks = createPageHooks();
    expect(hooks.emitter).toBeDefined();
    expect(typeof hooks.emitter.on).toBe('function');
  });
});

describe('withHooks', () => {
  it('should create hooks internally when none provided', () => {
    const result = withHooks((hooks: PageHooks) => {
      expect(hooks).toBeDefined();
      return 'ok';
    });
    expect(result).toBe('ok');
  });

  it('should use provided hooks when given', () => {
    const hooks = createPageHooks();
    const spy = vi.spyOn(hooks, 'onStart');
    withHooks((h) => {
      h.onStart(vi.fn());
    }, hooks);
    expect(spy).toHaveBeenCalledOnce();
  });
});
