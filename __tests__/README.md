# Functional tests

Tests in this directory are for more functional checks.

## `Fixtures`

In addition to any additional functional tests that could be added here, there is also a special directory called [`fixtures`](fixtures) where a `JSON` file can be dropped and automatically run through the `format-package` CLI to verify the output.

To add a new test, just create a new `JSON` file in the `fixtures` directory and run `yarn test --watch`. A snapshot will automatically be created for each fixture file found and any changes in output will cause the tests to fail until their snapshots are updated (`yarn test -u`).

In addition, custom `.spec.js` files can be added here and will be run as part of the test suite.
