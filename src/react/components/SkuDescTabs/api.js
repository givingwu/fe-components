import http from 'utils/http';
// import { delay, random } from 'feewee/utils';
import { H5_SERIES_INFO } from 'utils/api';

export const getSeriesInfo = function(params) {
  return /* delay(FAKE_FLASH_SALE) ||  */http.get(H5_SERIES_INFO, { params })
};
