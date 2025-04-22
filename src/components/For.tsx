import { Fragment, type ReactElement, type ReactNode } from "react";

import { generateStableKey } from "../lib/utils";

export type ForProps<T extends readonly unknown[], U extends ReactNode> = {
  each: NonNullable<T> | undefined | null | false;
  fallback?: ReactElement;
  getKey?: (item: T[number], index: number) => string | number;
  children: (item: T[number], index: number) => U;
};

/**
 * Creates a list elements from a list
 *
 * @example
 * ```tsx
 * <For each={items} fallback={<div>No items</div>}>
 *   {(item, index) => <div key={index}>{item}</div>}
 * </For>
 * ```
 */
export function For<T extends readonly unknown[], U extends ReactNode>({
  each,
  fallback,
  getKey,
  children,
}: ForProps<T, U>): ReactNode {
  if (!each || each.length === 0) {
    return fallback || null;
  }

  return each.map((item, index) => {
    const key = getKey ? getKey(item, index) : generateStableKey(item, index);
    return <Fragment key={key}>{children(item, index)}</Fragment>;
  });
}
