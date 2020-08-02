import { provide } from './provide';
import { inject } from './inject';
import { StoreHook, UseStore } from './types';

export function use<T, K>(hook: StoreHook<undefined, K>): UseStore<K>;
export function use<T, K>(hook: StoreHook<T, K>, params: T): UseStore<K>;
export function use<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): UseStore<K> {
  const key = Symbol(hook.name || 'AnonymousStore');
  const Provider = provide(key, hook, params);
  const useStore = inject(key);

  Object.defineProperties(useStore, {
    Provider: {
      value: Provider,
    },
  });

  return useStore as UseStore<K>;
}
