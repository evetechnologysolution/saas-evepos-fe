/* eslint-disable import/no-unresolved */
import { capitalCase } from 'change-case';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword,
} from 'src/sections/@dashboard/user/account';
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useTabs from 'src/hooks/useTabs';
import useSettings from 'src/hooks/useSettings';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from 'src/_mock';
// components
import Page from 'src/components/Page';
import Iconify from 'src/components/Iconify';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
// import {
//   AccountGeneral,
//   AccountBilling,
//   AccountSocialLinks,
//   AccountNotifications,
//   AccountChangePassword,
// } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('account');

  const ACCOUNT_TABS = [
    {
      value: 'account',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    // {
    //   value: 'billing',
    //   icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
    //   component: <AccountBilling cards={_userPayment} addressBook={_userAddressBook} invoices={_userInvoices} />,
    // },
    // {
    //   value: 'notifications',
    //   icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
    //   component: <AccountNotifications />,
    // },
    // {
    //   value: 'social_links',
    //   icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
    //   component: <AccountSocialLinks myProfile={_userAbout} />,
    // },
    // {
    //   value: 'change_password',
    //   icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
    // component: <AccountChangePassword />,
    // },
  ];

  return (
    <Page title="User: Account Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Account Settings' }]}
        />

        {/* <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs> */}

        <Box sx={{ mb: 5 }} />
        <Box>
          <AccountGeneral />
        </Box>

        {/* {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })} */}
      </Container>
    </Page>
  );
}
