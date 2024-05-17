import { type MutableRefObject, useCallback, useRef, useState } from "react";

export const useRefCallback = <T>(): [
  MutableRefObject<T | null>,
  (node: MutableRefObject<T>["current"]) => void,
] => {
  const [_, setReady] = useState(false);

  const ref = useRef<T | null>(null);
  const setRef = useCallback((node: MutableRefObject<T>["current"]) => {
    setReady(!!node);

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [ref, setRef];
};
