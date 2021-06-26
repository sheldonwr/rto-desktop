export function interval(fn, wait) {
  let timeout;
  let isPaused = false;
  let wrapFn = function() {
    fn();
    isPaused = false;
    if (timeout != null) {
      timeout = setTimeout(() => {
        wrapFn();
      }, wait);
    }
  };
  wrapFn.clear = function() {
    clearTimeout(timeout);
    timeout = null;
    isPaused = true;
  };
  wrapFn.isPaused = function() {
    return isPaused;
  }
  timeout = setTimeout(() => {
    wrapFn();
  }, wait);
  return wrapFn;
}