# Hookso

基于 hooks 的 React 状态管理工具。灵感源自 [umijs/hox](https://github.com/umijs/hox)。

[![npm](https://img.shields.io/npm/v/hookso)](https://www.npmjs.com/package/hookso)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/hookso/peer/react)

## 为什么

Hox 是一个非常棒的基于 hooks 的状态管理工具，但它有几点问题：

- Hox 运行在与应用隔离的另一个虚拟组件树中，这导致 Hox 的 hooks 无法通过 `useContext` 获取到真实应用的 `context`。
- Hox 的 model 是全局的，这意味着在运行时无法销毁 model。

## 特性

- ✨ 使用 react hooks 来定义、管理状态，没有任何魔法
- ✅ 极简的 API，有 Typescript 的类型提示
- 🚀 可使用 react context
- 🎉 分散状态管理

## 在线体验

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/festive-wiles-z6w67)

## 安装

```
yarn add hookso
# or
npm install hookso
```

## 快速上手

### 创建 store

```ts
// counter.ts

import { useState } from 'react';
import { use } from 'hookso';

export const useCounter = use(() => {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  return { count, decrement, increment };
});
```

### 使用 store

```tsx
// App.tsx

import React from 'react';
import { useCounter } from './counter';

export default () => {
  const { count, decrement, increment } = useCounter();

  return (
    <>
      count is: {count}
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </>
  );
};
```

然后把 `useCounter.Provider` 挂载到合适的祖先节点上。

```tsx
// index.tsx

import React from 'react';
import { render } from 'react-dom';
import { useCounter } from './counter';
import App from './App';

const rootElement = document.getElementById('root');

render(
  <useCounter.Provider>
    <App />
  </useCounter.Provider>,
  rootElement
);
```

至此，仅使用一个 API `use` 就完成了计数器的状态管理。

### 性能优化

`use`方法返回的 `useXXX` 支持传入一个 `depsFn` 函数，在每次 hooks 状态值变化时会先调用 `depsFn`，然后把返回的依赖数组与上一次的进行对比，如果不一致就会触发一次组件状态更新，类似于 `useMemo`、`useEffect` 的第二个参数。

```ts
const counter = useCounter(state => [state.x, state.y]);
```

这里在使用 `useCounter` 时传入了一个 `depsFn`，实现的效果是当 `state.x` 或 `state.y` 有变化时才会触发组件状态更新。

## API

### provide

```ts
function provide<T, K>(
  key: StorKey,
  hook: StoreHook<T, K>,
  params: T
): React.ComponentType<any>;
```

### inject

```ts
function inject<K = any>(key: StorKey): UseStore<K>;
```

### use

```ts
function use<T, K>(hook: StoreHook<T, K>, params: T): UseStore<K>;
```

其实 `use` 只是为了易用而对 `provide` 和 `inject` 做了一点微小的封装，直接使用 `provide` 和 `inject` 也能实现一样的效果。

```ts
// counter.ts

import { useState } from 'react';
import { provide, inject } from 'hookso';

export const CounterKey = Symbol('Counter');

const hook = () => {
  const [count, setCount] = useState(0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  return { count, decrement, increment };
};

export const CounterProvider = provide(CounterKey, hook);

export const useCounter = inject<ReturnType<typeof hook>>(CounterKey);
```
