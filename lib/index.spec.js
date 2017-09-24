jest.mock('./sort', () => jest.fn(keys => keys));
jest.mock('./transform', () => jest.fn((k, v) => [k, v]));
jest.mock('./validate', () => jest.fn());

const defaults = require('./defaults');
const sort = require('./sort');
const transform = require('./transform');
const validate = require('./validate');

const format = require('./');

describe('format', () => {
  beforeEach(() => {
    sort.mockClear();
    transform.mockClear();
    validate.mockClear();
  });

  it('has defaults', () => {
    expect(format.defaults).toMatchObject({
      order: expect.any(Array),
      transformations: expect.any(Object),
      formatter: expect.any(Function),
    });
  });

  it('sorts the package', () => {
    const pkg = { name: 'test' };
    format(pkg);
    expect(sort).toHaveBeenCalledWith(['name'], defaults.order);
  });

  it('transforms the package', () => {
    const pkg = { name: 'test' };
    format(pkg);
    expect(transform).toHaveBeenCalledWith(
      'name',
      'test',
      defaults.transformations
    );
  });

  it('validates the package', () => {
    const pkg = { name: 'test', foo: 'bar' };
    format(pkg);
    expect(validate).toHaveBeenCalledWith(pkg, pkg);
  });

  it('formats the output', () => {
    const pkg = { name: 'test', foo: 'bar' };
    expect(format(pkg)).toMatchSnapshot();
  });

  it('takes options', () => {
    const pkg = { name: 'test' };
    const options = {
      formatter: jest.fn(o => JSON.stringify(o)),
      order: ['...rest', 'name'],
      transformations: {
        name: (key, value) => [key, value.toUpperCase()],
      },
    };

    expect(format(pkg, options)).toMatchSnapshot();
    expect(sort).toHaveBeenCalledWith(expect.any(Array), options.order);
    expect(transform).toHaveBeenCalledWith(
      'name',
      'test',
      options.transformations
    );
    expect(options.formatter).toHaveBeenCalled();
  });
});
