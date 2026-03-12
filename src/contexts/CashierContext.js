import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isTuesday } from 'date-fns';
import axios from '../utils/axios';
import { useLocalStorage } from '../utils/getData';
// dummyData
import { tableNameData } from '../dummyData';

export const cashierContext = createContext({
  isLaundryBagDay: false,
  orderDate: '',
  setOrderDate: () => {},
  currentOrderID: '',
  setCurrentOrderID: () => {},
  displayOrderID: '',
  setDisplayOrderID: () => {},
  pax: 1,
  setPax: () => {},
  qrKey: '',
  setQrKey: () => {},
  savedOrders: [],
  setSavedOrders: () => {},
  progress: [],
  setProgress: () => {},
  bill: [],
  setBill: () => {},
  splitBill: [],
  setSplitBill: () => {},
  savedBillID: '',
  setSavedBillID: () => {},
  savedBill: [],
  setSavedBill: () => {},
  selectedBill: '',
  setSelectedBill: () => {},
  updatedBill: [],
  setUpdatedBill: () => {},
  selectedTable: null,
  setSelectedTable: () => {},
  orderType: '',
  setOrderType: () => {},
  pickupData: {},
  setPickupData: () => {},
  customerData: {},
  setCustomerData: () => {},
  customerName: '',
  setCustomerName: () => {},
  customerPhone: '',
  setCustomerPhone: () => {},
  customerNotes: '',
  setCustomerNotes: () => {},
  customerNew: false,
  setCustomerNew: () => {},
  customerScan: false,
  setCustomerScan: () => {},
  customerPoint: 0,
  setCustomerPoint: () => {},
  voucherCode: '',
  setVoucherCode: () => {},
  // getSavedBill: () => { },
  listTable: [],
  setListTable: () => {},
  qrdata: [],
  setQrdata: () => {},
  getQrdata: () => {},
  createQrdata: () => {},
  updateQrdata: () => {},
  deleteQrdata: () => {},
  orders: [],
  setOrders: () => {},
  getOrders: () => {},
  createOrders: () => {},
  updateOrders: () => {},
  updatePrintCount: () => {},
  updatePrintLaundry: () => {},
  deleteOrders: () => {},
  createReservation: () => {},
  updateReservation: () => {},
  deleteReservation: () => {},
  paymentMethod: '',
  setPaymentMethod: () => {},
  cardNumber: '',
  setCardNumber: () => {},
  notes: '',
  setNotes: () => {},
  dp: 0,
  setDp: () => {},
  deliveryPrice: 0,
  setDeliveryPrice: () => {},
  donation: 0,
  setDonation: () => {},
  discount: 0,
  setDiscount: () => {},
  discountPrice: 0,
  setDiscountPrice: () => {},
  discountLabel: '',
  setDiscountLabel: () => {},
  voucherDiscPrice: 0,
  setVoucherDiscPrice: () => {},
  splitServiceCharge: 0,
  setSplitServiceCharge: () => {},
  serviceCharge: 0,
  setServiceCharge: () => {},
  serviceChargePercentage: 0,
  setServiceChargePercentage: () => {},
  splitTax: 0,
  setSplitTax: () => {},
  tax: 0,
  setTax: () => {},
  taxPercentage: 0,
  setTaxPercentage: () => {},
  subtotalPrice: 0,
  setSubtotalPrice: () => {},
  actualPrice: 0,
  setActualPrice: () => {},
  havePaid: 0,
  setHavePaid: () => {},
  totalPrice: 0,
  productionAmount: 0,
  setProductionAmount: () => {},
  splitAmount: 0,
  setSplitAmount: () => {},
  amountBill: 0,
  setAmountBill: () => {},
  amountPaid: 0,
  setAmountPaid: () => {},
  taxSetting: {},
  setTaxSetting: () => {},
  globalDisc: {},
  setGlobalDisc: () => {},
  getGlobalDisc: () => {},
  updateGlobalDisc: () => {},
  isSaved: false,
  setIsSaved: () => {},
  isFinished: false,
  setIsFinished: () => {},
  handleResetPos: () => {},
});

const CashierContextProvider = ({ children }) => {
  // Pos State
  const today = new Date();
  const isLaundryBagDay = isTuesday(today);
  const [orderDate, setOrderDate] = useState(today);
  const [currentOrderID, setCurrentOrderID] = useState('');
  const [displayOrderID, setDisplayOrderID] = useState('');
  const [pax, setPax] = useState(1);
  const [qrKey, setQrKey] = useState('');
  const [savedOrders, setSavedOrders] = useLocalStorage('savedOrders', []);
  const [progress, setProgress] = useState([]);
  const [bill, setBill] = useState([]);
  const [splitBill, setSplitBill] = useState([]);
  const [savedBillID, setSavedBillID] = useState('');
  const [savedBill, setSavedBill] = useLocalStorage('savedBill', []);
  const [selectedBill, setSelectedBill] = useState('');
  const [updatedBill, setUpdatedBill] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderType, setOrderType] = useState('onsite');
  const [pickupData, setPickupData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [customerNew, setCustomerNew] = useState(false);
  const [customerScan, setCustomerScan] = useState(false);
  const [customerPoint, setCustomerPoint] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [listTable, setListTable] = useState(tableNameData);
  const [qrdata, setQrdata] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [taxSetting, setTaxSetting] = useState({});
  const [globalDisc, setGlobalDisc] = useState({});

  const [dp, setDp] = useState(0);
  const [discByPrice, setDiscByPrice] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const [voucherDiscPrice, setVoucherDiscPrice] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [donation, setDonation] = useState(0);
  const [splitServiceCharge, setSplitServiceCharge] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [serviceChargePercentage, setServiceChargePercentage] = useState(0);
  const [splitTax, setSplitTax] = useState(0);
  const [tax, setTax] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [subtotalPrice, setSubtotalPrice] = useState(0);
  const [actualPrice, setActualPrice] = useState(0);
  const [havePaid, setHavePaid] = useState(0);
  const totalPrice = actualPrice - havePaid;
  const [productionAmount, setProductionAmount] = useState(0);

  useEffect(() => {
    const sumPrice = bill.reduce((acc, item) => {
      const tot = Math.round(item.price * item.qty);
      if (item.promotionType === 1) {
        return acc + (tot - (tot * item.discountAmount) / 100);
      }
      if (item.promotionType === 2) {
        return acc + (tot - item.discountAmount);
      }
      return acc + tot;
    }, 0);

    const sumProductionPrice = bill.reduce((acc, i) => {
      return acc + Math.round((i?.productionPrice || 0) * i.qty);
    }, 0);

    setProductionAmount(sumProductionPrice);
    let fixDiscPrice = sumPrice * (discount / 100);
    // first wash
    const isFirst = discountLabel === 'FIRST WASH';
    const minFirstBilled = 40000;
    const maxFirstDiscPrice = 30000;
    const firstDisc = 50;
    if (isFirst && sumPrice >= minFirstBilled) {
      const checkFirstDiscPrice = sumPrice * (firstDisc / 100);
      if (checkFirstDiscPrice > maxFirstDiscPrice) {
        fixDiscPrice = maxFirstDiscPrice;
      } else {
        fixDiscPrice = sumPrice * (firstDisc / 100);
      }
    }

    if (discByPrice) {
      fixDiscPrice = discountPrice;
    }
    setDiscountPrice(fixDiscPrice);

    let serviceAmount = 0;
    let taxAmount = 0;
    const taxFor = orderType?.toLowerCase() === 'delivery' ? 'delivery' : 'onsite';

    if (taxSetting?.serviceCharge?.isActive && taxSetting?.serviceCharge?.orderType.includes(taxFor)) {
      serviceAmount = Math.ceil((taxSetting?.serviceCharge?.percentage * sumPrice) / 100);
      setServiceCharge(Math.ceil((taxSetting?.serviceCharge?.percentage * sumPrice) / 100));
      setServiceChargePercentage(taxSetting?.serviceCharge?.percentage);
    }

    if (taxSetting?.tax?.isActive && taxSetting?.tax?.orderType.includes(taxFor)) {
      taxAmount = Math.ceil((taxSetting.tax?.percentage * (sumPrice + serviceAmount)) / 100);
      setTax(Math.ceil((taxSetting.tax?.percentage * (sumPrice + serviceAmount)) / 100));
      setTaxPercentage(taxSetting?.tax?.percentage);
    }

    setSubtotalPrice(sumPrice);
    setActualPrice(sumPrice + serviceAmount + taxAmount - voucherDiscPrice - fixDiscPrice + deliveryPrice);
  }, [bill, orderType, voucherDiscPrice, discount, discountPrice, discByPrice, deliveryPrice, discountLabel]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [splitAmount, setSplitAmount] = useState(0);
  const [amountBill, setAmountBill] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  // for Saved Bill
  // const getSavedBill = async () => {
  //     try {
  //         await axios.get("/order/saved-bill").then((response) => {
  //             setSavedBill(response.data);
  //         });
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  // for Orders
  const getOrders = async () => {
    try {
      await axios.get('/order/').then((response) => {
        setOrders(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createOrders = async (data, isLocal = false) => {
    try {
      const res = await axios.post('/order', data);

      if (res.status === 200) {
        // refresh order list
        getOrders();

        if (isLocal === true) {
          setSavedOrders([]);
        }
      }

      return res;
    } catch (error) {
      // console.error(error);
      console.log('Connection failed, data saved to local storage.');

      if (isLocal === false) {
        setSavedOrders((current) => [...current, data]);
      }
    }
  };

  const updateOrders = async (id, data) => {
    try {
      const res = await axios.patch(`/order/${id}`, data);

      if (res.status === 200) {
        // refresh order list
        getOrders();
      }

      return res;
    } catch (error) {
      console.error(error);

      setSavedOrders((current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,
                customer: data.customer,
                orders: data.orders,
                status: data.status ? data.status : item.status,
                havePaid: data?.havePaid || 0,
                discount: data?.discount || 0,
                discountPrice: data?.discountPrice || 0,
                voucherDiscPrice: data?.voucherDiscPrice || 0,
                billedAmount: data.billedAmount,
                payment: data.payment ? data.payment : item.payment,
                cardNumber: data.cardNumber ? data.cardNumber : item.cardNumber,
                notes: data.notes ? data.notes : item.notes,
              }
            : item
        )
      );
    }
  };

  const updatePrintCount = async (id, data) => {
    try {
      await axios.patch(`/order/print-count/${id}`, data);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePrintLaundry = async (id, data) => {
    try {
      await axios.patch(`/order/print-laundry/${id}`, data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrders = async (id) => {
    try {
      await axios.delete(`/order/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // for reservation
  const createReservation = async (data) => {
    try {
      await axios.post('/reservations/create', data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateReservation = async (id, data) => {
    try {
      await axios.patch(`/reservations/${id}`, data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`/reservations/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // for Qrdata
  const getQrdata = async () => {
    try {
      await axios.get('/qrdata').then((response) => {
        setQrdata(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createQrdata = async (data) => {
    let res;
    try {
      await axios.post('/qrdata/create', data).then((response) => {
        if (response.status === 200) {
          getQrdata();
          res = response;
        }
      });
    } catch (error) {
      console.error(error);
    }
    return res;
  };

  const updateQrdata = async (id, data) => {
    try {
      await axios.patch(`/qrdata/${id}`, data).then((response) => {
        if (response.status === 200) {
          getQrdata();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQrdata = async (id) => {
    try {
      await axios.delete(`/qrdata/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const getTaxSetting = async () => {
    try {
      await axios.get('/tax').then((response) => {
        setTaxSetting(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaxSetting = async (data) => {
    try {
      await axios.post('/tax', data);
      getTaxSetting();
    } catch (error) {
      console.error(error);
    }
  };

  // const getGlobalDisc = async () => {
  //   try {
  //     await axios.get('/discount/data').then((response) => {
  //       setGlobalDisc(response.data);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const updateGlobalDisc = async (data) => {
    try {
      await axios.post('/discount', data);
      // getGlobalDisc();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTaxSetting();
    // getGlobalDisc();
  }, []);

  const handleResetAfterSave = () => {
    setOrderDate(new Date());
    setCurrentOrderID('');
    setDisplayOrderID('');
    setPax(1);
    setQrKey('');
    setProgress([]);
    setBill([]);
    setSplitBill([]);
    setSavedBillID('');
    setSelectedTable(null);
    setOrderType('onsite');
    setDp(0);
    setDeliveryPrice(0);
    setDonation(0);
    setDiscByPrice(false);
    setDiscount(0);
    setDiscountPrice(0);
    setDiscountLabel('');
    setVoucherDiscPrice(0);
    setSplitServiceCharge(0);
    setServiceCharge(0);
    setServiceChargePercentage(0);
    setSplitTax(0);
    setTax(0);
    setTaxPercentage(0);
    setSubtotalPrice(0);
    setActualPrice(0);
    setHavePaid(0);
    setProductionAmount(0);
    setSplitAmount(0);
    setPaymentMethod('');
    setAmountBill(0);
    setAmountPaid(0);
    setCardNumber('');
    setNotes('');
    setPickupData({});
    setCustomerData({});
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNotes('');
    setCustomerNew(false);
    setCustomerScan(false);
    setCustomerPoint(0);
    setVoucherCode('');
  };

  const handleResetPos = () => {
    handleResetAfterSave();
    setIsSaved(false);
    setIsFinished(false);
  };

  return (
    <cashierContext.Provider
      value={{
        isLaundryBagDay,
        orderDate,
        setOrderDate,
        currentOrderID,
        setCurrentOrderID,
        displayOrderID,
        setDisplayOrderID,
        pax,
        setPax,
        qrKey,
        setQrKey,
        savedOrders,
        setSavedOrders,
        progress,
        setProgress,
        bill,
        setBill,
        splitBill,
        setSplitBill,
        savedBillID,
        setSavedBillID,
        savedBill,
        setSavedBill,
        selectedBill,
        setSelectedBill,
        updatedBill,
        setUpdatedBill,
        selectedTable,
        setSelectedTable,
        // getSavedBill,
        orderType,
        setOrderType,
        pickupData,
        setPickupData,
        customerData,
        setCustomerData,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        customerNotes,
        setCustomerNotes,
        customerNew,
        setCustomerNew,
        customerScan,
        setCustomerScan,
        customerPoint,
        setCustomerPoint,
        voucherCode,
        setVoucherCode,
        listTable,
        setListTable,
        qrdata,
        setQrdata,
        getQrdata,
        createQrdata,
        updateQrdata,
        deleteQrdata,
        orders,
        setOrders,
        getOrders,
        createOrders,
        updateOrders,
        updatePrintCount,
        updatePrintLaundry,
        deleteOrders,
        createReservation,
        updateReservation,
        deleteReservation,
        paymentMethod,
        setPaymentMethod,
        cardNumber,
        setCardNumber,
        notes,
        setNotes,
        dp,
        setDp,
        deliveryPrice,
        setDeliveryPrice,
        donation,
        setDonation,
        discByPrice,
        setDiscByPrice,
        discount,
        setDiscount,
        discountPrice,
        setDiscountPrice,
        discountLabel,
        setDiscountLabel,
        voucherDiscPrice,
        setVoucherDiscPrice,
        splitServiceCharge,
        setSplitServiceCharge,
        serviceCharge,
        setServiceCharge,
        serviceChargePercentage,
        setServiceChargePercentage,
        splitTax,
        setSplitTax,
        tax,
        setTax,
        taxPercentage,
        setTaxPercentage,
        subtotalPrice,
        setSubtotalPrice,
        actualPrice,
        setActualPrice,
        havePaid,
        setHavePaid,
        productionAmount,
        setProductionAmount,
        totalPrice,
        splitAmount,
        setSplitAmount,
        amountBill,
        setAmountBill,
        amountPaid,
        setAmountPaid,
        taxSetting,
        setTaxSetting,
        getTaxSetting,
        updateTaxSetting,
        globalDisc,
        setGlobalDisc,
        // getGlobalDisc,
        updateGlobalDisc,
        isSaved,
        setIsSaved,
        isFinished,
        setIsFinished,
        handleResetPos,
      }}
    >
      {children}
    </cashierContext.Provider>
  );
};
export default CashierContextProvider;

// ----------------------------------------------------------------------

CashierContextProvider.propTypes = {
  children: PropTypes.node,
};
