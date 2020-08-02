import React, { useMemo } from 'react';
import { inject } from './inject';
import { StorKey, MapStateToProps, HOC } from './types';

export function connect<P, K = any>(
  key: StorKey,
  mapStateToProps: MapStateToProps<K, P>
): HOC<P> {
  const useStore = inject<K>(key);

  const wrap: HOC<P> = Component => {
    const Wrapper: React.FC<any> = props => {
      let injectProps: P | undefined;
      const state = useStore(v => {
        injectProps = mapStateToProps(v);
        return Object.values(injectProps);
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
      useMemo(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        injectProps = mapStateToProps(state);
      }, []);

      return <Component {...props} {...injectProps} />;
    };

    Wrapper.displayName = `${
      Component.displayName || 'AnonymousComponent'
    }Wrapper`;

    return Wrapper;
  };

  return wrap;
}
