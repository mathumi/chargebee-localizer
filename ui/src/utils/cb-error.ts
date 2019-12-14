/* eslint-disable @typescript-eslint/camelcase */
export default class CbError {
  source: any;
  exceptionType: string;
  paramMessage!: string;
  paramName!: string;
  message!: string;

  constructor(status, response) {
    const tmp = this.checkForWebParamException(response);
    this.source = tmp ? tmp : response;
    this.exceptionType = this.source.param ? 'cb_param' : 'cb';
    this.fillValues();
  }

  checkForWebParamException(response) {
    if (response.errors && response.errors[1] && response.errors[1].param) {
      return {
        param: response.errors[1].param,
        error_msg: `${response.errors[1].message} ${
          response.errors[1].probable_reason
            ? response.errors[1].probable_reason
            : ''
          }`
      };
    }
  }

  fillValues() {
    if (this.isParamException()) {
      this.fillParamException();
    } else {
      this.showCbPageError();
    }
  }

  fillParamException() {
    this.paramMessage = this.getParamErrorMessage();
    this.paramName = this.getParamErrorName();
    this.message = 'There were errors while submitting';
  }

  showCbPageError() {
    if (this.source.errors) {
      this.message = this.source.errors[0].message;
    } else {
      this.message = this.source.message;
    }
  }

  isParamException() {
    return this.exceptionType === 'cb_param';
  }

  paramOrGenericException() {
    return this.isParamException() ? this.paramMessage : this.message;
  }

  getParamErrorMessage() {
    return this.source.error_msg || this.source.message;
  }

  getParamErrorName() {
    const param = this.source.error_param || this.source.param;
    return param && param.replace(/\[/g, '.').replace(/\]/g, '');
  }
}
