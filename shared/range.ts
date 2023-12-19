export class Range {
  private readonly _start: number;
  private readonly _end: number;
  private readonly _empty: boolean;

  private constructor(start: number, end: number) {
    const empty = end < start;
    this._start = empty ? 0 : start;
    this._end = empty ? -1 : end;
    this._empty = empty;
  }

  static from = (
    range: { start: number } & ({ end: number } | { length: number })
  ): Range => {
    if ("length" in range && "end" in range) {
      throw new Error("end and length are exclusive options, use only one");
    }

    let end = "end" in range ? range.end : range.start + range.length - 1;

    return new Range(range.start, end);
  };

  get empty() {
    return this._empty;
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  copy = (): Range => new Range(this.start, this.end);

  intersect = (other: Range): Range => {
    if (
      this.empty ||
      other.empty ||
      this.end < other.start ||
      other.end < this.start
    ) {
      return new Range(0, -1);
    }

    return new Range(
      Math.max(this.start, other.start),
      Math.min(this.end, other.end)
    );
  };

  offset = (by: number): Range => new Range(this.start + by, this.end + by);

  /**
   * Performs the following operation on two ranges: `result = this - subtrahend`
   *
   * Can optionally provide an existing result of `this.intersect(subtrahend)` if
   * available to skip intersection calculation.
   *
   * Cases:
   *   1. no overlap, return a
   *   2. a is around b, two ranges are returned from left and right of
   *      intersection: a.start to intersection.start - 1, intersection.end + 1
   *      to a.end
   *   3. a is fully surrounded by b, return no ranges
   *   4. b overlaps partially with right of a, return range that is a.start to
   *      intersection.start - 1
   *   5. b overlaps partially with left of a, return range that is
   *      intersection.end + 1 to a.end
   */
  subtract = (subtrahend: Range, intersectionCache?: Range): Range[] => {
    const intersection = intersectionCache ?? this.intersect(subtrahend);

    if (intersection.empty) {
      return [this.copy()];
    }

    return [
      new Range(this.start, intersection.start - 1),
      new Range(intersection.end + 1, this.end),
    ].filter((r) => !r.empty);
  };
}
