import { createContext } from 'react';
import { Store } from './Store';
import { StoreKey } from './types';

export const StoresContext = createContext<Record<StoreKey, Store>>({});

export const DEFAULT_STORE_STATE = Symbol('DEFAULT_STORE_STATE') as any;
