import { createPageEventEmitter, PageEventEmitter, PageEventType, PageEventHandler } from './pageEvent';

export interface PageHooks {
  onStart: (handler: PageEventHandler<{ totalItems: number; pageSize: number }>) => void;
  onPage: (handler: PageEventHandler<{ page: number; totalPages: number }>) => void;
  onComplete: (handler: PageEventHandler<{ totalPages: number; elapsed: number }>) => void;
  onError: (handler: PageEventHandler<undefined>) => void;
  emitter: PageEventEmitter;
}

export function createPageHooks(): PageHooks {
  const emitter = createPageEventEmitter();

  function on<T>(type: PageEventType, handler: PageEventHandler<T>) {
    emitter.on<T>(type, handler);
  }

  return {
    emitter,
    onStart(handler) {
      on<{ totalItems: number; pageSize: number }>('paginate:start', handler);
    },
    onPage(handler) {
      on<{ page: number; totalPages: number }>('paginate:page', handler);
    },
    onComplete(handler) {
      on<{ totalPages: number; elapsed: number }>('paginate:complete', handler);
    },
    onError(handler) {
      on<undefined>('paginate:error', handler);
    },
  };
}

export function withHooks<T>(
  fn: (hooks: PageHooks) => T,
  hooks?: PageHooks
): T {
  const resolvedHooks = hooks ?? createPageHooks();
  return fn(resolvedHooks);
}
