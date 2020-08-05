import React, { useContext, useMemo } from 'react';
import { Store } from './Store';
import { Executor } from './Executor';
import { render } from './render';
import { StoresContext } from './constants';
import { StoreKey, StoreHook } from './types';

export function provide<T, K>(
  key: StoreKey,
  hook: StoreHook<undefined, K>
): React.ComponentType<any>;
export function provide<T, K>(
  key: StoreKey,
  hook: StoreHook<T, K>,
  params: T
): React.ComponentType<any>;
export function provide<T, K>(
  key: StoreKey,
  hook: StoreHook<T | undefined, K>,
  params?: T
): React.ComponentType<any> {
  const Provider: React.FC = props => {
    const { children } = props;
    const parentStores = useContext(StoresContext);
    const store = useMemo(() => new Store(hook, params), []);
    const stores = useMemo(() => {
      // proto chain
      const _stores: Record<StoreKey, Store> = Object.create(
        parentStores || null
      );
      // fix: Type 'symbol' cannot be used as an index type
      _stores[key as any] = store;
      return _stores;
    }, [parentStores, store]);

    return (
      <>
        {/* 需要先执行 Executor 获取 hook 的初始 state */}
        <Executor store={store} />
        <StoresContext.Provider value={stores}>
          {children}
        </StoresContext.Provider>
      </>
    );
  };

  return Provider;
}

export function provideGlobal<T, K>(
  hook: StoreHook<undefined, K>
): Store<undefined, K>;
export function provideGlobal<T, K>(
  hook: StoreHook<T, K>,
  params: T
): Store<T, K>;
export function provideGlobal<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): Store<T | undefined, K> {
  const store = new Store(hook, params);

  render(<Executor store={store} />);

  return store;
}
