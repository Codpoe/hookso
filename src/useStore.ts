import { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { StoresContext, DEFAULT_STORE_STATE } from './constants';
import { Store } from './Store';
import { StoreKey, DepsFn, Subscriber } from './types';

function useSubscribe<T, K>(store: Store<T, K>, depsFn?: DepsFn<K>): K {
  const [state, setState] = useState(() => {
    if (!store) {
      return DEFAULT_STORE_STATE;
    }
    return store.state;
  });

  if (state === DEFAULT_STORE_STATE) {
    throw new Error(
      'No context found. You need to render a Provider of this store.'
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const firstDeps = useMemo(() => (depsFn ? depsFn(store.state) : []), []);
  const depsRef = useRef<any[]>(firstDeps);

  useEffect(() => {
    const subscriber: Subscriber = value => {
      if (!depsFn) {
        setState(value);
        return;
      }

      const oldDeps = depsRef.current;
      const newDeps = depsFn(value);

      if (
        oldDeps.length !== newDeps.length ||
        oldDeps.some((dep, index) => dep !== newDeps[index])
      ) {
        setState(value);
      }

      depsRef.current = newDeps;
    };

    return store?.subscribe(subscriber);
  }, [store, depsFn]);

  return state;
}

export function useStore<K = any>(key: StoreKey, depsFn?: DepsFn<K>): K {
  const store = useContext(StoresContext)[key as any];
  return useSubscribe(store, depsFn);
}

export function useGlobalStore<K = any>(
  store: Store<any, K>,
  depsFn?: DepsFn<K>
): K {
  return useSubscribe(store, depsFn);
}
