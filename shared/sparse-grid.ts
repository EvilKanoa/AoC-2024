/**
 * Represents a coordinate pair as an x, y string.
 */
export type GridKey = `${number},${number}`;

/**
 * Extents given in [[xMin, xMax], [yMin, yMax]]
 */
export type Extents = [[number, number], [number, number]];

/**
 * Used to generate a value when an empty grid cell is accessed.
 * Can optionally accept the x and y coordinates of the cell.
 */
export type DefaultFn<T> = (x: number, y: number, self: SparseGrid<T>) => T;

export type ValueToStringFn<T> = (value: T) => string;

export interface GridCell<T> {
  value: T;
  x: number;
  y: number;
}

const k = (x: number, y: number): GridKey => `${x},${y}`;

export class SparseGrid<T> {
  static fromLines = <T>(
    lines: string[],
    charParser: (char: string) => T,
    defaultValurOrFactory: T | DefaultFn<T>,
    valueToStringFn?: ValueToStringFn<T>,
    toStringPadding?: number
  ): SparseGrid<T> => {
    const grid = new SparseGrid<T>(
      defaultValurOrFactory,
      valueToStringFn,
      toStringPadding
    );

    lines.forEach((line, y) =>
      [...line].forEach((c, x) => {
        grid.set(x, y, charParser(c));
      })
    );

    return grid;
  };

  private _default: (x: number, y: number) => T;
  private _valueToString: ValueToStringFn<T>;
  private _toStringPadding: number;
  private _map = new Map<GridKey, GridCell<T>>();
  private _extents0Cache: Extents | null = null;

  constructor(
    defaultValueOrFactory: T | DefaultFn<T>,
    valueToStringFn: ValueToStringFn<T> = (value) => `${value}`,
    toStringPadding = 1
  ) {
    this._valueToString = valueToStringFn;
    this._toStringPadding = toStringPadding;

    if (typeof defaultValueOrFactory === "function") {
      this._default = (x, y) =>
        (defaultValueOrFactory as DefaultFn<T>)(x, y, this);
    } else {
      this._default = () => defaultValueOrFactory;
    }
  }

  set = (x: number, y: number, value: T) => {
    this._map.set(k(x, y), { value, x, y });

    // invalidate extents cache if needed
    if (
      this._extents0Cache != null &&
      (x < this._extents0Cache[0][0] ||
        x > this._extents0Cache[0][1] ||
        y < this._extents0Cache[1][0] ||
        y > this._extents0Cache[1][1])
    ) {
      this._extents0Cache = null;
    }

    return this;
  };

  update = (x: number, y: number, updater: (prev: T) => T) => {
    const prev = this.get(x, y);
    this.set(x, y, updater(prev));
    return this;
  };

  get = (x: number, y: number): T => {
    const key = k(x, y);
    if (this._map.has(key)) {
      return this._map.get(key)!.value;
    }

    return this._default(x, y);
  };

  has = (x: number, y: number): boolean => {
    return this._map.has(k(x, y));
  };

  remove = (x: number, y: number): T => {
    const key = k(x, y);
    const value = this._map.has(key)
      ? this._map.get(key)!.value
      : this._default(x, y);

    this._map.delete(key);
    this._extents0Cache = null;

    return value;
  };

  clear = (): void => {
    this._map.clear();
    this._extents0Cache = null;
  };

  /**
   * Extents given in [[xMin, xMax], [yMin, yMax]]
   */
  extents = (padding = 0): Extents => {
    if (padding === 0 && this._extents0Cache != null) {
      return this._extents0Cache;
    }

    const extents = [
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    ] as Extents;
    this.eachSparse((x, y) =>
      [x, y].forEach((c, idx) => {
        extents[idx][0] = Math.min(c, extents[idx][0]);
        extents[idx][1] = Math.max(c, extents[idx][1]);
      })
    );
    extents.forEach((extent) => {
      extent[0] = extent[0] - padding;
      extent[1] = extent[1] + padding;
    });

    if (padding === 0) {
      this._extents0Cache = extents;
    }

    return extents;
  };

  size = () => this._map.size;

  eachSparse = (cb: (x: number, y: number, value: T) => void) => {
    for (let [_, { value, x, y }] of this._map) {
      cb(x, y, value);
    }
  };

  eachCell = (
    cb: (x: number, y: number, value: T) => void,
    padding: number = 0
  ) => {
    const extents = this.extents(padding);

    for (let y = extents[1][0]; y <= extents[1][1]; y++) {
      for (let x = extents[0][0]; x <= extents[0][1]; x++) {
        cb(x, y, this.get(x, y));
      }
    }
  };

  anyCell = (test: (x: number, y: number, value: T) => boolean): boolean => {
    const extents = this.extents();

    for (let y = extents[1][0]; y <= extents[1][1]; y++) {
      for (let x = extents[0][0]; x <= extents[0][1]; x++) {
        if (test(x, y, this.get(x, y))) {
          return true;
        }
      }
    }

    return false;
  };

  sparseCells = (): GridCell<T>[] => [...this._map.values()];

  allCells = (padding = 0): GridCell<T>[] => {
    const cells = [] as GridCell<T>[];
    this.eachCell((x, y, value) => cells.push({ x, y, value }), padding);
    return cells;
  };

  /** sparse */
  columnCells = (x: number): GridCell<T>[] =>
    [...this._map.values()].filter((cell) => cell.x === x);

  /** sparse */
  rowCells = (y: number): GridCell<T>[] =>
    [...this._map.values()].filter((cell) => cell.y === y);

  pushX = (fromX: number, amount: number): void => {
    this.sparseCells()
      .filter(({ x }) => (amount > 0 ? x >= fromX : x <= fromX))
      .forEach((cell) => {
        this.remove(cell.x, cell.y);
        this.set(cell.x + amount, cell.y, cell.value);
      });
  };

  pushY = (fromY: number, amount: number): void => {
    this.sparseCells()
      .filter(({ y }) => (amount > 0 ? y >= fromY : y <= fromY))
      .forEach((cell) => {
        this.remove(cell.x, cell.y);
        this.set(cell.x, cell.y + amount, cell.value);
      });
  };

  adjacent = (
    checkX: number,
    checkY: number,
    dist = 1,
    diagonal = true
  ): GridCell<T>[] => {
    const cells = [] as GridCell<T>[];
    for (let y = checkY - dist; y <= checkY + dist; y++) {
      for (let x = checkX - dist; x <= checkX + dist; x++) {
        if (
          (x === checkX && y === checkY) ||
          (!diagonal &&
            (x === checkX - dist || x === checkX + dist) &&
            (y === checkY - dist || y === checkY + dist))
        ) {
          continue;
        }
        cells.push({ x, y, value: this.get(x, y) });
      }
    }
    return cells;
  };

  pop = (): GridCell<T> => {
    const next = this._map.values().next().value;
    if (next == null) {
      throw new Error("Cannot pop from empty grid!");
    }

    this.remove(next.x, next.y);

    return next;
  };

  peek = (): GridCell<T> | null => {
    return this._map.values().next().value ?? null;
  };

  popBy = (valueFn: (item: T) => number): GridCell<T> => {
    if (this.size() === 0) {
      throw new Error("Cannot pop from empty grid!");
    }

    const cell = this.sparseCells().reduce<[GridCell<T> | undefined, number]>(
      (acc, cell) => {
        const cellValue = valueFn(cell.value);
        if (cellValue >= acc[1]) {
          return [cell, cellValue];
        }

        return acc;
      },
      [undefined, Number.MIN_SAFE_INTEGER]
    )[0]!;

    this.remove(cell.x, cell.y);

    return cell;
  };

  clone = (): SparseGrid<T> => {
    const clone = new SparseGrid(
      this._default,
      this._valueToString,
      this._toStringPadding
    );

    if (this._extents0Cache) {
      clone._extents0Cache = [...this._extents0Cache];
    }

    this.sparseCells().forEach((cell) => clone.set(cell.x, cell.y, cell.value));

    return clone;
  };

  toString = (padding = this._toStringPadding) => {
    const cells = [this._valueToString(this._default(0, 0))] as string[];
    const extents = this.extents(padding);

    this.eachSparse((_x, _y, value) => cells.push(this._valueToString(value)));
    const cellWidth = Math.max(...cells.map((c) => c.length));

    let str = "";

    for (let y = extents[1][0]; y <= extents[1][1]; y++) {
      for (let x = extents[0][0]; x <= extents[0][1]; x++) {
        str += this._valueToString(this.get(x, y)).padEnd(cellWidth, " ");
      }

      if (y !== extents[1][1]) {
        str += "\n";
      }
    }

    return str;
  };

  equals = (other: SparseGrid<T>, ignoreDifferingDefaults = false): boolean => {
    // unless ignoring, default values need to equal
    if (
      !ignoreDifferingDefaults &&
      this._default(0, 0) !== other._default(0, 0)
    ) {
      return false;
    }

    // must have equal extents to be equal
    const extentsA = this.extents();
    const extentsB = other.extents();
    if (
      extentsA[0][0] !== extentsB[0][0] ||
      extentsA[0][1] !== extentsB[0][1] ||
      extentsA[1][0] !== extentsB[1][0] ||
      extentsA[1][1] !== extentsB[1][1]
    ) {
      return false;
    }

    const otherMap = new Map(other._map);
    for (const aCell of this.sparseCells()) {
      const key = k(aCell.x, aCell.y);
      if (!otherMap.has(key) || otherMap.get(key)!.value !== aCell.value) {
        return false;
      }

      otherMap.delete(key);
    }

    return otherMap.size === 0;
  };
}
