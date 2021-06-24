/**
 * 去抖
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 */
export function debounce(func, wait, immediate = false) {
  var timeout, result;

  var debounced = function() {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

/**
 * 节流
 * @param {*} func
 * @param {*} wait
 * @param {*} options
 */
export function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options)
    options = {
      leading: false,
      trailing: true,
    };

  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };
  return throttled;
}

export function deepCopy(obj) {
  if (obj == null || typeof obj !== "object") return obj;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}

export function findComponentUpward(context, componentName) {
  let parent = context.$parent;
  let name = parent.$options.name;

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}

export function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}

export function getFileNameAndExt(fullpath) {
  let fileName = fullpath.replace(/^.*[\\\/]/, "");
  const _index = fileName.lastIndexOf(".");
  let ext = "";
  let name = "";
  if (_index > -1) {
    name = fileName.slice(0, _index);
    ext = fileName.slice(_index);
  }
  return { name, ext };
}

export function uniqueArray(array, cb) {
  if(cb) {
    let newArr = [];
    let cache = {};
    for(let i = 0; i < array.length; i++) {
      let key = cb(array[i])
      if(!cache[key]) {
        newArr.push(array[i])
      }
      cache[key] = true
    }
    return newArr;
  }else {
    return [...new Set(array)];
  }
}

/**
 * 用 setTimeout 模拟 setInterval
 * @param {*} fn
 * @param {*} wait
 */
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