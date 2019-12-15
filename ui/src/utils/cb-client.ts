import RestClient from '@/utils/rest-client';
import CbError from '@/utils/cb-error';

function getEndpoint(action: any, params: any) {
  if (action.endpoint) {
    return action.endpoint;
  }
  if (action.endpointFn) {
    const sanitizedParams = Object.keys(params).reduce((o: any, param: any) => {
      if (params[param]) {
        o[param] = encodeURIComponent(params[param]);
      }
      return o;
    }, {});
    return action.endpointFn(sanitizedParams);
  }
}

class CbClient {
  // Checkout Settings
  fields: any;
  texts: any;
  tos: any;
  settings: any;

  // Brand setting
  brand: any;

  // Billing Rules
  features: any;
  criteria: any;
  override: any;
  decision: any;

  private restClient: RestClient;

  constructor() {
    this.restClient = new RestClient('');
  }

  public get(urlEndPoint: string, args = {}, headers = {}) {
    const that = this;
    headers['leap.api.version'] = 1;
    return new Promise((resolve, reject) => {
      window['requestInTransit'] = true;
      that.restClient
        .get(urlEndPoint, args, headers)
        .then(response => {
          resolve(response.data);
          window['requestInTransit'] = false;
        })
        .catch(error => {
          window['requestInTransit'] = false;
          if (error.response) {
            if (error.response.status === 401) {
              // AuthUtils.logout();
            }
            const cbError = new CbError(
              error.response.status,
              error.response.data
            );
            reject(cbError);
          }
          reject(error);
        });
    });
  }

  public post(urlEndPoint: string, queryParams = {}, body = {}, headers = {}) {
    const that = this;
    headers['leap.api.version'] = 1;
    return new Promise((resolve, reject) => {
      window['requestInTransit'] = true;
      that.restClient
        .post(urlEndPoint, queryParams, body, headers)
        .then(response => {
          resolve(response.data);
          window['requestInTransit'] = false;
        })
        .catch(error => {
          window['requestInTransit'] = false;
          if (error.response) {
            if (error.response.status === 401) {
              // AuthUtils.logout();
            }
            const cbError = new CbError(
              error.response.status,
              error.response.data
            );
            reject(cbError);
          }
          reject(error);
        });
    });
  }

  public perform(method: string, urlEndPoint: string, queryParams = {}, headers = {}, body = {}) {
    const restClientContext = this.restClient;
    return new Promise((resolve, reject) => {
      window['requestInTransit'] = true;

      let fn: any = '';

      if (method === 'GET') {
        fn = restClientContext.get.bind(restClientContext);
      } else if (method === 'POST') {
        fn = restClientContext.post.bind(restClientContext);
      } else {
        fn = restClientContext.put.bind(restClientContext);
      }

      fn(urlEndPoint, queryParams, body, headers)
        .then(response => {
          resolve(response.data);
          window['requestInTransit'] = false;
        })
        .catch(error => {
          window['requestInTransit'] = false;
          if (error.response) {
            if (error.response.status === 401) {
              // AuthUtils.logout();
            }
            const cbError = new CbError(
              error.response.status,
              error.response.data
            );
            reject(cbError);
          }
          reject(error);
        });
    });
  }
}

export default new CbClient();
