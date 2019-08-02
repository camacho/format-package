import { transformations, order, formatter } from './';

describe('defaults', () => {
  it('exposes a transformations object', () => {
    expect(transformations).toBeDefined();
  });

  it('exposes an order array', () => {
    expect(order).toBeDefined();
    expect(order).toBeInstanceOf(Array);
  });

  it('exposes a formatter function', () => {
    expect(formatter).toBeDefined();
    expect(formatter).toBeInstanceOf(Function);
  });
});
