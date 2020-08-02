import React, { useMemo, useEffect } from 'react';
import { Store } from './Store';

export interface ExecutorProps {
  store: Store;
}

export const Executor: React.FC<ExecutorProps> = props => {
  const { store } = props;
  const state = store.hook(store.params);

  useMemo(() => {
    store.setState(state);
  }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    store.setState(state);
  }, [store, state]);

  return null;
};
