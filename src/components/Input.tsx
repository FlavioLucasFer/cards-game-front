import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    label: PropTypes.string,
    labelClassname: PropTypes.string,
};

export type InputProps = React.HTMLProps<HTMLInputElement> & PropTypes.InferProps<typeof propTypes>;

const Input: React.FC<InputProps> = props => {
    const {
        label,
        labelClassname,
        id = '',
        ...inputProps
    } = props;

    return (
        <div>
            {label &&
                <label
                    htmlFor={id}
                    className={`form-label ${labelClassname || ''}`}
                >
                    {label}
                </label>
            }
            <div className='input-group mb-3'>
                <input
                    id={id}
                    className={`form-control ${inputProps?.className || ''}`}
                    {...inputProps}
                />
            </div>
        </div>
    );
}

Input.propTypes = propTypes;

export default Input;
