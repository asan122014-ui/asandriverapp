import test from "node:test";
import assert from "node:assert/strict";
import { tripCompletion, turnDelta, projectOnRoute, motionPath, pointAlongPath } from "../src/utils/liveTripMotion.js";

test("each pickup and drop contributes one step of the full journey", () => {
  const progress = (...statuses) => tripCompletion(statuses.map((status) => ({ status })));
  assert.equal(progress("waiting", "waiting"), 0);
  assert.equal(progress("onboard", "waiting"), 25);
  assert.equal(progress("onboard", "onboard"), 50);
  assert.equal(progress("dropped", "onboard"), 75);
  assert.equal(progress("dropped", "dropped"), 100);
  assert.equal(progress("picked_up"), 50);
  assert.equal(progress("absent", "waiting"), 50);
  assert.equal(progress("absent", "onboard"), 75);
  assert.equal(progress("absent", "dropped"), 100);
  assert.equal(progress("absent", "absent"), 100);
  assert.equal(progress(), 0);
});

test("heading turns smoothly across north using the shortest arc", () => {
  assert.equal(turnDelta(359, 1), 2);
  assert.equal(turnDelta(1, 359), -2);
});

test("road projection rejects locations genuinely off the route", () => {
  const route = [{ lat: 17, lng: 78 }, { lat: 17, lng: 78.01 }];
  assert.equal(projectOnRoute({ lat: 17.0001, lng: 78.005 }, route).point.lat, 17);
  assert.equal(projectOnRoute({ lat: 17.01, lng: 78.005 }, route), null);
});

test("movement follows a bend instead of cutting across the road", () => {
  const route = [{ lat: 17, lng: 78 }, { lat: 17, lng: 78.001 }, { lat: 17.001, lng: 78.001 }];
  const path = motionPath(route[0], route[2], route);
  assert.deepEqual(path[1], route[1]);
  const position = pointAlongPath(path, 0.25);
  assert.equal(position.lat, 17);
  assert.deepEqual(pointAlongPath(path, 1), route[2]);
});
