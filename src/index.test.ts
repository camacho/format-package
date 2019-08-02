const mockSort = jest.fn(keys => keys);
const mockTransform = jest.fn((k, v) => [k, v]);
const mockValidate = jest.fn();

jest.mock('./sort', () => mockSort);
jest.mock('./transform', () => mockTransform);
jest.mock('./validate', () => mockValidate);

import * as defaults from './defaults';
import sort from './sort';
import transform from './transform';
import validate from './validate';
import * as format from './';

console.log(sort);

describe('format', () => {
  beforeEach(() => {
    mockSort.mockClear();
    mockTransform.mockClear();
    mockValidate.mockClear();
  });

  it('has defaults', () => {
    expect(format.defaults).toMatchObject({
      order: expect.any(Array),
      transformations: expect.any(Object),
      formatter: expect.any(Function),
    });
  });

  it.only('sorts the package', async () => {
    expect.assertions(1);

    const pkg = { name: 'test' };

    await format(pkg);
    expect(sort).toHaveBeenCalledWith(['name'], defaults.order);
  });

  it('transforms the package', async () => {
    expect.assertions(1);
    const pkg = { name: 'test' };

    await format(pkg);

    expect(transform).toHaveBeenCalledWith(
      'name',
      'test',
      defaults.transformations
    );
  });

  it('validates the package', async () => {
    const pkg = { name: 'test', foo: 'bar' };
    await format(pkg);

    expect(validate).toHaveBeenCalledWith(pkg, pkg);
  });

  it('formats the output', () => {
    const pkg = { name: 'test', foo: 'bar' };

    return expect(format(pkg)).resolves.toMatchInlineSnapshot(`
              "{
                \\"name\\": \\"test\\",
                \\"foo\\": \\"bar\\"
              }
              "
            `);
  });

  it('takes options', async () => {
    expect.assertions(4);

    const pkg = { name: 'test' };
    const options = {
      formatter: jest.fn(o => JSON.stringify(o)),
      order: ['...rest', 'name'],
      transformations: {
        name: (key, value) => [key, value.toUpperCase()],
      },
    };

    const result = await format(pkg, options);

    expect(result).toMatchInlineSnapshot(`"{\\"name\\":\\"test\\"}"`);
    expect(sort).toHaveBeenCalledWith(expect.any(Array), options.order);
    expect(transform).toHaveBeenCalledWith(
      'name',
      'test',
      options.transformations
    );

    expect(options.formatter).toHaveBeenCalled();
  });
});
