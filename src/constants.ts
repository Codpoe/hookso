import { createContext } from 'react';
import { Store } from './Store';
import { StorKey } from './types';

export const StoresContext = createContext<Record<StorKey, Store>>({});

export const DEFAULT_STORE_STATE = Symbol('DEFAULT_STORE_STATE') as any;
