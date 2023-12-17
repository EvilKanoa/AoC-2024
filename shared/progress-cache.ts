import { file } from "bun";

interface CacheEntry<V, R> {
  complete: boolean;
  value: V;
  result?: R;
}

export class ProgressCache<K extends string, V, R> {
  private _filename: string;
  private _cache: Record<K, CacheEntry<V, R>> = {} as Record<K, CacheEntry<V, R>>;
  private _flushOnChange: boolean;

  constructor(filename: string, flushOnChange = false, autoRead = true) {
    this._filename = filename;
    this._flushOnChange = flushOnChange;

    if (autoRead) {
      this.readCache().catch((err) => {
        console.error(`Failed to read progress cache (${this._filename}) from disk!`, err)
      });
    }
  }

  get incompleteValues(): V[] {
    return Object.values<CacheEntry<V, R>>(this._cache).filter(({ complete }) => !complete).map(({ value }) => value);
  }

  get isComplete(): boolean {
    return !Object.values<CacheEntry<V, R>>(this._cache).some(({ complete }) => !complete);
  }

  get completeResults(): R[] {
    return Object.values<CacheEntry<V, R>>(this._cache).filter(({ complete }) => complete).map(({ result }) => result!);
  }

  get allEntries(): CacheEntry<V, R>[] {
    return Object.values(this._cache);
  }

  get progressString(): string {
    return `${this.incompleteValues.length} of ${this.allEntries.length} remaining...`;
  }

  readCache = async (overrideNew = false): Promise<void> => {
    const newEntries = this._cache;
    const cacheFile = file(this._filename);

    if (await cacheFile.exists()) {
      this._cache = await file(this._filename).json();
    } else {
      this._cache = {} as Record<K, CacheEntry<V, R>>;
    }

    if (!overrideNew) {
      this._cache = { ...this._cache, ...newEntries }
    }
  }

  flush = async () => {
    try {
      await Bun.write(this._filename, JSON.stringify(this._cache, null, 2))
    } catch (err) {
      console.error(`Failed to flush progress cache (${this._filename}) to disk!`, err)
    }
  }

  setProgress = (key: K, value: V, complete = false, result?: R) => {
    this._cache[key] = { value, complete }

    if (complete) {
      this._cache[key].result = result;
    }

    if (this._flushOnChange) {
      this.flush();
    }
  }

  addItem = (key: K, value: V) => {
    this._cache[key] = { complete: false, value };

    if (this._flushOnChange) {
      this.flush();
    }
  }

  addMany = (items: [K, V][], overwriteExisting = false) => {
    items.forEach(([key, value]) => {
      if (overwriteExisting || this._cache[key] == null) {
        this._cache[key] = { complete: false, value };
      }
    })

    if (this._flushOnChange) {
      this.flush();
    }
  }

  setResult = (key: K, result: R) => {
    const entry = this._cache[key];

    if (entry == null) {
      throw new Error("Cannot set result for non-existing entry!");
    }

    entry.complete = true;
    entry.result = result;

    if (this._flushOnChange) {
      this.flush();
    }
  }
}