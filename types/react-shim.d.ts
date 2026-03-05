declare module 'react' {
  export function useState<T>(initialState: T): [T, (newState: T) => void];
  export function useEffect(effect: () => void, deps?: any[]): void;
  export function useCallback<T extends Function>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue?: T): { current: T };
  export function useId(): string;
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export const Fragment: any;
  export function forwardRef<T extends Function>(render: T): T;
}
declare module 'react/jsx-runtime' {
  export const Fragment: any;
}
declare module 'path' {
  export function join(...paths: string[]): string;
}
declare module 'fs' {
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
}