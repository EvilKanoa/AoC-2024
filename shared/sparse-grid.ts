/**
 * Represents a coordinate pair as an x, y string.
 */
export type GridKey = `${number},${number}`;

/**
 * Used to generate a value when an empty grid cell is accessed.
 * Can optionally accept the x and y coordinates of the cell.
 */
export type DefaultFn<T> = () => T;

export type ValueToStringFn<T> = (value: T) => string;

interface GridCell<T> {
  value: T;
  x: number;
  y: number;
}

const k = (x: number, y: number): GridKey => `${x},${y}`;

export class SparseGrid<T> {
  private _default: DefaultFn<T>;
  private _valueToString: ValueToStringFn<T>;
  private _toStringPadding: number;
  private _map = new Map<GridKey, GridCell<T>>();

  constructor(
    defaultValurOrFactory: T | (() => T),
    valueToStringFn: ValueToStringFn<T> = (value) => `${value}`,
    toStringPadding = 1
  ) {
    this._valueToString = valueToStringFn;
    this._toStringPadding = toStringPadding;

    if (typeof defaultValurOrFactory === "function") {
      this._default = defaultValurOrFactory as () => T;
    } else {
      this._default = () => defaultValurOrFactory;
    }
  }

  set = (x: number, y: number, value: T) => {
    this._map.set(k(x, y), { value, x, y });
    return this;
  };

  get = (x: number, y: number): T => {
    const key = k(x, y);
    if (this._map.has(key)) {
      return this._map.get(key)!.value;
    }

    return this._default();
  };

  has = (x: number, y: number): boolean => {
    return this._map.has(k(x, y));
  };

  remove = (x: number, y: number): T => {
    const key = k(x, y);
    const value = this._map.has(key)
      ? this._map.get(key)!.value
      : this._default();

    this._map.delete(key);

    return value;
  };

  extents = (padding = 0): [[number, number], [number, number]] => {
    const extents = [
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    ] as [[number, number], [number, number]];
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

    return extents;
  };

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

  toString = () => {
    const cells = [this._valueToString(this._default())] as string[];
    const extents = this.extents(this._toStringPadding);

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
}
