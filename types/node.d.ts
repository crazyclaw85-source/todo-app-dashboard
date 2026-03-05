declare module 'path' {
  export * from 'path/posix';
}
declare module 'fs' {
  export * from 'fs';
}
declare const process: {
  cwd(): string;
  env: { [key: string]: string | undefined };
};