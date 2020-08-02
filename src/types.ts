import React from 'react';

export type StorKey = symbol | string;

export type StoreHook<T = any, K = any> = (params: T) => K;

export type Subscriber<K = any> = (value: K) => void;

export type DepsFn<K> = (value: K) => any[];

export type MapStateToProps<K = any, P = any> = (state: K) => P;

export type MixinProps<Props, InjectProps> = {
  [T in keyof Props]: T extends keyof InjectProps
    ? InjectProps[T] extends Props[T]
      ? Props[T]
      : InjectProps[T]
    : Props[T];
};

export type HOC<InjectProps> = <Props extends MixinProps<Props, InjectProps>>(
  Component: React.ComponentType<Props>
) => React.ComponentType<Omit<Props, keyof InjectProps>>;

export interface CreateResult<K> {
  Provider: React.ComponentType<any>;
  use: (depsFn?: DepsFn<K>) => K;
  connect: <P>(mapStateToProps?: MapStateToProps<K, P>) => HOC<P>;
}
