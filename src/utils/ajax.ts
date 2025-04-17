import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';
axios.defaults.withCredentials = false;
const instance = axios.create({
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.request?.requestURL.startsWith('https://api.weixin.qq.com')) {
      return Promise.resolve(response.data || response);
    }
    // eslint-disable-next-line eqeqeq
    if (response.data.status != 0) {
      message.error(response.data.info || response.data.message);
      return Promise.reject(response.data);
    }
    return Promise.resolve(response.data || response);
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default class Fetch {
  options: any;
  constructor(options = {}) {
    this.options = options;
  }
  request(options: any): Promise<any> {
    return instance.request(options);
  }

  get(url: string, data: any, options = {}) {
    return this.request({
      url,
      params: { ...data, stamp: Date.now() },
      ...options,
    });
  }

  post(url: string, data: any, options = {}) {
    return this.request({
      method: 'post',
      url,
      data,
      ...options,
    });
  }

  put(url: string, data: any, options = {}) {
    return this.request({
      method: 'put',
      url,
      data,
      ...options,
    });
  }

  del(url: string, options = {}) {
    return this.request({
      method: 'delete',
      url,
      params: {
        ...options,
      },
    });
  }

  blobGet(url: string, data: any, options = {}) {
    return this.request({
      url,
      params: { ...data, stamp: Date.now() },
      responseType: 'blob',
      ...options,
    });
  }
}
const fetch = new Fetch();
export const request = fetch.request.bind(fetch);
export const get = fetch.get.bind(fetch);
export const post = fetch.post.bind(fetch);
export const put = fetch.put.bind(fetch);
export const del = fetch.del.bind(fetch);
export const blobGet = fetch.blobGet.bind(fetch);
