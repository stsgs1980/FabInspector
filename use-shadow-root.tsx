import { useRef, useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { inspectorCss } from './inspector-styles';

/**
 * Returns a portal that renders children inside a shadow root
 * with isolated CSS styles (prevents Tailwind conflicts).
 */
export function useShadowRoot(children: ReactNode): ReactNode {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;

    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = inspectorCss;
    shadow.appendChild(style);

    const reset = document.createElement('style');
    reset.textContent = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
button,select,input,textarea{font:inherit;color:inherit;background:none;border:none}
button{cursor:pointer}`;
    shadow.appendChild(reset);

    const container = document.createElement('div');
    shadow.appendChild(container);

    // Trigger re-render so createPortal has a valid target
    setReady(true);
  }, []);

  const hostStyle = { position: 'fixed' as const, inset: '0', width: '100vw', height: '100vh', pointerEvents: 'none' as const, zIndex: '2147483647' };

  if (!ready || !hostRef.current?.shadowRoot) {
    return <div ref={hostRef} style={hostStyle} />;
  }

  const container = hostRef.current.shadowRoot.lastElementChild as HTMLElement;
  return (
    <>
      <div ref={hostRef} style={hostStyle} />
      {createPortal(children, container)}
    </>
  );
}

/**
 * Checks whether a click event originated from inside the inspector shadow root.
 * Works across shadow DOM boundaries using `composedPath()`.
 */
export function isClickInsideInspector(e: MouseEvent): boolean {
  const path = e.composedPath();
  return path.some((el) => {
    if (el instanceof HTMLElement && el.shadowRoot) return true;
    if (el instanceof HTMLElement && el.getAttribute('data-se-fab') !== null) return true;
    return false;
  });
}
