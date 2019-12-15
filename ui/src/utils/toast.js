import { ToastProgrammatic as Toast } from "buefy";

export default {
  install(Vue) {
    Vue.prototype.$success = message => {
      Toast.open({
        message,
        position: "is-bottom-left",
        type: "is-success"
      });
    };
    Vue.prototype.$error = error => {
      const message =
        typeof error === "string" ? error : error && error.message;
      Toast.open({
        message,
        position: "is-bottom-left",
        type: "is-success"
      });
    };
  }
};
