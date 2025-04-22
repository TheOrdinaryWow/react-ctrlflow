# React CtrlFlow (Control Flow)

I'm just simply sick of all the ternary expressions and logical operators, so I ported some common control flows from [SolidJS](https://www.solidjs.com/docs/latest/api#control-flow).

Create pull requests if you find any issues or have suggestions to improve the library.

## Installation

```bash
npm install react-ctrlflow
# or
yarn add react-ctrlflow
# or
pnpm add react-ctrlflow
# or
bun add react-ctrlflow
```

## Components

### &lt;For&gt;

```tsx
import { For } from 'react-ctrlflow';

type ForProps<T extends readonly unknown[], U extends ReactElement> = {
  each: T | undefined | null | false;
  fallback?: ReactElement;
  getKey?: (item: T[number], index: number) => string | number;
  children: (item: T[number], index: number) => U;
};

function For<T extends readonly unknown[], U extends ReactElement>({ each, fallback, getKey, children }: ForProps<T, U>): ReactNode;
```

An easy way to iterate over a list of items.

The callback takes the current item as the first argument:

```tsx
<For each={state.list} fallback={<div>Loading...</div>}>
  {(item) => <div>{item}</div>}
</For>
```

The optional second argument is an index signal:

```tsx
<For each={state.list} fallback={<div>Loading...</div>}>
  {(item, index) => <div>#{index} {item}</div>}
</For>
```

### &lt;Show&gt;

```tsx
type ShowProps<T> = {
  when: NonNullable<T> | undefined | null | false;
  keyed?: boolean;
  fallback?: ReactNode;
  children: ReactNode | ((item: T) => ReactNode);
};

function Show<T>({ when, keyed = false, fallback, children }: ShowProps<T>): ReactNode;
````

The Show control flow is used to conditional render part of the view: it renders `children` when the `when` is truthy, an `fallback` otherwise. It is similar to the ternary operator (`when ? children : fallback`) but is ideal for templating JSX.

```tsx
<Show when={state.count > 0} fallback={<div>Loading...</div>}>
  <div>My Content</div>
</Show>
```

Show can also be used as a way of keying blocks to a specific data model. Ex the function is re-executed whenever the user model is replaced.

```tsx
<Show when={state.user} fallback={<div>Loading...</div>} keyed>
  {(user) => <div>{user.firstName}</div>}
</Show>
```

### &lt;Switch&gt;/&lt;Match&gt;

Used to match multiple conditions and render the first matching component. This will return the first matching component.

```tsx
import { Switch, Match } from 'react-ctrlflow';

type MatchProps<T> = {
  when: T | undefined | null | false;
  keyed?: boolean;
  children: ReactNode | ((item: T) => ReactNode);
};

function Switch({ fallback, children }: { fallback?: ReactNode; children: ReactNode; }): ReactNode;

function Match<T>({ when, keyed = false, children, __ignoreContext = false }: MatchProps<T> & { __ignoreContext?: boolean }): ReactNode | null
```

Useful for when there are more than 2 mutual exclusive conditions. For example, it can be used to perform basic routing:

```tsx
<Switch fallback={<div>Not Found</div>}>
  <Match when={state.route === "home"}>
    <Home />
  </Match>
  <Match when={state.route === "settings"}>
    <Settings />
  </Match>
</Switch>
```

Match also supports function children to serve as keyed flow.

## Compare to SolidJS

This library aims to allow React developers to use a declarative control flow syntax similar to SolidJS, but please note:

1. There are fundamental differences between the reactive models of React and SolidJS.
2. These components are wrappers for React and will not provide the performance advantages of SolidJS.
3. Some behaviors may be slightly different because they are implemented in React.

## Acknowledgements

- [solid](https://github.com/solidjs/solid)

## License

[MIT](LICENSE) © [TheOrdinaryWow](https://github.com/TheOrdinaryWow)
