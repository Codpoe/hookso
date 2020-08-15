English | [简体中文](./README.zh-CN.md)

# hookso

React state manager based on hooks. Inspired by [umijs/hox](https://github.com/umijs/hox).

[![npm](https://img.shields.io/npm/v/hookso?style=for-the-badge)](https://www.npmjs.com/package/hookso)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/hookso/peer/react?style=for-the-badge)

## Why

Hox is a great hooks-based state management tool, but it has several problems:

- Hox runs in another virtual component tree that is isolated from the application, which causes Hox's hooks to be unable to obtain the context of the real application through the useContext.
- Hox's model is global, which means that the model cannot be destroyed at runtime.

## Features

- ✨Use react hooks to define and manage state without any magic
- ✅Minimal API, with Typescript type hints
- 🚀can use react context
- 🎉Decentralized state management

## Online experience

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/festive-wiles-z6w67)

## Installation

```
yarn add hookso
# or
npm install hookso
```

## Getting started

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

### One Provider provides multiple stores

```tsx
import React from 'react';
import { Provider } from 'hookso';
import { user } from './user';
import { counter } from './counter';
import App from './App';

export default () => (
  <Provider stores={[user, counter]}>
    <App />
  </Provider>
);
```

### Performance optimization

The `use` returned by the `create` method supports passing in a `depsFn` function, and each time the hooks state value changes, `depsFn` will be called first, and then the returned dependency array will be compared with the previous one. If it is inconsistent, it will Trigger a component status update, which is similar to the second parameter of `useMemo` and `useEffect`.

```ts
const { count } = counter.use(state => [state.x, state.y]);
```

Here, when using `use`, a `depsFn` is passed in. The effect achieved is that the component state update will be triggered when `state.x` or `state.y` changes.
