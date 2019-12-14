module.exports = {
  // chainWebpack: config => {
  //   const oneOfsMap = config.module.rule("scss").oneOfs.store;
  //   oneOfsMap.forEach(item => {
  //     item
  //       .use("sass-resources-loader")
  //       .loader("sass-resources-loader")
  //       .options({
  //         // Provide path to the file with resources
  //         // resources: "./src/assets/styles/_variables.scss"
  //       })
  //       .end();
  //   });
  // },
  devServer: {
    proxy: "http://localhost:3000/api/"
  }
};
