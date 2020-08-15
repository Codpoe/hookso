import React, { useContext, useMemo, useRef } from 'react';
import { Store } from './Store';
import { Executor } from './Executor';
import { StoresContext } from './constants';
import { FacadeStore, StorKey } from './types';

export interface ProviderProps {
  stores: Pick<FacadeStore<any, any>, 'key' | 'hook' | 'params'>[];
}

export const Provider: React.FC<ProviderProps> = props => {
  const { stores: facadeStores, children } = props;

  const parentStores = useContext(StoresContext);
  const ownStoresRef = useRef<Record<StorKey, Store>>({});

  const stores = useMemo(() => {
    // proto chain
    const _stores: Record<StorKey, Store> = Object.create(parentStores || null);

    return facadeStores.reduce((acc, { key, hook, params }) => {
      if (ownStoresRef.current[key as any]) {
        acc[key as any] = ownStoresRef.current[key as any];
      } else {
        acc[key as any] = new Store(hook, params);
        ownStoresRef.current[key as any] = acc[key as any];
      }
      return acc;
    }, _stores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentStores, ...facadeStores]);

  return (
    <>
      {facadeStores.map(({ key }, index) => (
        <Executor key={index} store={stores[key as any]} />
      ))}
      <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
    </>
  );
};
