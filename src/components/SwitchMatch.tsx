import { Children, Fragment, type ReactElement, type ReactNode, cloneElement, isValidElement } from "react";

type MatchProps<T> = {
  when: T | undefined | null | false;
  keyed?: boolean;
  children: ReactNode | ((item: T) => ReactNode);
};

interface MatchElement extends ReactElement {
  props: MatchProps<unknown> & { __ignoreContext?: boolean };
  type: typeof Match;
}

/**
 * Switches between content based on mutually exclusive conditions
 *
 * @example
 * ```tsx
 * <Switch fallback={<FourOhFour />}>
 *   <Match when={state.route === 'home'}>
 *     <Home />
 *   </Match>
 *   <Match when={state.route === 'settings'}>
 *     <Settings />
 *   </Match>
 * </Switch>
 * ```
 */
export function Switch({
  fallback,
  children,
}: {
  fallback?: ReactNode;
  children: ReactNode;
}): ReactNode {
  const matchElements: Array<{
    when: unknown;
    element: ReactElement;
  }> = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Match) {
      const { when } = child.props;
      matchElements.push({ when, element: child });
    }
  });

  const firstMatch = matchElements.find((match) => Boolean(match.when));

  if (firstMatch) {
    const { element } = firstMatch;
    return cloneElement(element, {
      __ignoreContext: true,
      ...element.props,
    });
  }

  // If no match found, return fallback
  return fallback || null;
}

/**
 * Selects content based on condition when inside a `<Switch>` control flow
 *
 * React version of SolidJS's Match component
 *
 * @example
 * ```tsx
 * <Match when={condition}>
 *   <Content/>
 * </Match>
 *
 * <Match when={user} keyed={true}>
 *   {(user) => <UserProfile user={user} />}
 * </Match>
 * ```
 */
export function Match<T>({
  when,
  keyed = false,
  children,
  __ignoreContext = false,
}: MatchProps<T> & { __ignoreContext?: boolean }): ReactElement | null {
  if (__ignoreContext || when) {
    if (typeof children === "function") {
      const renderFn = children as (item: T) => ReactNode;

      if (keyed && when) {
        const key = typeof when === "object" && when !== null ? JSON.stringify(when) : String(when);
        return <Fragment key={key}>{renderFn(when as T)}</Fragment>;
      }

      return <>{when ? renderFn(when as T) : null}</>;
    }

    return <>{children}</>;
  }

  return null;
}
