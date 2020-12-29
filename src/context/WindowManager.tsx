import {
  createContext,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { useEvents, Events } from "../hooks";
import { Window } from "../components";

export type WindowConfig = {
  id: string;
  sourceRef: React.RefObject<HTMLElement>;
};

export type WindowEventHandlers = {
  onRequestClose?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
};

type WindowManagerState = {
  registerWindow: (window: WindowConfig) => void;
  openWindow: (id: string) => void;
  subscribe: Events<WindowEvent>["subscribe"];
};

export enum WindowState {
  OPEN,
  CLOSING,
  CLOSED,
}

type WindowEvent = {
  type: WindowState;
  id: string;
};

type WindowMap = {
  [id: string]: React.RefObject<HTMLElement>;
};

interface WindowManagerProps {
  onRequestClose: (id: string) => void;
  onDestroy: (id: string) => void;
}

type WindowManagerRef = {
  open: (config: WindowConfig, cb?: () => void) => void;
};

export const WindowManagerContext = createContext({} as WindowManagerState);

export const WindowManagerProvider: React.FC = ({ children }) => {
  const sourceRefs = useRef<WindowMap>({});
  const windowManagerRef = useRef<WindowManagerRef>(null);

  const { send, subscribe } = useEvents<WindowEvent>();

  const registerWindow = useCallback(({ id, sourceRef }: WindowConfig) => {
    sourceRefs.current[id] = sourceRef;
  }, []);

  const openWindow = useCallback(
    (id: string) => {
      if (sourceRefs.current[id]) {
        windowManagerRef.current?.open(
          { id, sourceRef: sourceRefs.current[id] },
          () => send({ type: WindowState.OPEN, id: id })
        );
      }
    },
    [send]
  );

  const requestClose = (id: string) => send({ type: WindowState.CLOSING, id });
  const destroy = (id: string) => send({ type: WindowState.CLOSED, id });

  const state = useMemo(
    () => ({
      subscribe,
      openWindow,
      registerWindow,
    }),
    [subscribe, openWindow, registerWindow]
  );

  return (
    <WindowManagerContext.Provider value={state}>
      {children}
      <WindowManager
        ref={windowManagerRef}
        onRequestClose={requestClose}
        onDestroy={destroy}
      />
    </WindowManagerContext.Provider>
  );
};

const WindowManager = forwardRef<WindowManagerRef, WindowManagerProps>(
  ({ onRequestClose, onDestroy }, ref) => {
    const [openWindows, setOpenWindows] = useState<WindowConfig[]>([]);

    useImperativeHandle(ref, () => ({
      open: (w, cb) => {
        if (!openWindows.find(({ id }) => id === w.id)) {
          setOpenWindows((prev) => [...prev, w]);
          requestAnimationFrame(() => cb?.());
        }
      },
    }));

    const handleOnDestroy = (id: string) => {
      onDestroy(id);
      requestAnimationFrame(() => {
        setOpenWindows((prev) => prev.filter((w) => w.id !== id));
      });
    };

    return (
      <div className="absolute-fill pointer-none">
        {openWindows.map(({ id, sourceRef }) => (
          <Window
            key={id}
            id={id}
            sourceRef={sourceRef}
            onRequestClose={() => onRequestClose(id)}
            destroyWindow={() => handleOnDestroy(id)}
          />
        ))}
      </div>
    );
  }
);
