import { useContext, useState, useRef, useEffect } from 'react';
import { StoresContext, DEFAULT_STORE_STATE } from './constants';
import { StorKey, UseStore, Subscriber } from './types';

export function inject<K = any>(key: StorKey): UseStore<K> {
  const useStore: UseStore<K> = depsFn => {
    const store = useContext(StoresContext)[key as any];
    const [state, setState] = useState(() => {
      if (!store) {
        return DEFAULT_STORE_STATE;
      }
      return store.state;
    });
    const depsRef = useRef<any[]>([]);

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

    if (state === DEFAULT_STORE_STATE) {
      throw new Error(
        'No context found. You need to render a Provider of this store.'
      );
    }

    return state;
  };

  return useStore;
}
