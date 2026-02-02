import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';
// hooks
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const { user } = useAuth();
  const currentRole = user?.role;

  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          {group.items.filter((data) => data.roles !== 'undefined' && data.roles.includes(currentRole)).length > 0 && (
            <ListSubheaderStyle
              sx={{
                ...(isCollapse && {
                  opacity: 0,
                }),
              }}
            >
              {group.subheader}
            </ListSubheaderStyle>
          )}

          {/* {group.items.map(list => ( */}
          {group.items
            .filter((data) => data.roles !== 'undefined' && data.roles.includes(currentRole))
            .map((list) => (
              <NavListRoot key={list.title + list.path} list={list} isCollapse={isCollapse} />
            ))}
        </List>
      ))}
    </Box>
  );
}
