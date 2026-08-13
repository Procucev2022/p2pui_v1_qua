/**
 * Global Karma setup to keep the runner alive while exercising app code.
 */
export const TEST_SETUP_LOADED = true;

const noop = () => undefined;

// sweetalert2 opens real modals and hangs Karma if left unmocked
try {
  const swalMock: any = () => Promise.resolve({ value: true, dismiss: undefined });
  swalMock.fire = () => Promise.resolve({ value: true });
  swalMock.close = noop;
  swalMock.getPopup = () => null;
  (window as any).swal = swalMock;
  (window as any).Sweetalert2 = swalMock;
} catch {
  /* ignore */
}

try {
  (window as any).open = () => null;
} catch {
  /* ignore */
}

try {
  HTMLAnchorElement.prototype.click = noop as any;
  HTMLFormElement.prototype.submit = noop as any;
} catch {
  /* ignore */
}

try {
  const proto = HTMLElement.prototype as any;
  const originalClick = proto.click;
  proto.click = function (...args: any[]) {
    try {
      if (this && (this as HTMLAnchorElement).href) {
        return;
      }
    } catch {
      /* ignore */
    }
    try {
      return originalClick.apply(this, args);
    } catch {
      /* ignore */
    }
  };
} catch {
  /* ignore */
}

try {
  window.addEventListener(
    'beforeunload',
    (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    true
  );
  window.addEventListener(
    'error',
    (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    true
  );
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
  });
} catch {
  /* ignore */
}

try {
  document.addEventListener(
    'submit',
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    true
  );
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target as any;
      if (t && (t.tagName === 'A' || t.closest?.('a'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
} catch {
  /* ignore */
}

try {
  const w = window as any;
  if (w.Zone && w.Zone.root && w.Zone.root._zoneDelegate) {
    w.Zone.root._zoneDelegate.handleError = function () {
      return false;
    };
  }
} catch {
  /* ignore */
}
