const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "shellApp",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true },
        "@angular/common": { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true },
        "@angular/common/http": { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true },
        "@angular/router": { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true },
        "ngx-event-service": { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true },
        "@labshare/base-ui-services": { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true },

        ...sharedMappings.getDescriptors()
      })

    }),
    sharedMappings.getPlugin()
  ],
};
