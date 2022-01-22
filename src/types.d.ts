export type Json =
  | string
  | number
  | boolean
  | null
  | Partial<{ [key: string]: Json }>
  | Json[];

export type Order = [string, ...string[]];

export interface Transformation {
  (key: string, prevValue: Json): [typeof key, Json];
}

export type Transformations = {
  [key: string]: Transformation;
};

export interface Formatter {
  (Json, string?): Promise<string>;
}

export type Config = {
  order?: Order;
  transformations?: Transformations;
  formatter?: Formatter;
};

export type LogError =
  | string
  | (Error & {
      stderr?: string;
      stdout?: string;
      code?: number;
    })
  | { stderr?: string; stdout?: string; code?: number };
