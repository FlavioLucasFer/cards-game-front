import React, { useState } from 'react';
import BootstrapToast, { ToastProps as BootstrapToastProps } from 'react-bootstrap/Toast';
import PropTypes from 'prop-types';

const propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
}

export type ToastProps = BootstrapToastProps & PropTypes.InferProps<typeof propTypes>;

const Toast: React.FC<ToastProps> = props => {
    const {
        title,
        message,
        ...toastProps
    } = props; 

    const [show, setShow] = useState(true);

    const handleOnClose = () => {
        setShow(false);
    }

    return (
        <BootstrapToast 
            show={show}
            onClose={handleOnClose}
            delay={5000}
            autohide
            {...toastProps}
        >
            <BootstrapToast.Header>
                <strong className="me-auto">{title}</strong>
            </BootstrapToast.Header>
            <BootstrapToast.Body className={toastProps.bg === 'dark' ? 'text-white' : ''}>
                {message}
            </BootstrapToast.Body>
        </BootstrapToast>
    );
}

Toast.propTypes = propTypes;

export default Toast;