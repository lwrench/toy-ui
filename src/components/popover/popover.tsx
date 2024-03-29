import * as React from 'react';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useClickOutside } from './hooks/useClickOutside';
import { Position, Rect } from './types';

const defaultRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

const PopoverContext = React.createContext<{
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  preferredPosition: Position;
  triggerRect: Rect;
  setTriggerRect: React.Dispatch<React.SetStateAction<Rect>>;
}>({
  isShow: false,
  setIsShow: () => {
    throw new Error('PopoverContext setIsShow should be used under provider');
  },
  preferredPosition: 'bottom-center',
  triggerRect: defaultRect,
  setTriggerRect: () => {
    throw new Error('PopoverContext setTriggerRect should be used under provider');
  },
});

export default function Popover({
  children,
  preferredPosition = 'bottom-center',
}: {
  children: React.ReactNode;
  preferredPosition: Position;
}) {
  const [isShow, setIsShow] = useState(false);
  const [triggerRect, setTriggerRect] = useState(defaultRect);

  const contextValue = {
    isShow,
    setIsShow,
    preferredPosition,
    triggerRect,
    setTriggerRect,
  };

  return <PopoverContext.Provider value={contextValue}>{children}</PopoverContext.Provider>;
}

function Trigger({ children }: { children: React.ReactElement }) {
  const { setIsShow, setTriggerRect } = useContext(PopoverContext);

  const ref = useRef<HTMLElement>(null);

  const onClick = (e: MouseEvent) => {
    const element = ref.current;
    if (element == null) {
      return;
    }

    const rect = element.getBoundingClientRect();
    setTriggerRect(rect);
    setIsShow((isShow) => !isShow);
  };

  const childrenToTriggerPopover = React.cloneElement(children, {
    onClick, // TODO: we better merge the onClick
    ref, // TODO: we better merge the ref
  });

  return childrenToTriggerPopover;
}

function Content({ children }: { children: React.ReactNode }) {
  const { isShow } = useContext(PopoverContext);

  if (!isShow) {
    return null;
  }

  return <ContentInternal>{children}</ContentInternal>;
}

function ContentInternal({ children }: { children: React.ReactNode }) {
  const { triggerRect, preferredPosition, setIsShow } = useContext(PopoverContext);
  const ref = useRef<HTMLDialogElement>(null);
  const [coords, setCoords] = useState({
    left: 0,
    top: 0,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (element == null) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const coords = getPopoverCoords(triggerRect, rect, preferredPosition);
    setCoords(coords);
  }, []);

  const refFocusTrapping = useFocusTrapping();

  const dismiss = useCallback(() => {
    setIsShow(false);
  }, []);
  const refClickOutside = useClickOutside(dismiss);

  const mergedRef = mergeRef([ref, refFocusTrapping, refClickOutside]);
  return (
    <dialog
      open={true}
      ref={mergedRef}
      style={{
        position: 'fixed',
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        margin: 0,
      }}
    >
      {children}
    </dialog>
  );
}

function Close({ children }: { children: React.ReactElement }) {
  const { setIsShow } = useContext(PopoverContext);
  const onClick = (e: MouseEvent) => {
    setIsShow(false);

    // popover will be gone
    // prevent this event triggering unexpected click
    e.stopPropagation();
  };
  const childrenToClosePopover = React.cloneElement(children, {
    onClick, // TODO: we better merge the onClick
  });

  return childrenToClosePopover;
}

Popover.Trigger = Trigger;
Popover.Content = Content;
Popover.Close = Close;

function getPopoverCoords(triggerRect: Rect, popoverRect: Rect, position: Position) {
  switch (position) {
    case 'bottom-center':
    default:
      // TODO: cover all positions
      let top = triggerRect.top + triggerRect.height + 10;
      let left = Math.max(triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2, 10);

      // failover to top if there is not enough space
      if (top + popoverRect.height > window.innerHeight - 10) {
        top = triggerRect.top - 10 - popoverRect.height;
      }
      return {
        top,
        left,
      };
  }
}

// TODO: better focusable query
const focusableQuery = ':is(input, button, [tab-index]';

// some hooks
function useFocusTrapping() {
  // @ts-ignore TODO: fix the typings
  const refTrigger = useRef<HTMLElement>(document.activeElement);
  const ref = useRef<HTMLElement>(null);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const popover = ref.current;
    if (popover == null) {
      return;
    }
    const focusables = [...popover.querySelectorAll(focusableQuery)];

    switch (e.key) {
      case 'Tab':
        // check if it is the last focusable
        const lastFocusable = focusables[focusables.length - 1];
        if (document.activeElement === lastFocusable) {
          // @ts-ignore, TODO: fix typing
          focusables[0]?.focus();

          e.preventDefault();
        }
    }
  }, []);

  useEffect(() => {
    const popover = ref.current;
    if (popover == null) {
      return;
    }

    const focusables = [...popover.querySelectorAll(focusableQuery)];
    // 1. focus the first focusable
    // @ts-ignore, TODO: fix typing
    focusables[0]?.focus();
    console.log('mount popover focusing', focusables[0]);

    // 2. attach keyboard event listener to trap the focus
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);

      // 3. refocus the trigger after dismissing
      // but only if the current activeElement is body
      // since this happens after popover is gone
      // TODO: am I right about this?
      const trigger = refTrigger.current;
      const currentActiveElement = document.activeElement;
      if (currentActiveElement == document.body) {
        trigger?.focus();
      }
    };
  }, []);

  return ref;
}

// function mergeRef<T = any>(...refs: Array<React.MutableRefObject<T>>): React.RefCallback<T> {
//   return (el) => {
//     refs.forEach((ref) => {
//       if (typeof ref === 'function') {
//         ref(el);
//       } else if (ref !== null) {
//         (ref as React.MutableRefObject<T | null>).current = el;
//       }
//     });
//   };
// }

function mergeRef<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
