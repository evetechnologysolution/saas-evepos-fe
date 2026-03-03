import PropTypes from 'prop-types';
import React, { createContext, useState, useMemo } from 'react';
// queries
// import { useAllNotif } from '../hooks/queries/useAllNotif';
import { useProduct } from '../hooks/queries/useProduct';
import { useCategory } from '../hooks/queries/useCategory';
import { useSubcategory } from '../hooks/queries/useSubcategory';
import { useVariant } from '../hooks/queries/useVariant';
import { useCashBalance } from '../hooks/queries/useCashBalance';
import { useReceiptSetting } from '../hooks/queries/useReceiptSetting';
import { useGeneralSetting } from '../hooks/queries/useGeneralSetting';
import { useGeneralPerfume } from '../hooks/queries/useGeneralPerfume';

export const mainContext = createContext({});

const MainContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [currentAccount, setCurrentAccount] = useState(process.env.REACT_APP_ACCOUNT_TYPE || 'basic');

  const [selectedSubs, setSelectedSubs] = useState({});

  // queries
  // const { data: allNotif = null } = useAllNotif();
  const allNotif = null;
  const { data: product = [], isLoading: loadingProduct } = useProduct();
  const { data: category = [] } = useCategory();
  const { data: subcategory = [] } = useSubcategory();
  const { data: variant = [] } = useVariant();
  const { data: existCash = {} } = useCashBalance();
  const { data: receiptHeader = {} } = useReceiptSetting();
  const { data: generalSettings = {} } = useGeneralSetting();
  const { data: generalPerfume = {} } = useGeneralPerfume();

  const value = useMemo(
    () => ({
      socket,
      setSocket,
      selectedSubs,
      setSelectedSubs,
      currentAccount,
      setCurrentAccount,
      allNotif,
      product,
      loadingProduct,
      category,
      subcategory,
      variant,
      existCash,
      receiptHeader,
      generalSettings,
      generalPerfume,
    }),
    [
      socket,
      selectedSubs,
      currentAccount,
      allNotif,
      product,
      loadingProduct,
      category,
      subcategory,
      variant,
      existCash,
      receiptHeader,
      generalSettings,
      generalPerfume,
    ]
  );

  return <mainContext.Provider value={value}>{children}</mainContext.Provider>;
};

export default MainContextProvider;

// ----------------------------------------------------------------------

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
