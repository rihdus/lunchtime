const path = require('path');
const raw = require('raw-loader');

const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

const jsxRenderer = (contents, resourcePath, options) => {
   const componentPathTokens = resourcePath.split('/'),
      mdFileName = componentPathTokens.pop();
   const componentPath = componentPathTokens.join('/');
   const componentName = componentPathTokens.pop();

   console.log(`${componentName}:${mdFileName}`, componentPath);

   return `
      import React from 'react';
      import ${componentName} from '${componentPath}';
      export default (name, components) => {
         console.log('Rendering ${componentName}'); 
         return (<div>${contents.replace('\\n', '')}</div>);
      }`;
};

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
   const config = genDefaultConfig(storybookBaseConfig, configType);
   // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
   // You can change the configuration based on that.
   // 'PRODUCTION' is used when building the static version of storybook.

   // Make whatever fine-grained changes you need
   // storybookBaseConfig.module.plugins.push(new raw());

   let mdLoaderRule = config.module.rules.find(function (rule) {
      return rule.test.toString() === /\.md$/.toString()
   });
   mdLoaderRule.use = [
      {
         loader: 'babel-loader',
         query: {
            presets: ['es2015', 'react']
         }
      },
      {
         loader: 'markdown-jsx-loader',
         options: {
            // renderer: mdRenderer,
            render: jsxRenderer
         }
      }
   ];

   console.log(config.module);
   // Return the altered config
   return config;
};