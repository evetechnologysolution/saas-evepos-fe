import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import Iconify from './Iconify';

ArrowButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

function ArrowButton({ children, disabled, onClick }) {
    return (
        <IconButton
            type="button"
            color="primary"
            disabled={disabled}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                right: '1%',
                // opacity: disabled ? '0' : '1',
                userSelect: 'none',
            }}
        >
            {children}
        </IconButton>
    );
}

export function LeftArrow() {
    const { isFirstItemVisible, scrollPrev, visibleElements, initComplete } = useContext(VisibilityContext);
    const [disabled, setDisabled] = useState(!initComplete || (initComplete && isFirstItemVisible));

    useEffect(() => {
        // NOTE: detect if whole component visible
        if (visibleElements.length) {
            setDisabled(isFirstItemVisible);
        }
    }, [isFirstItemVisible, visibleElements]);

    return (
        <ArrowButton disabled={disabled} onClick={() => scrollPrev()}>
            <Iconify icon='ci:chevron-left' width={24} height={24} />
        </ArrowButton>
    );
}

export function RightArrow() {
    const { isLastItemVisible, scrollNext, visibleElements } = useContext(VisibilityContext);
    const [disabled, setDisabled] = useState(!visibleElements.length && isLastItemVisible);

    useEffect(() => {
        if (visibleElements.length) {
            setDisabled(isLastItemVisible);
        }
    }, [isLastItemVisible, visibleElements]);

    return (
        <ArrowButton disabled={disabled} onClick={() => scrollNext()}>
            <Iconify icon='ci:chevron-right' width={24} height={24} />
        </ArrowButton>
    );
}