import { stringify } from 'qs';
import axios from 'common/utils/http';

let regions = [];

export function getRegionsAsyncByLoacale() {
  if (!regions || !regions.length) {
    const getRegions = () => import('./fakeRegionsData');
    regions = getRegions().default;
  }

  return regions;
}

export default async function getRegionsData(params) {
  function fakeAsyncGet(fn, ms) {
    return new Promise((fn) => {
      const timerId = setTimeout(() => {
        clearTimeout(timerId);
        return fn(getRegionsAsyncByLoacale());
      }, ms);
    });
  }

  return Promise.race([axios.get(`/api/region/getAll?${stringify(params)}`), fakeAsyncGet(100)]);
}


/**
 * filterRegionsByStr
 * @param  {Array}  [area=regions] [description]
 * @param  {String} str            [description]
 * @param  {Array}  [values=[]]    [description]
 * @return {Array}                 [description]
 * @example
 *  getRegionsCodeArrByStr(regions, ["北京", "县", "密云"])  // ["11", "1102", "110228"]
 */
export const getRegionsCodeByStr = function filterRegionsByStr(area = regions, str, values = []) {
  const areaCodes = Array.isArray(str) ? str : str.split(/\s/);
  const key = areaCodes[0];

  if (!area || !area.length || !str.length) return values;

  for (let i = 0, l = area.length; i < l; i++) {
    const { label, value, children } = area[i];
    if (label && key && key === label) {
      values.push(value);
      areaCodes.shift();
      return getRegionsCodeByStr(children, areaCodes, values);
    }
  }
};


/**
 * filterRegionsByCode
 * @param  {Array}  [area=regions] [description]
 * @param  {String} str            [description]
 * @param  {Array}  [values=[]]    [description]
 * @return {Array}
 * @example
 *  getRegionsStrs(regions, '110228')   // ["北京", "县", "密云"]
 */
export const getRegionsStrByCode = function filterRegionsByCode(area = regions, str, values = []) {
  const areaCodes = Array.isArray(str) ? str : [str.slice(0, 2), str.slice(0, 4), str];
  const key = areaCodes[0];
  // const provinceCode = str.slice(0, 2);
  // const districtCode = str.slice(2, 4);
  // const townCode = str.slice(4, 6);
  // const areaCodes = [provinceCode, districtCode, townCode];
 if (!area || !area.length || !str.length) return values;

 for (let i = 0, l = area.length; i < l; i++) {
   const { label, value, children } = area[i];
   if (value && key && key === value) {
     values.push(label);
     areaCodes.shift();
     return getRegionsStrByCode(children, areaCodes, values);
   }
 }
};
