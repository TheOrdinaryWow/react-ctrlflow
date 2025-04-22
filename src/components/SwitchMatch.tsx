import { Children, Fragment, type ReactElement, type ReactNode, cloneElement, isValidElement } from "react";

type SwitchProps = {
  /**
   * @deprecated Use `Fallback` instead.
   * This prop is retained for backward compatibility, and will be removed in a future version.
   *
   * The fallback element to render if `when` is falsy.
   */
  fallback?: ReactElement;
  /**
   * The children of the `Switch` component. Should be `Match` and `Fallback` components.
   */
  children: ReactNode;
};

type MatchProps<T> = {
  /**
   * The condition to match on. If this is truthy, the `children` will be rendered.
   */
  when: NonNullable<T> | undefined | null | false;
  /**
   * Whether or not to use a key when rendering the `children`. This is useful when the `when` prop is an object.
   */
  keyed?: boolean;
  /**
   * The content to render if the `when` prop is truthy. Can be a ReactNode or a function that returns a ReactNode.
   */
  children: ReactNode | ((item: T) => ReactNode);
};

type FallbackProps = {
  /**
   * The content to render if no `Match` components match.
   */
  children: ReactNode;
};

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
export function Switch({ fallback, children }: SwitchProps): ReactNode {
  const matchElements: {
    when: unknown;
    element: ReactElement<MatchProps<unknown> & { __ignoreContext?: boolean }>;
  }[] = [];

  let fallbackElement: ReactElement | undefined;

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Match) {
        const when = (child.props as MatchProps<unknown>).when;
        matchElements.push({
          when,
          element: child as ReactElement<MatchProps<unknown> & { __ignoreContext?: boolean }>,
        });
      } else if (child.type === Fallback) {
        fallbackElement = child;
      }
    }
  });

  const firstMatch = matchElements.find((match) => Boolean(match.when));

  if (firstMatch) {
    const { element } = firstMatch;
    return cloneElement(element, {
      __ignoreContext: true,
      ...(element.props as object),
    });
  }

  return fallbackElement || fallback || null;
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
}: MatchProps<T> & { __ignoreContext?: boolean }): ReactNode | null {
  if (__ignoreContext || when) {
    if (typeof children === "function") {
      const renderFn = children as (item: T) => ReactNode;

      if (keyed && when) {
        const key = typeof when === "object" && when !== null ? JSON.stringify(when) : String(when);
        return <Fragment key={key}>{renderFn(when as T)}</Fragment>;
      }

      return <>{when ? renderFn(when as T) : null}</>;
    }

    return children;
  }

  return null;
}

/**
 * Fallback content to display when no Match condition is true inside a `<Switch>`
 *
 * @example
 * ```tsx
 * <Fallback>
 *   <FourOhFour />
 * </Fallback>
 * ```
 */
export function Fallback({ children }: FallbackProps): ReactNode {
  return children;
}
