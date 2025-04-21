import { Fragment, type JSX, type ReactNode, useMemo } from "react";

export type ForProps<T extends readonly unknown[], U extends JSX.Element> = {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
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
export function For<T extends readonly unknown[], U extends JSX.Element>({
  each,
  fallback,
  getKey,
  children,
}: ForProps<T, U>): ReactNode {
  return useMemo(() => {
    if (!each || each.length === 0) {
      return fallback || null;
    }

    return each.map((item, index) => {
      const key = getKey ? getKey(item, index) : generateStableKey(item, index);
      return <Fragment key={key}>{children(item, index)}</Fragment>;
    });
  }, [each, fallback, getKey, children]);
}
