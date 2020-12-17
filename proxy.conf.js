// This provides proxy support for ng serve to mimic what the hosted environment will look like
// see: https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md
// https://levelup.gitconnected.com/fixing-cors-errors-with-angular-cli-proxy-e5e0ef143f85
const PROXY_CONFIG = {
  "/api": {
    target: "http://jaza2160.odns.fr",
    logLevel: "info",
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/ayeka_exercise_back/"
    }
  }
};

module.exports = PROXY_CONFIG;
