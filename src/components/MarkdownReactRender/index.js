import React from 'react';
import Playground from 'component-playground';

require('./style.scss');

export default function MarkdownReactRender({src}) {


   return <div className={'mdr-block'}>
      <div className="mdr-container">
         <div className={'mdr-header'}>
            <div className="mdr-button-group">
               <button className="mdr-button mdr-button--header">code</button>
               <button className="mdr-button mdr-button--header">render</button>
            </div>
         </div>
         <div className="mdr-component-render">
         </div>
         <div className="mdr-code">
            <Playground codeText={src && src.length > 0 ? src : null}
                        scope={{React}} theme={'elegant'}/>
         </div>
      </div>
   </div>
}