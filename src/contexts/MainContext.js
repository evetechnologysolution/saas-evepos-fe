import PropTypes from 'prop-types';
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useQueryClient } from 'react-query';
// hooks
import useAuth from '../hooks/useAuth';
// queries
import { useAllNotif } from '../hooks/queries/useAllNotif';
import { useProduct } from '../hooks/queries/useProduct';
import { useCategory } from '../hooks/queries/useCategory';
import { useSubcategory } from '../hooks/queries/useSubcategory';
import { useVariant } from '../hooks/queries/useVariant';
import { useCashBalance } from '../hooks/queries/useCashBalance';
import { useReceiptSetting } from '../hooks/queries/useReceiptSetting';
import { useGeneralSetting } from '../hooks/queries/useGeneralSetting';
import { useGeneralPerfume } from '../hooks/queries/useGeneralPerfume';

export const mainContext = createContext(null);

const MainContextProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const isUserReady = !!user?._id;

  const [currentAccount, setCurrentAccount] = useState(process.env.REACT_APP_ACCOUNT_TYPE || 'basic');

  const [selectedSubs, setSelectedSubs] = useState({});

  // queries
  const { data: allNotif = null } = useAllNotif();
  const { data: product = [], isLoading: loadingProduct } = useProduct({
    enabled: isUserReady,
  });

  const { data: category = [] } = useCategory({
    enabled: isUserReady,
  });

  const { data: subcategory = [] } = useSubcategory({
    enabled: isUserReady,
  });

  const { data: variant = [], isLoading: loadVariant = false } = useVariant({
    enabled: isUserReady,
  });

  const { data: existCash = {} } = useCashBalance({
    enabled: isUserReady,
  });

  const { data: receiptHeader = {} } = useReceiptSetting({
    enabled: isUserReady,
  });

  const { data: generalSettings = {} } = useGeneralSetting({
    enabled: isUserReady,
  });

  const { data: generalPerfume = {} } = useGeneralPerfume({
    enabled: isUserReady,
  });

  useEffect(() => {
    if (!user?._id || !user?.role) return;

    const keys = ['allProduct', 'allCategory', 'allSubcategory', 'receiptHeader', 'generalSettings', 'generalPerfume'];

    keys.forEach((key) => {
      queryClient.invalidateQueries(key);
    });
  }, [user?._id, user?.role]);

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
      loadVariant,
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
      loadVariant,
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
