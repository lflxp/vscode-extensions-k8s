import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'web'
  },
  codeSplitting: {
    jsStrategy: 'bigVendors',
    jsStrategyOptions: {}
  }
});
