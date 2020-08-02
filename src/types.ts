export type StorKey = symbol | string;

export type StoreHook<T = any, K = any> = (params: T) => K;

export type Subscriber<K = any> = (value: K) => void;

export type DepsFn<K> = (value: K) => any[];

export type UseStoreFn<K> = (depsFn?: DepsFn<K>) => K;

export interface UseStore<K> extends UseStoreFn<K> {
  readonly Provider: React.ComponentType<any>;
}
