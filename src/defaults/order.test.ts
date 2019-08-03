import order from './order';

describe('default order', () => {
  it('can be loaded', () => {
    expect(order).toMatchInlineSnapshot(`
      Array [
        "name",
        "version",
        "description",
        "license",
        "private",
        "engines",
        "os",
        "cpu",
        "repository",
        "bugs",
        "homepage",
        "author",
        "contributors",
        "keywords",
        "bin",
        "man",
        "main",
        "module",
        "browser",
        "files",
        "directories",
        "workspaces",
        "config",
        "publishConfig",
        "scripts",
        "husky",
        "lint-staged",
        "...rest",
        "dependencies",
        "peerDependencies",
        "devDependencies",
        "optionalDependencies",
        "bundledDependencies",
      ]
    `);
  });

  it('has a `...rest` key', () => {
    expect(order.indexOf('...rest')).not.toEqual(-1);
  });
});
