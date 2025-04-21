import { Fragment, type ReactNode } from "react";

type ShowProps<T> = {
  when: NonNullable<T> | undefined | null | false;
  keyed?: boolean;
  fallback?: ReactNode;
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
  if (when) {
    if (typeof children === "function") {
      const childrenFn = children as (item: T) => ReactNode;

      if (keyed) {
        const key = typeof when === "object" && when !== null ? JSON.stringify(when) : String(when);
        return <Fragment key={key}>{childrenFn(when as T)}</Fragment>;
      }

      return childrenFn(when as T);
    }

    return children;
  }

  return fallback || null;
}
