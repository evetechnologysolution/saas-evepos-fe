import PropTypes from 'prop-types';
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useQueryClient } from 'react-query';
// hooks
import useAuth from '../hooks/useAuth';
import { useLocalStorage } from '../utils/getData';
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

  const [currentAccount, setCurrentAccount] = useState(process.env.REACT_APP_ACCOUNT_TYPE || 'basic');

  const [selectedSubs, setSelectedSubs] = useState({});

  const [selectedOutlet, setSelectedOutlet] = useLocalStorage('selectedOutlet', '');

  const isUserReady = !!user?._id;
  const isOutletReady = !!selectedOutlet;

  // queries
  const { data: allNotif = null } = useAllNotif(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });
  const { data: product = [], isLoading: loadingProduct } = useProduct(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: category = [] } = useCategory(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: subcategory = [] } = useSubcategory(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: variant = [], isLoading: loadVariant = false } = useVariant(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: existCash = {} } = useCashBalance(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: receiptHeader = {} } = useReceiptSetting(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: generalSettings = {} } = useGeneralSetting(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  const { data: generalPerfume = {} } = useGeneralPerfume(selectedOutlet, {
    enabled: isUserReady && isOutletReady,
  });

  useEffect(() => {
    if (!user?._id || !user?.role) return;

    const keys = ['allNotif', 'allProduct', 'allCategory', 'allSubcategory', 'receiptHeader', 'generalSettings', 'generalPerfume', 'existCash'];

    keys.forEach((key) => {
      queryClient.invalidateQueries(key);
    });
  }, [user?._id, user?.role]);

  useEffect(() => {
    if (!user?._id) return;

    // OWNER
    if (user?.role === "owner") {
      // hanya isi default jika belum ada value sama sekali
      setSelectedOutlet((prev) => prev || user?.outletRef || "");
      return;
    }

    // NON OWNER
    // selalu sync ke outlet user
    setSelectedOutlet(user?.outletRef || "");
  }, [user?._id, user?.role, user?.outletRef]);

  const value = useMemo(
    () => ({
      socket,
      setSocket,
      selectedSubs,
      setSelectedSubs,
      selectedOutlet,
      setSelectedOutlet,
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
      selectedOutlet,
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
