export type PageEventType =
  | 'paginate:start'
  | 'paginate:page'
  | 'paginate:complete'
  | 'paginate:error';

export interface PageEvent<T = unknown> {
  type: PageEventType;
  timestamp: number;
  payload?: T;
  error?: Error;
}

export type PageEventHandler<T = unknown> = (event: PageEvent<T>) => void;

export interface PageEventEmitter {
  on<T>(type: PageEventType, handler: PageEventHandler<T>): void;
  off<T>(type: PageEventType, handler: PageEventHandler<T>): void;
  emit<T>(type: PageEventType, payload?: T, error?: Error): void;
  clear(type?: PageEventType): void;
}

export function createPageEventEmitter(): PageEventEmitter {
  const listeners = new Map<PageEventType, Set<PageEventHandler<unknown>>>();

  function getOrCreate(type: PageEventType): Set<PageEventHandler<unknown>> {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    return listeners.get(type)!;
  }

  return {
    on<T>(type: PageEventType, handler: PageEventHandler<T>) {
      getOrCreate(type).add(handler as PageEventHandler<unknown>);
    },

    off<T>(type: PageEventType, handler: PageEventHandler<T>) {
      listeners.get(type)?.delete(handler as PageEventHandler<unknown>);
    },

    emit<T>(type: PageEventType, payload?: T, error?: Error) {
      const event: PageEvent<T> = { type, timestamp: Date.now(), payload, error };
      listeners.get(type)?.forEach((handler) => handler(event as PageEvent<unknown>));
    },

    clear(type?: PageEventType) {
      if (type) {
        listeners.delete(type);
      } else {
        listeners.clear();
      }
    },
  };
}
