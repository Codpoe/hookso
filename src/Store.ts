import { DEFAULT_STORE_STATE } from './constants';
import { Subscriber, StoreHook } from './types';

export class Store<T = any, K = any> {
  private _state: K = DEFAULT_STORE_STATE;

  private readonly _subscribers: Set<Subscriber<K>> = new Set<Subscriber<K>>();

  constructor(hook: StoreHook<undefined, K>);

  constructor(hook: StoreHook<T, K>, params: T);

  constructor(
    public readonly hook: StoreHook<T, K>,
    public readonly params?: T
  ) {}

  get state(): K {
    if (this._state === DEFAULT_STORE_STATE) {
      throw new Error(
        'No context found. You need to render a Provider of this store.'
      );
    }
    return this._state;
  }

  setState(value: K): void {
    if (this._state === value) {
      return;
    }
    this._state = value;
    this._subscribers.forEach(subscriber => subscriber(value));
  }

  subscribe(subscriber: Subscriber<K>): () => void {
    this._subscribers.add(subscriber);
    return () => {
      this._subscribers.delete(subscriber);
    };
  }
}
