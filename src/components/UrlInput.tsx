import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    label: PropTypes.string,
    labelClassname: PropTypes.string,
    urlPrefix: PropTypes.string.isRequired,
};

export type UrlInputProps = React.HTMLProps<HTMLInputElement> & PropTypes.InferProps<typeof propTypes>;

const UrlInput: React.FC<UrlInputProps> = props => {
    const {
        label,
        labelClassname,
        urlPrefix,
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
                <span 
                    id={`${id}-url-prefix`}
                    className='input-group-text' 
                >
                    {urlPrefix}
                </span>
                <input 
                    id={id} 
                    className={`form-control ${inputProps?.className || ''}`} 
                    aria-describedby={`${id}-url-prefix`} 
                    {...inputProps}
                />
            </div>
        </div>
    );
}

UrlInput.propTypes = propTypes;

export default UrlInput;
