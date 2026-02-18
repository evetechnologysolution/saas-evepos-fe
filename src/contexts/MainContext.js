import PropTypes from 'prop-types';
import React, { createContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from '../utils/axios';
import {
  // sortByDate,
  sortByName,
} from '../utils/getData';

export const mainContext = createContext({
  socket: null,
  setSocket: () => {},
  allNotif: null,
  product: [],
  createProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  category: [],
  createCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  subcategory: [],
  createSubcategory: () => {},
  updateSubcategory: () => {},
  deleteSubcategory: () => {},
  variant: [],
  createVariant: () => {},
  updateVariant: () => {},
  deleteVariant: () => {},
  currentPromo: [],
  detailPromo: [],
  setDetailPromo: () => {},
  getDetailPromo: () => {},
  createPromotion: () => {},
  updatePromotion: () => {},
  deletePromotion: () => {},
  createUserList: () => {},
  updateUserList: () => {},
  deleteUserList: () => {},
  currentAccount: {},
  setCurrentAccount: () => {},
  businessInformation: {},
  updatePersonalInformation: () => {},
  updateBusinessInformation: () => {},
  updatePassword: () => {},
  receiptHeader: {},
  updateReceiptHeader: () => {},
  existCash: {},
  setExistCash: () => {},
  getExistCash: () => {},
  createCash: () => {},
  closeCash: () => {},
  deleteCash: () => {},
  generalSettings: {},
  setGeneralSettings: () => {},
  getGeneralSettings: () => {},
  saveGeneralSettings: () => {},
  generalPerfume: {},
  setGeneralPerfume: () => {},
  getGeneralPerfume: () => {},
  saveGeneralPerfume: () => {},
  selectedSubs: {},
  setSelectedSubs: () => {},
});

const MainContextProvider = ({ children }) => {
  const client = useQueryClient();
  const [socket, setSocket] = useState(null);

  const [currentAccount, setCurrentAccount] = useState(process.env.REACT_APP_ACCOUNT_TYPE || 'basic');
  const [detailPromo, setDetailPromo] = useState({});

  const [existCash, setExistCash] = useState({});

  const [generalSettings, setGeneralSettings] = useState({});
  const [generalPerfume, setGeneralPerfume] = useState({});

  const [selectedSubs, setSelectedSubs] = useState({});

  // Fetch notification
  // const { data: allNotif } = useQuery(
  //   ['allNotif'],
  //   async () => {
  //     const res = await axios.get('/notification/all');
  //     return res.data;
  //   },
  //   {
  //     refetchOnWindowFocus: false, // Prevents refetch on window focus
  //   }
  // );

  // Fetch product data
  const { data: product = [] } = useQuery(
    ['allProduct'],
    async () => {
      const res = await axios.get('/product/all');
      return res.data;
    },
    {
      refetchOnWindowFocus: false, // Prevents refetch on window focus
    }
  );

  // Fetch category data
  const { data: category = [] } = useQuery(
    ['allCategory'],
    async () => {
      const res = await axios.get('/category');
      return res.data?.docs;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch subcategory data
  const { data: subcategory = [] } = useQuery(
    ['allSubcategory'],
    async () => {
      const res = await axios.get('/subcategory');
      return res.data?.docs;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch variant data
  const { data: variant = [] } = useQuery(
    ['allVariant'],
    async () => {
      const res = await axios.get('/variant');
      return sortByName(res.data?.docs);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch receipt setting data
  const { data: receiptHeader = {} } = useQuery(
    ['receiptHeader'],
    async () => {
      const res = await axios.get('/receipt-setting');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch receipt setting data
  // const { data: businessInformation = {} } = useQuery(
  //   ['businessInformation'],
  //   async () => {
  //     const res = await axios.get('/informations');
  //     return res.data;
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const createProduct = async (data) => {
    try {
      await axios.post('/products', data);
      client.invalidateQueries('allProduct');
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async (data, newData) => {
    try {
      await axios.patch(`/products/${data._id}`, newData);
      client.invalidateQueries('allProduct');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      client.invalidateQueries('allProduct');
    } catch (error) {
      console.error(error);
    }
  };

  const getDetailPromo = async (id) => {
    try {
      await axios.get(`/promotion/${id}`).then((response) => {
        setDetailPromo(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createPromotion = async (data) => {
    try {
      await axios.post('/promotion', data);
      client.invalidateQueries('allProduct');
      client.invalidateQueries('allCurrentPromotion');
    } catch (error) {
      console.error(error);
    }
  };

  const updatePromotion = async (id, newData) => {
    try {
      await axios.patch(`/promotion/${id}`, newData);
      client.invalidateQueries('allProduct');
      client.invalidateQueries('allCurrentPromotion');
    } catch (error) {
      console.error(error);
    }
  };

  const deletePromotion = async (id) => {
    try {
      await axios.delete(`/promotion/${id}`);
      client.invalidateQueries('allProduct');
      client.invalidateQueries('allCurrentPromotion');
    } catch (error) {
      console.error(error);
    }
  };

  const createCategory = async (data) => {
    try {
      await axios.post('/categories', data);
      client.invalidateQueries('allCategory');
    } catch (error) {
      console.error(error);
    }
  };

  const updateCategory = async (data, newData) => {
    try {
      await axios.patch(`/categories/${data._id}`, newData);
      client.invalidateQueries('allCategory');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      client.invalidateQueries('allCategory');
    } catch (error) {
      console.error(error);
    }
  };

  const createSubcategory = async (data) => {
    try {
      await axios.post('/subcategories', data);
      client.invalidateQueries('allSubcategory');
    } catch (error) {
      console.error(error);
    }
  };

  const updateSubcategory = async (data, newData) => {
    try {
      await axios.patch(`/subcategories/${data._id}`, newData);
      client.invalidateQueries('allSubcategory');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSubcategory = async (id) => {
    try {
      await axios.delete(`/subcategories/${id}`);
      client.invalidateQueries('allSubcategory');
    } catch (error) {
      console.error(error);
    }
  };

  const createVariant = async (data) => {
    try {
      await axios.post('/variant', data);
      client.invalidateQueries('allVariant');
      client.invalidateQueries('allProduct');
      client.invalidateQueries('allCurrentPromotion');
    } catch (error) {
      console.error(error);
    }
  };

  const updateVariant = async (id, newData) => {
    try {
      await axios.patch(`/variant/${id}`, newData);
      client.invalidateQueries('allVariant');
      client.invalidateQueries('allProduct');
      client.invalidateQueries('allCurrentPromotion');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVariant = async (id) => {
    try {
      await axios.delete(`/variant/${id}`);
      client.invalidateQueries('allVariant');
      client.invalidateQueries('allProduct');
      client.invalidateQueries('allCurrentPromotion');
    } catch (error) {
      console.error(error);
    }
  };

  // for user list
  const createUserList = async (data) => {
    try {
      await axios.post('/users', data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserList = async (id, newData) => {
    try {
      await axios.patch(`/users/${id}`, newData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserList = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBusinessInformation = async (data) => {
    try {
      await axios.post('/informations/save', data);
      client.invalidateQueries('businessInformation');
    } catch (error) {
      console.error(error);
    }
  };

  const updatePersonalInformation = async (obj, id) => {
    try {
      await axios.patch(`/users/profile/${id}`, obj);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePassword = async (obj, id) => {
    try {
      const res = await axios.patch(`/users/change-password/${id}`, obj);
      return await res.data;
    } catch (error) {
      return error;
    }
  };

  const updateReceiptHeader = async (data) => {
    try {
      await axios.post('/receipt-setting/save', data);
      client.invalidateQueries('receiptHeader');
    } catch (error) {
      console.error(error);
    }
  };

  // for open & close cash cashier
  const getExistCash = async () => {
    try {
      await axios.get('/cash-balance/exist').then((response) => {
        setExistCash(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createCash = async (data) => {
    try {
      const response = await axios.post('/cash-balance/', data);
      if (response.status === 200) {
        if (data.cashOut) {
          const objExpense = {
            date: new Date(),
            code: 8, // pengeluaran outlet
            description: data.title,
            amount: data.cashOut,
          };
          await axios.post('/expense/', objExpense);
        }
        getExistCash();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeCash = async (data) => {
    try {
      await axios.post('/cash-balance/close', data).then((response) => {
        if (response.status === 200) {
          getExistCash();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCash = async (id) => {
    try {
      await axios.delete(`/cash-balance/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // for other setting
  const getGeneralSettings = async () => {
    try {
      await axios.get('/setting/').then((response) => {
        setGeneralSettings(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveGeneralSettings = async (data) => {
    try {
      await axios.post('/setting/', data).then((response) => {
        if (response.status === 200) {
          getGeneralSettings();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  // for perfume
  const getGeneralPerfume = async () => {
    try {
      await axios.get('/variant?perfume=yes').then((response) => {
        setGeneralPerfume(response.data[0]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveGeneralPerfume = async (data) => {
    try {
      await axios.post('/variant/perfume/', data).then((response) => {
        if (response.status === 200) {
          getGeneralPerfume();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([getExistCash(), getGeneralSettings(), getGeneralPerfume()]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  // useEffect(() => {
  //   if (businessInformation?.accountType) {
  //     setCurrentAccount(process.env.REACT_APP_ACCOUNT_TYPE || businessInformation?.accountType);
  //   }
  // }, [businessInformation]);

  const allNotif = null;

  return (
    <mainContext.Provider
      value={{
        socket,
        setSocket,
        allNotif,
        product,
        createProduct,
        updateProduct,
        deleteProduct,
        category,
        createCategory,
        updateCategory,
        deleteCategory,
        subcategory,
        createSubcategory,
        updateSubcategory,
        deleteSubcategory,
        variant,
        createVariant,
        updateVariant,
        deleteVariant,
        detailPromo,
        setDetailPromo,
        getDetailPromo,
        createPromotion,
        updatePromotion,
        deletePromotion,
        createUserList,
        updateUserList,
        deleteUserList,
        currentAccount,
        setCurrentAccount,
        // businessInformation,
        updateBusinessInformation,
        updatePersonalInformation,
        updatePassword,
        receiptHeader,
        updateReceiptHeader,
        existCash,
        setExistCash,
        getExistCash,
        createCash,
        closeCash,
        deleteCash,
        generalSettings,
        setGeneralSettings,
        getGeneralSettings,
        saveGeneralSettings,
        generalPerfume,
        setGeneralPerfume,
        getGeneralPerfume,
        saveGeneralPerfume,
        selectedSubs,
        setSelectedSubs,
      }}
    >
      {children}
    </mainContext.Provider>
  );
};

export default MainContextProvider;

// ----------------------------------------------------------------------

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
