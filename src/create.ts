import { provide } from './provide';
import { inject } from './inject';
import { connect } from './connect';
import { StoreHook, CreateResult } from './types';

export function create<T, K>(hook: StoreHook<undefined, K>): CreateResult<K>;
export function create<T, K>(hook: StoreHook<T, K>, params: T): CreateResult<K>;
export function create<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): CreateResult<K> {
  const key = Symbol(hook.name || 'AnonymousStore');
  return {
    Provider: provide(key, hook, params),
    use: inject(key),
    connect: mapStateToProps => connect(key, mapStateToProps),
  };
}
