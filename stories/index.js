import React from 'react';
import { storiesOf } from '@storybook/react';
import {
   createDummyStory,
   transformStoryComponents_JSX,
   transformStoryComponents_showdown,
   transformStoryComponents_markdownIt,
   tr_mdReactJs
} from "./autodoc";
// import { action } from '@storybook/addon-actions';
import Playground from 'component-playground';

require('./style.scss');
require('github-markdown-css');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/base16-light.css');

const reactDocs = require('react-docgen');
const req = require.context('raw-loader!../src/components', true, /\.js$/);
const reqJs = require.context('../src/components', true, /\.js$/);
const reqMd = require.context('../src/components', true, /\.md$/);

const utils = {
   sourcePath: function sourcePath(sourceFilePath) {
      const pathTokens = sourceFilePath.split('/');
      if (pathTokens.length > 2) {
         return pathTokens.slice(0, pathTokens.length - 1).join('/');
      } else {
         return pathTokens.join('/');
      }
   }
};

const requireDocFiles = (path) => {
   return reqMd(`${path}/Readme.md`).default;
};

let docGen = [];
req.keys().forEach((filePath) => {
   const sourcePath = utils.sourcePath(filePath);
   const src = req('' + filePath);
   docGen.push({
      src: src,
      md: requireDocFiles(sourcePath),

      // TODO: Prepare React class documentation from parse results from react docgen.
      doc: reactDocs.parse(src),
      component: reqJs(filePath).default
   });
});

let stories = storiesOf('UI Components', module);
docGen.forEach(parse => {
   const {displayName/*, description*/} = parse.doc;
   const {component, md} = parse;
   stories.add(displayName, () => {
      const StoryDocComponent = md(displayName, {
         [displayName]: component,
         React: React,
         Playground
      });

      // Render markdown with github markdown css.
      return <div className={'markdown-body'}>{StoryDocComponent}</div>;
   });
});