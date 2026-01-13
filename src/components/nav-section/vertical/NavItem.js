import PropTypes from 'prop-types';
import { useContext } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link, ListItemText, Typography, Tooltip } from '@mui/material';
import Label from '../../Label';
// context
import { mainContext } from '../../../contexts/MainContext';
//
import Iconify from '../../Iconify';
import { ListItemStyle as ListItem, ListItemTextStyle, ListItemIconStyle } from './style';
import { numberWithCommas } from '../../../utils/getData';
import { isExternalLink } from '..';

// ----------------------------------------------------------------------

ListItem.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
};

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  isCollapse: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    caption: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    accountTypes: PropTypes.arrayOf(PropTypes.string),
  }),
};

export function AccountCheck(accountTypes) {
  const ctm = useContext(mainContext);
  if (accountTypes && !accountTypes.includes(ctm.currentAccount)) {
    return true;
  }
  return false;
}

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }) {
  const { title, path, icon, info, children, disabled, caption, roles, accountTypes, total = 0 } = item;


  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption || ''} arrow>
            <Typography
              noWrap
              variant="caption"
              component="div"
              sx={{ textTransform: 'initial', color: 'text.secondary' }}
            >
              {accountTypes && AccountCheck(accountTypes) ? 'Please Upgrade' : caption}
            </Typography>
          </Tooltip>
        }
        isCollapse={isCollapse}
      />
      {total ? (
        <Label variant="filled" color="error">
          <Typography
            variant="caption"
          >
            {numberWithCommas(total)}
          </Typography>
        </Label>
      ) : null}
      {!isCollapse && (
        <>
          {children && <ArrowIcon open={open} />}
          {accountTypes && AccountCheck(accountTypes) ? (
            <Iconify icon="fluent:lock-closed-24-filled" width={24} height={24} />
          ) : (
            info && info
          )}
        </>
      )}
    </>
  );

  if (children) {
    return (
      <ListItem onClick={onOpen} activeRoot={active} disabled={accountTypes ? AccountCheck(accountTypes) : disabled} roles={roles}>
        {renderContent}
      </ListItem>
    );
  }

  return isExternalLink(path) ? (
    <ListItem component={Link} href={path} target="_blank" rel="noopener" disabled={accountTypes ? AccountCheck(accountTypes) : disabled} roles={roles}>
      {renderContent}
    </ListItem>
  ) : (
    <ListItem component={RouterLink} to={path} activeRoot={active} disabled={accountTypes ? AccountCheck(accountTypes) : disabled} roles={roles}>
      {renderContent}
    </ListItem>
  );
}

// ----------------------------------------------------------------------

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    caption: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.string),
    accountTypes: PropTypes.arrayOf(PropTypes.string),
  }),
};

export function NavItemSub({ item, open = false, active = false, onOpen }) {
  const { title, path, info, children, disabled, caption, roles, accountTypes, total = 0 } = item;

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption || ''} arrow>
            <Typography
              noWrap
              variant="caption"
              component="div"
              sx={{ textTransform: 'initial', color: 'text.secondary' }}
            >
              {accountTypes && AccountCheck(accountTypes) ? 'Please Upgrade' : caption}
            </Typography>
          </Tooltip>
        }
      />
      {total ? (
        <Label variant="filled" color="error">
          <Typography
            variant="caption"
          >
            {numberWithCommas(total)}
          </Typography>
        </Label>
      ) : null}
      {children && <ArrowIcon open={open} />}
      {accountTypes && AccountCheck(accountTypes) ? (
        <Iconify icon="fluent:lock-closed-24-filled" width={24} height={24} />
      ) : (
        info && info
      )}
    </>
  );

  if (children) {
    return (
      <ListItem onClick={onOpen} activeSub={active} subItem disabled={accountTypes ? AccountCheck(accountTypes) : disabled} roles={roles}>
        {renderContent}
      </ListItem>
    );
  }

  return isExternalLink(path) ? (
    <ListItem component={Link} href={path} target="_blank" rel="noopener" subItem disabled={accountTypes ? AccountCheck(accountTypes) : disabled} roles={roles}>
      {renderContent}
    </ListItem>
  ) : (
    <ListItem component={RouterLink} to={path} activeSub={active} subItem disabled={accountTypes ? AccountCheck(accountTypes) : disabled} roles={roles}>
      {renderContent}
    </ListItem>
  );
}

// ----------------------------------------------------------------------

DotIcon.propTypes = {
  active: PropTypes.bool,
};

export function DotIcon({ active }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

ArrowIcon.propTypes = {
  open: PropTypes.bool,
};

export function ArrowIcon({ open }) {
  return (
    <Iconify
      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  );
}
