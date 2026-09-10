"use client";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** SSR-safe "has this component mounted on the client" check, without setState-in-effect. */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
