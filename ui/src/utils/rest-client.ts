/* eslint-disable */
import axios, { AxiosInstance } from 'axios';

const getCSRFToken = () => {
  const metaTag = document.querySelector('meta[name=csrf-token]');
  return metaTag ? metaTag.getAttribute('content') : null;
};

const getCors = () => {
  const meta = window && window['layout_config'];
  return meta && meta['set_cors_header'];
};

const formData = (data: any) => {
  const fd = new FormData();
  for (const p in data) {
    if (data.hasOwnProperty(p) && !(data[p] === undefined || data[p] == null)) {
      if (data[p] instanceof FileList) {
        fd.append(p, data[p][0]);
      } else {
        fd.append(p, data[p]);
      }
    }
  }
  return fd;
};

export default class RestClient {
  private data: any;
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
      transformRequest: [
        (data, headers) => {
          if (headers['Content-Type'] === 'multipart/form-data') {
            return formData(data);
          } else {
            return JSON.stringify(data);
          }
        }
      ]
    });
  }

  public setAuthorization(token: string) {
    axios.defaults.headers.common['Authorization'] = token;
  }

  public get(...args: any[]) {
    return this.axios.request(this._get.apply(this, arguments));
  }

  public post(...args: any[]) {
    return this.axios.request(this._post.apply(this, arguments));
  }

  public put(...args: any[]) {
    return this.axios.request(this._put.apply(this, arguments));
  }

  private _get(path: string, params: any, headers = {}, baseUrl) {
    const config = {
      method: 'get',
      params,
      url: path,
      baseUrl,
      headers: {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    return config;
  }

  private _put(path: string, params: any, data = {}, headers = {}, baseUrl) {
    const csrfToken: string | null = getCSRFToken();
    if (
      headers['Content-Type'] === 'application/x-www-form-urlencoded' ||
      headers['Content-Type'] === 'multipart/form-data'
    ) {
      data['_csrf_token'] = csrfToken;
    }
    headers['cb-csrf-token'] = headers['_csrf_token'] = csrfToken;
    const config = {
      method: 'post',
      params,
      withCredentials: getCors(),
      data,
      url: path,
      baseUrl,
      headers: Object.assign(
        {
          ...headers,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        headers
      )
    };

    return config;
  }


  private _post(path: string, params: any, data = {}, headers = {}, baseUrl) {
    const csrfToken: string | null = getCSRFToken();
    if (
      headers['Content-Type'] === 'application/x-www-form-urlencoded' ||
      headers['Content-Type'] === 'multipart/form-data'
    ) {
      data['_csrf_token'] = csrfToken;
    }
    headers['cb-csrf-token'] = headers['_csrf_token'] = csrfToken;
    const config = {
      method: 'put',
      params,
      withCredentials: getCors(),
      data,
      url: path,
      baseUrl,
      headers: Object.assign(
        {
          ...headers,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        headers
      )
    };

    return config;
  }
}
