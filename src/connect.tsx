import React, { useMemo, useCallback, useRef } from 'react';
import { useStore } from './useStore';
import { StorKey, MapStateToProps, HOC, DepsFn } from './types';

export function connect<P, K = any>(
  key: StorKey,
  mapStateToProps: MapStateToProps<K, P> = s => s as any
): HOC<P> {
  const wrap: HOC<P> = Component => {
    const Wrapper: React.FC<any> = props => {
      const injectPropsRef = useRef<P>();

      const depsFn = useCallback<DepsFn<K>>(state => {
        injectPropsRef.current = mapStateToProps(state);
        return Object.values(injectPropsRef.current);
      }, []);
      const state = useStore(key, depsFn);

      useMemo(() => {
        injectPropsRef.current = mapStateToProps(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <Component {...props} {...injectPropsRef.current} />;
    };

    Wrapper.displayName = `${
      Component.displayName || 'AnonymousComponent'
    }Wrapper`;

    return Wrapper;
  };

  return wrap;
}
