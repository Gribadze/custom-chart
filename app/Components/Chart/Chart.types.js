// @flow
export type CategoryType = { [category: string]: number } | number[];
export type DataType =
  | { [key: string]: CategoryType }
  | { [key: string]: number[] }
  | CategoryType[]
  | number[][];
