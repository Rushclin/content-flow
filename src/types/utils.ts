import React from "react";

/**
 * Extract props from a component
 */
export type ExtractProps<T> = T extends React.ComponentType<infer P>
  ? P
  : T extends React.Component<infer P>
  ? P
  : never;

/**
 * Make some properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make some properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Override properties in type T with properties in type U
 */
export type Override<T, U> = Omit<T, keyof U> & U;
