import { Fragment, type ReactElement, type ReactNode } from "react";

import { generateStableKey } from "../lib/utils";

/**
 * Props for the {@link For} component.
 */
export type ForProps<T extends readonly unknown[], U extends ReactNode> = {
  /**
   * The array to iterate over. If this is null, undefined, or an empty array, the fallback will be rendered.
   */
  each: NonNullable<T> | undefined | null | false;
  /**
   * A React element to render if the `each` array is empty.
   */
  fallback?: ReactElement;
  /**
   * A function that returns a unique key for each item in the array. If not provided, a stable key will be generated.
   */
  getKey?: (item: T[number], index: number) => string | number;
  /**
   * A function that renders a ReactNode for each item in the array.
   */
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
