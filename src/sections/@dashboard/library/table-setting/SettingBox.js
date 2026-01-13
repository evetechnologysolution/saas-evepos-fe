import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

SettingBox.propTypes = {
    id: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
    category: PropTypes.number,
    status: PropTypes.string,
    hideSourceOnDrag: PropTypes.bool,
    handleClick: PropTypes.func,
    children: PropTypes.node,
};

export default function SettingBox({ id, top, left, category, status, hideSourceOnDrag, handleClick, children }) {

    const theme = useTheme();

    let widthValue = '4rem';
    if (category === 1) { // reguler
        widthValue = '4rem';
    } else if (category === 2) { // panjang vertical |
        widthValue = '4rem';
    } else { // panjang horizontal -
        widthValue = '8rem';
    }

    let heightValue = '4rem';
    if (category === 1) {
        heightValue = '4rem';
    } else if (category === 2) {
        heightValue = '8rem';
    } else {
        heightValue = '4rem';
    }

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.BOX,
            item: { id, top, left },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id, top, left],
    );
    if (isDragging && hideSourceOnDrag) {
        return <div ref={drag} />
    }

    return (
        <div
            className="box"
            ref={drag}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                backgroundColor: status === 'Open' ? theme.palette.primary.main : theme.palette.error.main,
                color: 'white',
                fontWeight: 600,
                cursor: 'move',
                width: `${widthValue}`,
                height: `${heightValue}`,
                left,
                top
            }}
            data-testid="box"
            onDoubleClick={handleClick}
            aria-hidden="true"
        >
            {children}
        </div>
    )
}
