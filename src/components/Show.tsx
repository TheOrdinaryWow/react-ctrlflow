import { Fragment, type ReactElement, type ReactNode } from "react";

/**
 * Props for the Show component.
 */
type ShowProps<T> = {
  /**
   * The value to check for truthiness. If truthy, the `children` will be rendered.
   */
  when: NonNullable<T> | undefined | null | false;
  /**
   * Whether to use a key based on the `when` prop. If true, the component will be recreated when `when` changes.
   */
  keyed?: boolean;
  /**
   * The fallback element to render if `when` is falsy.
   */
  fallback?: ReactElement;
  /**
   * The children to render if `when` is truthy. Can be a ReactNode or a function that returns a ReactNode.
   * If it's a function, it will be passed the `when` value as an argument.
   */
  children: ReactNode | ((item: T) => ReactNode);
};

/**
 * Conditionally render its children or an optional fallback component
 *
 * @example
 * ```tsx
 * // Simple usage
 * <Show when={isLoggedIn} fallback={<LoginScreen />}>
 *   <Dashboard />
 * </Show>
 *
 * // With function children (non-keyed)
 * <Show when={user} fallback={<LoginScreen />}>
 *   {(user) => <Dashboard user={user} />}
 * </Show>
 *
 * // With keyed rendering - will recreate component when "when" reference changes
 * <Show when={selectedItem} keyed={true} fallback={<NoSelection />}>
 *   {(item) => <ItemDetails item={item} />}
 * </Show>
 * ```
 */
export function Show<T>({ when, keyed = false, fallback, children }: ShowProps<T>): ReactNode {
  if (!when) return fallback || null;

  const value = when as NonNullable<T>;

  if (typeof children === "function") {
    const childrenFn = children as (item: NonNullable<T>) => ReactNode;

    if (keyed) {
      const key = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);
      return <Fragment key={key}>{childrenFn(value)}</Fragment>;
    }

    return childrenFn(value);
  }

  return children;
}
