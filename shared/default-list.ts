export const EMPTY_0 = [] as const;
export const EMPTY_1 = [undefined] as const;
export const EMPTY_2 = [...EMPTY_1, undefined] as const;
export const EMPTY_3 = [...EMPTY_2, undefined] as const;
export const EMPTY_4 = [...EMPTY_3, undefined] as const;
export const EMPTY_5 = [...EMPTY_4, undefined] as const;
export const EMPTY_6 = [...EMPTY_5, undefined] as const;
export const EMPTY_7 = [...EMPTY_6, undefined] as const;
export const EMPTY_8 = [...EMPTY_7, undefined] as const;
export const EMPTY_9 = [...EMPTY_8, undefined] as const;
export const EMPTY_10 = [...EMPTY_9, undefined] as const;
export const EMPTY_15 = [...EMPTY_10, ...EMPTY_5] as const;
export const EMPTY_16 = [...EMPTY_15, undefined] as const;
export const EMPTY_20 = [...EMPTY_10, ...EMPTY_10] as const;
export const EMPTY_25 = [...EMPTY_20, ...EMPTY_5] as const;
export const EMPTY_30 = [...EMPTY_20, ...EMPTY_10] as const;
export const EMPTY_32 = [...EMPTY_16, ...EMPTY_16] as const;

// large power of 2s
export const EMPTY_64 = [...EMPTY_32, ...EMPTY_32] as const;
export const EMPTY_128 = [...EMPTY_64, ...EMPTY_64] as const;
export const EMPTY_256 = [...EMPTY_128, ...EMPTY_128] as const;
