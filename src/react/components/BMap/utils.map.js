import { loadScript } from './utils';

// 浏览器定位
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
    localCity.get((r) => { resolve(r); });
  });
};

export const getLocation = async () => {
  try {
    const r = await getLocationByGeo();
    return Promise.resolve(r);
  } catch (e) {
    const r = await getLocationByIP();
    return Promise.resolve(r);
  }
};

// 加载百度api的js文件
export const loadBMapAPI = async () => {
  const BMapURI = 'http://api.map.baidu.com/api?v=2.0&ak=71vwhDVH0K9gfrx2qL3NSdR9Pq3lxbEF&callback=initializeApp';
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