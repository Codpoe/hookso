import { provide, provideGlobal } from './provide';
import { useStore, useGlobalStore } from './useStore';
import { connect } from './connect';
import { StoreHook, CreateResult, DepsFn, MapStateToProps } from './types';

export function create<T, K>(hook: StoreHook<undefined, K>): CreateResult<K>;
export function create<T, K>(hook: StoreHook<T, K>, params: T): CreateResult<K>;
export function create<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): CreateResult<K> {
  const key = Symbol(hook.name || 'AnonymousStore');
  return {
    Provider: provide(key, hook, params),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    use: (depsFn?: DepsFn<K>) => useStore(key, depsFn),
    connect: <P>(mapStateToProps?: MapStateToProps<K, P>) =>
      connect<P, K>(key, mapStateToProps),
  };
}

export function createGlobal<T, K>(
  hook: StoreHook<undefined, K>
): CreateResult<K>['use'];
export function createGlobal<T, K>(
  hook: StoreHook<T, K>,
  params: T
): CreateResult<K>['use'];
export function createGlobal<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): CreateResult<K>['use'] {
  const store = provideGlobal(hook, params);
  return (depsFn?: DepsFn<K>) => useGlobalStore(store, depsFn);
}
