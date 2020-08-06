import React from 'react';
import ReactDOM from 'react-dom';

let mountContainer: HTMLDivElement;

export function render(el: React.ReactElement) {
  if (typeof window !== 'undefined') {
    mountContainer = mountContainer || window.document.createElement('div');
    ReactDOM.render(el, mountContainer);
  }
  return <template>{el}</template>;
}
