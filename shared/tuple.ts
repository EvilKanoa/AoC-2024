// small tuple types
export type Tuple<T> = [T, T];
export type Tuple2<T> = Tuple<T>;
export type Tuple3<T> = [...Tuple2<T>, T];
export type Tuple4<T> = [...Tuple3<T>, T];
export type Tuple5<T> = [...Tuple4<T>, T];
export type Tuple6<T> = [...Tuple5<T>, T];
export type Tuple7<T> = [...Tuple6<T>, T];
export type Tuple8<T> = [...Tuple7<T>, T];
export type Tuple9<T> = [...Tuple8<T>, T];
export type Tuple10<T> = [...Tuple9<T>, T];

// larger types added as needed
export type Tuple16<T> = [...Tuple8<T>, ...Tuple8<T>];
export type Tuple32<T> = [...Tuple16<T>, ...Tuple16<T>];
export type Tuple64<T> = [...Tuple32<T>, ...Tuple32<T>];
export type Tuple128<T> = [...Tuple64<T>, ...Tuple64<T>];
export type Tuple256<T> = [...Tuple128<T>, ...Tuple128<T>];