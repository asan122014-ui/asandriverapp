export function tripCompletion(students, total = students.length) {
  const count = Math.max(students.length, Number(total) || 0);
  if (!count) return 0;
  const steps = students.reduce((sum, { status }) => sum + (
    ["dropped", "dropped_off", "absent"].includes(status) ? 2 :
      ["onboard", "picked_up"].includes(status) ? 1 : 0
  ), 0);
  return Math.min(100, steps / (count * 2) * 100);
}

export const turnDelta = (from, to) => ((to - from + 540) % 360) - 180;
const metersPerDegree = 111320;
export function metersBetween(a, b) {
  const x = (b.lng - a.lng) * Math.cos((a.lat + b.lat) * Math.PI / 360);
  return Math.hypot(b.lat - a.lat, x) * metersPerDegree;
}

// Project only onto a nearby road. Never hide a genuine off-route position.
export function projectOnRoute(point, route, maxDistance = 35) {
  let closest = null;
  const scale = Math.cos(point.lat * Math.PI / 180);
  for (let index = 0; index < route.length - 1; index++) {
    const a = route[index], b = route[index + 1];
    const dx = (b.lng - a.lng) * scale, dy = b.lat - a.lat;
    const length = dx * dx + dy * dy;
    if (!length) continue;
    const fraction = Math.max(0, Math.min(1, ((point.lng - a.lng) * scale * dx + (point.lat - a.lat) * dy) / length));
    const projected = { lat: a.lat + (b.lat - a.lat) * fraction, lng: a.lng + (b.lng - a.lng) * fraction };
    const distance = metersBetween(point, projected);
    if (!closest || distance < closest.distance) closest = { point: projected, distance, index, fraction };
  }
  return closest && closest.distance <= maxDistance ? closest : null;
}

export function motionPath(from, to, route) {
  const start = projectOnRoute(from, route), end = projectOnRoute(to, route);
  if (!start || !end) return [from, to];
  const forward = start.index + start.fraction <= end.index + end.fraction;
  const corners = forward ? route.slice(start.index + 1, end.index + 1) : route.slice(end.index + 1, start.index + 1).reverse();
  const path = [start.point, ...corners, end.point];
  const length = path.slice(1).reduce((sum, point, index) => sum + metersBetween(path[index], point), 0);
  return length <= Math.max(100, metersBetween(from, to) * 3) ? path : [from, to];
}

export function pointAlongPath(path, fraction) {
  const lengths = path.slice(1).map((point, index) => metersBetween(path[index], point));
  let remaining = lengths.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, fraction));
  for (let index = 0; index < lengths.length; index++) {
    if (remaining <= lengths[index] && lengths[index] > 0) {
      const t = remaining / lengths[index];
      return { lat: path[index].lat + (path[index + 1].lat - path[index].lat) * t, lng: path[index].lng + (path[index + 1].lng - path[index].lng) * t };
    }
    remaining -= lengths[index];
  }
  return path.at(-1);
}
