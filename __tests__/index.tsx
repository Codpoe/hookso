import React, { useState, useCallback } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { create, Provider } from '../src';

const useCounter = (initial?: number) => {
  const [count, setCount] = useState(initial ?? 0);
  const decrement = useCallback(() => setCount(prev => prev - 1), []);
  const increment = useCallback(() => setCount(prev => prev + 1), []);

  return { count, decrement, increment };
};

const counterStore = create(useCounter);
const counterStoreWithParams = create(useCounter, 10);

const App: React.FC = () => {
  const { count, decrement, increment } = counterStore.use();
  return (
    <div>
      <p>{count}</p>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

const AppWithDeps: React.FC = () => {
  const { count, decrement, increment } = counterStore.use(() => []);
  return (
    <div>
      <p>{count}</p>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

const AppWithParams: React.FC = () => {
  const { count, decrement, increment } = counterStoreWithParams.use();
  return (
    <div>
      <p>{count}</p>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

const ConnectedApp = counterStore.connect(state => ({
  n: state.count,
}))((props: { n: number }) => <div>{props.n}</div>);

test('create & use', () => {
  const renderResult = render(
    <counterStore.Provider>
      <App />
    </counterStore.Provider>
  );

  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.getByText('0')).toBeTruthy();
  fireEvent.click(renderResult.getByText('Decrement'));
  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.queryByText('-1')).toBeTruthy();
});

test('create with params', () => {
  const renderResult = render(
    <counterStoreWithParams.Provider>
      <AppWithParams />
    </counterStoreWithParams.Provider>
  );

  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.getByText('10')).toBeTruthy();
  fireEvent.click(renderResult.getByText('Increment'));
  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.queryByText('11')).toBeTruthy();
});

test('use with deps', () => {
  const renderResult = render(
    <counterStore.Provider>
      <AppWithDeps />
    </counterStore.Provider>
  );

  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.getByText('0')).toBeTruthy();
  fireEvent.click(renderResult.getByText('Decrement'));
  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.queryByText('0')).toBeTruthy();
});

test('connect', () => {
  const renderResult = render(
    <counterStore.Provider>
      <ConnectedApp />
    </counterStore.Provider>
  );

  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.getByText('0')).toBeTruthy();
});

test('Provider', () => {
  const renderResult = render(
    <Provider stores={[counterStore]}>
      <App />
    </Provider>
  );

  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.getByText('0')).toBeTruthy();
  fireEvent.click(renderResult.getByText('Decrement'));
  expect(renderResult.asFragment()).toMatchSnapshot();
  expect(renderResult.queryByText('-1')).toBeTruthy();
});
