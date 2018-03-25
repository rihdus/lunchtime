import React from 'react';
import MarkdownJSX from 'markdown-to-jsx';
import { mdReact } from 'markdown-react-js';

import { fencedJSX } from './react-doc';

const markdownIt = require('markdown-it')({
   html: true
});

const jsx = require('markdown-it-jsx');
const highlight = require('markdown-it-highlightjs');

markdownIt.use(jsx);
markdownIt.use(fencedJSX, {});

import { Markdown as MarkdownShowdown } from 'react-showdown';

/**
 * @param component React component class or function used to create
 * the react element.
 */
export const createDummyStory = (component) => {
   return React.createElement(component);
};

/**
 * Create render-able component from
 */
export const transformStoryComponents_JSX = (md, components) => {
   return () => {
      let componentOverrides = {};
      Object.keys(components).forEach(key => {
         componentOverrides[key] = {component: components[key]}
      });
      const markdownConfig = {
         overrides: {...componentOverrides}
      };
      console.log(markdownConfig);
      return (<MarkdownJSX options={markdownConfig}>{md}</MarkdownJSX>)
   }
};

/**
 *
 * @param md Markdown text
 * @param components
 * @return {function()}
 */
export const transformStoryComponents_showdown = (md, components) => {
   return () => {
      return (<MarkdownShowdown markup={md} components={components}/>)
   };
};

export const transformStoryComponents_markdownIt = (mdString, components) => {
   return () => {
      return markdownIt.render(mdString, {components});
      // return render;
   }
};

export const tr_mdReactJs = (md, components) => {
   return () => {
      return mdReact({
         onIterate: function (Tag, props, children, level) {
            console.log(`${Tag}:${level} ${JSON.stringify(props)}`, children,);
            if (components[Tag]) {
               return React.createElement(components[Tag], props, children)
            } else {
               return <Tag {...props}>{children}</Tag>;
            }
         },
         markdownOptions: {html: false},
         plugins: [jsx]
      })(md);
   }
};
