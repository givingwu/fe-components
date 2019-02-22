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

const getLocationByGeo = () => {
  if (!window.BMap) {
    throw new Error('BMap is not an Object.');
  }

  return new Promise((resolve, reject) => {
    const geoLocation = new window.BMap.Geolocation();

    geoLocation.enableSDKLocation();
    geoLocation.getCurrentPosition(function getCurrPos(r) {
      if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
        resolve(r);
      } else {
        reject();
      }
    });
  });
};

const getLocationByIP = () => {
  if (!window.BMap) {
    throw new Error('BMap is not an Object.');
  }

  return new Promise((resolve) => {
    const localCity = new window.BMap.LocalCity();
    localCity.get((r) => {
      resolve(r);
    });
  });
};

export const getLocation = async () => {
  let location = null;

  try {
    location = await getLocationByGeo();
  } catch (e) {
    location = await getLocationByIP();
  }

  if (!location) {
    throw new Error('`getLocation()` From map.js error occurred.')
  } else {
    return location;
  }
};

// 加载百度 api 的 js 文件
export const loadBMapAPI = async () => {
  const BMapURI = 'https://api.map.baidu.com/api?v=2.0&ak=71vwhDVH0K9gfrx2qL3NSdR9Pq3lxbEF&callback=initializeApp';
  let timer = null;

  function check(resolve, reject) {
    if (typeof window.BMap === 'object' && Object.keys(window.BMap).length >= 5) {
      resolve();
    } else {
      clearTimeout(timer);
      timer = setTimeout(check.bind(null, resolve, reject), 300);
    }
  }

  await loadScript(BMapURI);

  return new Promise((resolve, reject) => {
    check(resolve, reject);
  });
};
