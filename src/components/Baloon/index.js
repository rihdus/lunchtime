import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple Baloon component.
 * @param {} props
 *
 * <Baloon cc="test">Baloon</Text>
 *
 */
export default function Baloon(props) {
   const { color, thickness } = props;
   const style = {
      border: `${thickness}px solid ${color}`,
      padding: '10px'
   };
   return (<p style={style} className={props.cc}>{props.children}</p>);
}

Baloon.propTypes = {
   children: PropTypes.any
};

Baloon.defaultProps = {
};
