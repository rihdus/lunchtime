'use strict';
const markdownItFence = require('markdown-it-fence');
const React = require('react');

export const fencedJSX = function yourPlugin(md, options) {
   return markdownItFence(md, 'react', {
      // marker: ':::',   // default is '`'
      render: function (tokens, i, options, env) {
         const token = tokens[i];
         const {content} = token;
         const {components} = env;
         console.log(token.type, content);
         return ``;
      }
   })
};
