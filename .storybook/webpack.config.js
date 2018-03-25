const path = require('path');
const marked = require('marked');
const mdRenderer = new marked.Renderer();
const highlightjs = require('highlight.js');
const htmlencode = require('htmlencode').htmlEncode;

const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

marked.setOptions({
   highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
   }
});

mdRenderer.code = (code, langStr, escaped) => {
   /* Highlighted code generated from highlight.js */
   const highlightedCode = highlightjs.highlightAuto(code).value;

   const match = langStr.match(/(\w+)\((\w+)\)$/)
   if (match) {
      const modifier = match[1]
         , lang = match[2];
      return modifier === 'playground' && `
<div className={'block-playground base16-light'}>
    <Playground codeText={'${code}'} scope={{}} theme="base16-light" />
</div>`;
   } else {
      return `<pre>${highlightedCode}</pre>`;
   }

};

const jsxRenderer = (contents, resourcePath, options) => {
   const componentPathTokens = resourcePath.split('/'),
      mdFileName = componentPathTokens.pop();
   const componentPath = componentPathTokens.join('/');
   const componentName = componentPathTokens.pop();


   const playgroundScopeToken = `scope={{React: React, ${componentName}: ${componentName}}} `;

   contents = contents
      .replace('\n', '')
      .replace('scope={{}}', playgroundScopeToken);

   return `
      import React from 'react';
      import Playground from 'component-playground';
      import ${componentName} from '${componentPath}';
      export default (name, components) => { 
         return (<div>${contents}</div>);
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
            renderer: mdRenderer,
            render: jsxRenderer
         }
      }
   ];

   config.module.rules.push({
      test: /\.scss$/,
      use: [{
         loader: "style-loader" // creates style nodes from JS strings
      }, {
         loader: "css-loader" // translates CSS into CommonJS
      }, {
         loader: "sass-loader" // compiles Sass to CSS
      }]
   });
   // Return the altered config
   return config;
};