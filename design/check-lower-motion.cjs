const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let carousel = true, position = 100, target, shift;
const clicks = {};
const cards = Array.from({length: 4}, (_, i) => ({offsetLeft: i * 300}));
const steps = {querySelectorAll: () => cards, scrollBy: options => {shift = options.left;}};
const process = {getBoundingClientRect: () => ({top: 100 - position})};
const context = {
  document: {
    documentElement: {classList: {contains: () => carousel}},
    getElementById: id => id === 'proceso' ? process : steps,
    querySelectorAll: () => [-1, 1].map(direction => ({dataset: {direction}, addEventListener: (_, fn) => {clicks[direction] = fn;}}))
  },
  matchMedia: () => ({matches: false}),
  getComputedStyle: () => ({getPropertyValue: () => '600'}),
  window: {__lenis: {scrollTo: y => {target = y;}}},
  get scrollY() {return position;}
};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../lower-motion.js'), 'utf8'), context);
clicks[1](); assert.equal(target, 300, 'next advances one panel');
clicks[-1](); assert.equal(target, 100, 'previous clamps at the first panel');
position = 700; clicks[1](); assert.equal(target, 700, 'next clamps at the fourth and final stage');
position = 500; clicks[-1](); assert.equal(target, 300, 'previous moves back one panel');
carousel = false; clicks[1](); assert.equal(shift, 300, 'mobile advances the snap strip');
clicks[-1](); assert.equal(shift, -300, 'mobile can move back');
console.log('Carousel controls: advance, reverse, bounds and mobile strip OK');

const front = context.window.YneraCameraPose(0);
assert.equal(front.y, 0); assert(front.z === 0); assert(front.turn === 0); assert.equal(front.opacity, 1);
const halfway = context.window.YneraCameraPose(.5);
assert(halfway.z < 0 && halfway.z > -340, 'transition recedes gently');
assert(halfway.opacity > .7, 'mid-transition remains readable');
const far = context.window.YneraCameraPose(8);
assert.equal(far.z, -340); assert.equal(far.turn, -18, 'rotation is bounded');
assert.equal(context.window.YneraCameraPose(-8).turn, 18, 'reverse travel is symmetric');
console.log('Camera: frontal reading stop, readable transition and bounded depth/rotation OK');
