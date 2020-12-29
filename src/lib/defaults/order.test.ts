import * as schema from '../../../tests/2020-12-29-package.schema.json';
import * as order from './order.json';

describe('default order', () => {
  it('can be loaded', () => {
    expect(order).toMatchInlineSnapshot(`
      Array [
        "$schema",
        "name",
        "version",
        "description",
        "license",
        "licenses",
        "private",
        "engines",
        "engineStrict",
        "os",
        "cpu",
        "repository",
        "bugs",
        "homepage",
        "author",
        "contributors",
        "maintainers",
        "dist",
        "readme",
        "keywords",
        "bin",
        "preferGlobal",
        "man",
        "main",
        "esnext",
        "module",
        "exports",
        "type",
        "types",
        "typings",
        "typesVersions",
        "browser",
        "files",
        "directories",
        "workspaces",
        "jspm",
        "config",
        "publishConfig",
        "scripts",
        "husky",
        "lint-staged",
        "...rest",
        "dependencies",
        "peerDependencies",
        "peerDependenciesMeta",
        "devDependencies",
        "optionalDependencies",
        "bundledDependencies",
        "bundleDependencies",
        "resolutions",
      ]
    `);
  });

  it(`should reference each schema property`, () => {
    const properties = Object.keys(schema.properties);
    properties.forEach((property) => {
      expect(order).toContain(property);
    });
  });

  it('has a `...rest` key', () => {
    expect(order.indexOf('...rest')).not.toEqual(-1);
  });
});
