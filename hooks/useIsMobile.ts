'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscreve a uma media query usando useSyncExternalStore — padrão canônico
 * em React 19 que evita o anti-pattern "setState dentro de useEffect" e
 * lida corretamente com SSR (snapshot do servidor é sempre `false`).
 */
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
