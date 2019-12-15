import moment from "moment";

export default {
  install(Vue) {
    Vue.prototype.$time = timestamp =>
      moment(timestamp)
        .utc()
        .format("LL");
  }
};
