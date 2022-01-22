export type PackageJson =
  | string
  | number
  | boolean
  | null
  | Partial<{ [key: string]: PackageJson }>
  | PackageJson[];

export type Order = [string, ...string[]];

export interface Transformation {
  (key: string, prevValue: PackageJson): [typeof key, PackageJson];
}

export type Transformations = {
  [key: string]: Transformation;
};

export interface Formatter {
  (PackageJson, string?): Promise<string>;
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
