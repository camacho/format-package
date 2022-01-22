import { Transformations, PackageJson } from '../types';

// All transformers receive:
//   * the key they matched on
//   * the value in package.PackageJson (if any)
//
// Return a new key and value to be stored
export default async function transform(
  prevKey: string,
  prevValue: PackageJson,
  transformations: Transformations
): Promise<[string, PackageJson]> {
  // If there are no transformations, use the default transform
  const transformation = transformations[prevKey] || transformations['*'];
  return transformation(prevKey, prevValue);
}
