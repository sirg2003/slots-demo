// Basic lerp funtion.
function lerp(a1, a2, t) {
  return a1 * (1 - t) + a2 * t;
}
function getIsCenterSymbol() {
  var d = Math.random() * 100;
  if (d > 50) {
    return true;
  }
  return false;
}
const getTimestamp = () => Date.now();

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
  return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}

export { lerp, backout, getIsCenterSymbol, getTimestamp };
