English | [简体中文](./README.zh-CN.md)

# hookso

React state manager based on hooks. Inspired by [umijs/hox](https://github.com/umijs/hox).

[![npm](https://img.shields.io/npm/v/hookso)](https://www.npmjs.com/package/hookso)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/hookso/peer/react)

## Why

Hox is a great hooks-based state management tool, but it has several problems:

- Hox runs in another virtual component tree that is isolated from the application, which causes Hox's hooks to be unable to obtain the context of the real application through the useContext.
- Hox's model is global, which means that the model cannot be destroyed at runtime.

## Features

- ✨ Use react hooks to define and manage state without any magic
- ✅ Minimalist API, with Typescript type hints
- 🚀 can use react context
- 🎉 Decentralized state management

## Online experience

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/festive-wiles-z6w67)

## Installation

```
yarn add hookso
# or
npm install hookso
```

## Getting Started

### Create store

```ts
// counter.ts

import { useState } from 'react';
import { create } from 'hookso';

export const counter = create(() => {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  return { count, decrement, increment };
});
```

### Use store

```tsx
// App.tsx

import React from 'react';
import { counter } from './counter';

export default () => {
  const { count, decrement, increment } = counter.use();

  return (
    <>
      count is: {count}
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </>
  );
};
```

Then mount `counter.Provider` to the appropriate ancestor node.

```tsx
// index.tsx

import React from 'react';
import { render } from 'react-dom';
import { counter } from './counter';
import App from './App';

const rootElement = document.getElementById('root');

render(
  <counter.Provider>
    <App />
  </counter.Provider>,
  rootElement
);
```

So far, only one API `create` is used to complete the state management of the counter.

### Use store in Class component

```tsx
// App.tsx

import React from 'react';
import { counter } from './counter';

export interface AppProps {
  count: number;
  decrement: () => void;
  increment: () => void;
}

class App extends React.Component<AppProps> {
  render() {
    const { count, decrement, increment } = this.props;

    return (
      <>
        count is: {count}
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </>
    );
  }
}

// connect
export default counter.connect()(App);
```

### Performance optimization

The `use` returned by the `create` method supports passing in a `depsFn` function. Each time the hooks state value changes, `depsFn` will be called first, and then the returned dependency array will be compared with the previous one. If it is inconsistent, it will Trigger a component status update, similar to the second parameter of `useMemo` and `useEffect`.

```ts
const { count } = counter.use(state => [state.x, state.y]);
```

Here, when using `use`, a `depsFn` is passed in. The effect achieved is that the component state update will be triggered when `state.x` or `state.y` changes.

## API

### provide

```ts
function provide<T, K>(
  key: StorKey,
  hook: StoreHook<T, K>,
  params: T
): React.ComponentType<any>;
```

### useStore

```ts
function useStore<K = any>(key: StorKey, depsFn?: DepsFn<K>): K;
```

### connect

```ts
function connect<P, K = any>(
  key: StorKey,
  mapStateToProps: MapStateToProps<K, P> = s => s as any
): HOC<P>;
```

### create

```ts
function create<T, K>(
  hook: StoreHook<T | undefined, K>,
  params?: T
): CreateResult<K>;
```

In fact, `create` only encapsulates `provide`, `useStore`, and `connect` for ease of use. The same effect can be achieved by directly using these three APIs.

```ts
// counter.ts

import {useState} from'react';
import {provide, useStore} from'hookso';

export const counterKey = Symbol('Counter');

const hook = () => {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count-1);
  const increment = () => setCount(count + 1);

  return {count, decrement, increment };
};

export const CounterProvider = provide(counterKey, hook);

export const useCounter = () = useStore<ReturnType<typeof hook>>(counterKey);
```
