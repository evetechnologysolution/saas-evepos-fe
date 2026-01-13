import PropTypes from 'prop-types';
import { useState, useContext, useCallback } from 'react';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
// components
import Box from './SettingBox';
import { ItemTypes } from './ItemTypes';
import Scrollbar from '../../../../components/Scrollbar';
import ModalSetting from './ModalSetting';
// context
import { tableContext } from "../../../../contexts/TableContext";

SettingContainer.propTypes = {
    hideSourceOnDrag: PropTypes.bool,
    cover: PropTypes.string,
};

export default function SettingContainer({ hideSourceOnDrag, cover }) {
    const ctx = useContext(tableContext);

    const theme = useTheme();

    const [selected, setSelected] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const handleCloseAdd = () => setOpenAdd(false);

    const moveBox = useCallback(
        (id, top, left) => {
            ctx.setTableView(
                update(ctx.tableView, {
                    [id]: {
                        $merge: { top, left },
                    },
                }),
            )
        },
        [ctx.tableView, ctx.setTableView],
    );

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.BOX,
            drop(item, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset()
                const top = Math.round(item.top + delta.y)
                const left = Math.round(item.left + delta.x)
                moveBox(item.id, top, left)
                return undefined
            },
        }),
        [moveBox],
    );

    const handleClick = (id) => {
        setOpenAdd(true);
        setSelected(id)
    };

    return (
        <>
            <div
                ref={drop}
                style={{
                    width: 'auto',
                    height: 550,
                    border: '1px solid black',
                    borderRadius: '8px',
                    position: 'relative',
                    padding: 10,
                    ...(cover && {
                        backgroundImage: `url("${cover}")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }),
                }}
            >
                <Scrollbar>
                    <div
                        style={{
                            // width: 700,
                            height: 550,
                            backgroundImage: 'radial-gradient(black 1px, transparent 0)',
                            backgroundSize: '14px 14px',
                            backgroundPosition: '-19px -19px',
                        }}
                    >
                        {ctx.tableView.length > 0 && ctx.tableView.map((item, i) => (
                            <Box
                                key={i}
                                id={i}
                                top={item.top}
                                left={item.left}
                                category={item.category}
                                status={item.status}
                                hideSourceOnDrag={hideSourceOnDrag}
                                handleClick={() => handleClick(i)}
                            >
                                {item.name}
                            </Box>
                        ))}
                    </div>
                </Scrollbar>
                <Stack position="absolute" flexDirection="row" gap={1.5} top={5} right={5} borderRadius={0.8} px={1} py={0.5} bgcolor={theme.palette.grey[300]}>
                    <Stack alignItems="center" flexDirection="row" gap={0.5}>
                        <div style={{ backgroundColor: theme.palette.primary.main, borderRadius: "5px", width: "15px", height: "15px" }}>
                            &nbsp;
                        </div>
                        <Typography variant="body2">Open</Typography>
                    </Stack>
                    <Stack alignItems="center" flexDirection="row" gap={0.5}>
                        <div style={{ backgroundColor: theme.palette.error.main, borderRadius: "5px", width: "15px", height: "15px" }}>
                            &nbsp;
                        </div>
                        <Typography variant="body2">Closed</Typography>
                    </Stack>
                </Stack>
            </div>

            <ModalSetting
                open={openAdd}
                onClose={handleCloseAdd}
                isEdit
                id={selected}
            />
        </>
    )
}
