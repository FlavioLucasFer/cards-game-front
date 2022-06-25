import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const propTypes = {
    color: PropTypes.string,
};

type DividerProps = PropTypes.InferProps<typeof propTypes>;

const Divider: React.FC<DividerProps> = props => {
    const { 
        color = '#585858', 
    } = props; 

    const DividerDiv = styled.div`
        border-top: 2px solid ${color};
        margin: 15px 0;
    `;
    
    return (
        <DividerDiv />
    );
}

Divider.propTypes = propTypes;

export default Divider;
