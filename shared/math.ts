import _pointInPolygon from "robust-point-in-polygon";

export const pointInPolygon = _pointInPolygon;

export type Polygon =
  | [number, number][]
  | { vertices: [number, number][]; holes: [number, number][][] };

export const polygonArea = (polygon: Polygon): number => {
  const vertices = Array.isArray(polygon) ? polygon : polygon.vertices;

  let total = 0;

  for (let i = 0, l = vertices.length; i < l; i++) {
    const addX = vertices[i][0];
    const addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
    const subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
    const subY = vertices[i][1];

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  total = Math.abs(total);

  if (!Array.isArray(polygon)) {
    total -= polygon.holes.map(polygonArea).reduce(sum);
  }

  return total;
};

export const polygonPerimeter = (polygon: Polygon): number => {
  const vertices = Array.isArray(polygon) ? polygon : polygon.vertices;

  let total = 0;

  for (let i = 1, l = vertices.length; i < l; i++) {
    const dx = Math.abs(vertices[i][0] - vertices[i - 1][0]);
    const dy = Math.abs(vertices[i][1] - vertices[i - 1][1]);
    total += Math.sqrt(dx * dx + dy * dy);
  }

  if (!Array.isArray(polygon)) {
    total += polygon.holes.map(polygonPerimeter).reduce(sum);
  }

  return total;
};

export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

export const sum = (a: number, b: number): number => a + b;

export const multiply = (a: number, b: number): number => a * b;

export const modulo = (a: number, b: number): number => ((a % b) + b) % b;
