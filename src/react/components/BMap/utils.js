export function loadScript(url) {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.body.appendChild(script);

  return new Promise((resolve) => {
    if (script.readyState) { // IE
      script.onreadystatechange = function change() {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          resolve();
        }
      };
    } else { // Others
      script.onload = function load() {
        resolve();
      };
    }
  });
}

export const geneBMapPoint = (point) => {
  if (point && point.lat && point.lng) {
    return new window.BMap.Point(point.lat, point.lng);
  }

  return null;
};

/**
* 给某个对象绑定对应需要的事件
* @param 需要绑定事件的对象
* @param 事件名数组
* @return null;
*/
export function bindEvent(obj, events) {
  const self = this;

  if (events) {
    events.forEach((event) => {
      obj.addEventListener(event, function applyEvent() {
        self.props.events && self.props.events[event] && self.props.events[event].apply(self, arguments);
      });
    });
  }
}

/**
* 给某个对象绑定需要切换的属性对应的方法
* @param 需要绑定属性的对象
* @param 属性和对应的2个切换方法
* @return null;
*/
export function bindToggleMethods(obj, toggleMethods) {
  for (let key in toggleMethods) {
    if (this.props[key] !== undefined) {
      if (this.props[key]) {
        obj[toggleMethods[key][0]]();
      } else {
        obj[toggleMethods[key][1]]();
      }
    }
  }
}

export function getOptions(options) {
  let result = {};

  options.map((key) => {
    if (this.props[key] !== undefined) {
      result[key] = this.props[key];
    }
  });

  return result;
}
