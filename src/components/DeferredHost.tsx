'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Host = dynamic(() => import('./Host'), {
  ssr: false,
  loading: () => null,
});

class HostCrashGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    // Keep a nonessential assistant failure from taking down the main site.
    console.error('RIYA assistant failed to render:', error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Keep the optional, feature-rich assistant off the critical hydration path. */
export default function DeferredHost() {
  const pathname = usePathname() || '/';
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    let cancelled = false;
    let timeout = 0;
    const mount = () => {
      if (!cancelled) setReady(true);
    };
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(mount, { timeout: 1800 })
      : null;
    // Ensure it still appears in browsers without requestIdleCallback.
    timeout = window.setTimeout(mount, 2200);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      if (idleId !== null) idleWindow.cancelIdleCallback?.(idleId);
    };
  }, [pathname]);

  return ready && !pathname.startsWith('/admin') ? (
    <HostCrashGuard><Host /></HostCrashGuard>
  ) : null;
}
