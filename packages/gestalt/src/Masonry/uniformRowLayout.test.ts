import { DEFAULT_LAYOUT_DEFAULT_GUTTER } from './getColumnCount';
import uniformRowLayout from './uniformRowLayout';

const stubCache = (
  measurements: {
    [item: string]: number;
  } = {},
) => {
  let cache = measurements;

  return {
    get(item: string) {
      return cache[item];
    },
    has(item: string) {
      return !!cache[item];
    },
    set(item: string, value: number) {
      cache[item] = value;
    },
    reset() {
      cache = {};
    },
  };
};

describe.each([false, true])('Uniform Row layout tests', (flexible) => {
  test('empty', () => {
    const layout = uniformRowLayout({
      cache: stubCache(),
      gutter: 0,
      width: 500,
    });

    expect(layout([])).toEqual([]);
  });

  test('one row, equal heights', () => {
    const layout = uniformRowLayout({
      cache: stubCache({
        a: 100,
        b: 100,
        c: 100,
      }),
      flexible,
      gutter: DEFAULT_LAYOUT_DEFAULT_GUTTER,
      minCols: 2,
      width: 900,
    });

    const expectedPositions = flexible
      ? [
          { top: 0, left: 0, width: 286, height: 100 },
          { top: 0, left: 300, width: 286, height: 100 },
          { top: 0, left: 600, width: 286, height: 100 },
        ]
      : [
          { top: 0, left: 0, width: 236, height: 100 },
          { top: 0, left: 250, width: 236, height: 100 },
          { top: 0, left: 500, width: 236, height: 100 },
        ];

    expect(layout(['a', 'b', 'c'])).toEqual(expectedPositions);
  });

  test('one column, equal heights', () => {
    const layout = uniformRowLayout({
      cache: stubCache({
        a: 100,
        b: 100,
        c: 100,
      }),
      flexible,
      gutter: DEFAULT_LAYOUT_DEFAULT_GUTTER,
      width: 250,
      minCols: 1,
    });

    expect(layout(['a', 'b', 'c'])).toEqual([
      { top: 0, left: 0, width: 236, height: 100 },
      { top: 114, left: 0, width: 236, height: 100 },
      { top: 228, left: 0, width: 236, height: 100 },
    ]);
  });

  test('one row, unequal heights', () => {
    const layout = uniformRowLayout({
      cache: stubCache({
        a: 100,
        b: 120,
        c: 100,
      }),
      flexible,
      gutter: DEFAULT_LAYOUT_DEFAULT_GUTTER,
      minCols: 2,
      width: 900,
    });

    const expectedPositions = flexible
      ? [
          { top: 0, left: 0, width: 286, height: 100 },
          { top: 0, left: 300, width: 286, height: 120 },
          { top: 0, left: 600, width: 286, height: 100 },
        ]
      : [
          { top: 0, left: 0, width: 236, height: 100 },
          { top: 0, left: 250, width: 236, height: 120 },
          { top: 0, left: 500, width: 236, height: 100 },
        ];

    expect(layout(['a', 'b', 'c'])).toEqual(expectedPositions);
  });

  test('multiple rows, unequal heights', () => {
    const layout = uniformRowLayout({
      cache: stubCache({
        a: 100,
        b: 120,
        c: 100,
        d: 100,
      }),
      flexible,
      gutter: DEFAULT_LAYOUT_DEFAULT_GUTTER,
      width: 800,
    });

    const expectedPositions = flexible
      ? [
          { top: 0, left: 0, width: 252, height: 100 },
          { top: 0, left: 266, width: 252, height: 120 },
          { top: 0, left: 532, width: 252, height: 100 },
          { top: 134, left: 0, width: 252, height: 100 },
        ]
      : [
          { top: 0, left: 0, width: 236, height: 100 },
          { top: 0, left: 250, width: 236, height: 120 },
          { top: 0, left: 500, width: 236, height: 100 },
          { top: 134, left: 0, width: 236, height: 100 },
        ];

    expect(layout(['a', 'b', 'c', 'd'])).toEqual(expectedPositions);
  });
});
