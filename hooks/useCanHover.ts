'use client';

import { useSyncExternalStore } from 'react';

/**
 * `true` só em ponteiros que realmente têm hover (mouse/trackpad).
 * Em touch o iOS/Android emula `mouseenter` no toque e o hover fica "grudado" —
 * por isso qualquer interação baseada em hover precisa ser gated por isso.
 * Snapshot do servidor é `true` para o SSR sair já no layout de desktop.
 */
const QUERY = '(hover: hover)';

const subscribe = (callback: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => true;

export function useCanHover() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
