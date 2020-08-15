import React from 'react';
import { Provider } from './Provider';
import { useStore } from './useStore';
import { connect } from './connect';
import { StoreHook, FacadeStore, DepsFn, MapStateToProps } from './types';

export function create<T, K>(
  hook: StoreHook<undefined, K>
): FacadeStore<undefined, K>;
export function create<T, K>(
  hook: StoreHook<T, K>,
  params: T
): FacadeStore<T, K>;
export function create<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): FacadeStore<T | undefined, K> {
  const name = hook.name || 'AnonymousStore';
  const key = Symbol(name);

  const OwnProvider: React.FC = props =>
    React.createElement(Provider, {
      ...props,
      stores: [{ key, hook, params }],
    });

  OwnProvider.displayName = `${name}Provider`;

  return {
    key,
    hook,
    params,
    Provider: OwnProvider,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    use: (depsFn?: DepsFn<K>) => useStore(key, depsFn),
    connect: <P>(mapStateToProps?: MapStateToProps<K, P>) =>
      connect<P, K>(key, mapStateToProps),
  };
}
