export type StorageType = "localStorage" | "sessionStorage" | "cookie";

export interface PersistOptions {
  key: string;
  storage: StorageType;
  cookieOptions?: {
    expires?: number;    // days
    path?: string;
    secure?: boolean;
  };
}

export type ActionResult<S> = Partial<S> | Promise<Partial<S>>;
export type Actions<S> = Record<string, (state: S, ...args: any[]) => ActionResult<S>>;

export interface ActionState {
  loading: boolean;
  error: Error | null;
}

export type ActionLoadingState<A extends Actions<any>> = {
  [K in keyof A]: ActionState;
};

export interface StoreState<S, A extends Actions<S>> {
  loading: boolean;
  error: Error | null;
  actions: ActionLoadingState<A>;
  reset: (field?: keyof S | Array<keyof S>) => void;
}

export type StoreFullState<S, A extends Actions<S>> = S & {
  [K in keyof A]: (...args: Parameters<A[K]> extends [any, ...infer P] ? P : []) => Promise<void>;
} & StoreState<S, A>;

export type Listener<S> = (state: S) => void;

export type Middleware = (store: any) => (next: any) => (action: string, nextState: any) => void;
