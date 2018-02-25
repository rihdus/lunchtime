import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple Text component.
 * @param {} props
 *
 * <Text cc="test">Text HTML</Text>
 *
 */
export default function Text(props) {
   return (<p style={{border: '1px solid #AAA', padding: '10px'}} className={props.cc}>{props.children}</p>);
}

Text.propTypes = {
   children: PropTypes.any
};

Text.defaultProps = {
};
