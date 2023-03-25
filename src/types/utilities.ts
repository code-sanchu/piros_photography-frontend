export type MyPick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};

export type MyOmit<T, K extends keyof T> = HandleEmptyObject<
  Pick<T, Exclude<keyof T, K>>
>;

type HandleEmptyObject<T> = T extends Record<string, never> ? void : T;
