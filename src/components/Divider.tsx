import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const propTypes = {
    color: PropTypes.string,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    margin: PropTypes.string,
};

export type DividerProps = PropTypes.InferProps<typeof propTypes>;

const Divider: React.FC<DividerProps> = props => {
    const { 
        color = '#585858', 
        direction = 'horizontal',
        margin,
    } = props; 
    
    if (direction === 'horizontal')
        return (
            <div 
                style={{
                    borderTop: `2px solid ${color}`,
                    margin: margin || '15px 0',
                }} 
            />
        );

    return (
        <div 
            style={{
                borderRight: `2px solid ${color}`,
                margin: margin || '0 15px',
            }} 
        />
    );
}

Divider.propTypes = propTypes;

export default Divider;
