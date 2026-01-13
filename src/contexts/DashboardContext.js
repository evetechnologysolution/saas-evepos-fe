import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../utils/axios';

export const dashboardContext = createContext({
  fetchDataReport: () => { },
  today: {},
  setToday: () => { },
  thisWeek: {},
  setThisWeek: () => { },
  thisMonth: {},
  setThisMonth: () => { },
  thisYear: {},
  setThisYear: () => { },
  salesThisWeek: [],
  setSalesThisWeek: () => { },
  salesThisMonth: [],
  setSalesThisMonth: () => { },
  salesMonthly: [],
  setSalesMonthly: () => { },
  paymentRevenueToday: {},
  setPaymentRevenueToday: () => { },
  paymentRevenueThisWeek: {},
  setPaymentRevenueThisWeek: () => { },
  paymentRevenueThisMonth: {},
  setPaymentRevenueThisMonth: () => { },
  paymentRevenueThisYear: {},
  setPaymentRevenueThisYear: () => { },
  popularToday: {},
  setPopularToday: () => { },
  popularThisWeek: {},
  setPopularThisWeek: () => { },
  popularThisMonth: {},
  setPopularThisMonth: () => { },
  popularThisYear: {},
  setPopularThisYear: () => { },
});

const DashboardContextProvider = ({ children }) => {
  const [today, setToday] = useState({});
  const [thisWeek, setThisWeek] = useState({});
  const [thisMonth, setThisMonth] = useState({});
  const [thisYear, setThisYear] = useState({});
  const [salesThisWeek, setSalesThisWeek] = useState([]);
  const [salesThisMonth, setSalesThisMonth] = useState([]);
  const [salesMonthly, setSalesMonthly] = useState([]);
  const [paymentRevenueToday, setPaymentRevenueToday] = useState({});
  const [paymentRevenueThisWeek, setPaymentRevenueThisWeek] = useState({});
  const [paymentRevenueThisMonth, setPaymentRevenueThisMonth] = useState({});
  const [paymentRevenueThisYear, setPaymentRevenueThisYear] = useState({});
  const [popularToday, setPopularToday] = useState({});
  const [popularThisWeek, setPopularThisWeek] = useState({});
  const [popularThisMonth, setPopularThisMonth] = useState({});
  const [popularThisYear, setPopularThisYear] = useState({});

  const fetchDataReport = async () => {
    try {
      const [
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        revenueThisYear,
        salesWeek,
        salesMonth,
        salesMonthlyData,
        paymentToday,
        paymentWeek,
        paymentMonth,
        paymentYear,
        popularTodayData,
        popularWeek,
        popularMonth,
        popularYear
      ] = await Promise.all([
        axios.get('/report/revenue/today'),
        axios.get('/report/revenue/this-week'),
        axios.get('/report/revenue/this-month'),
        axios.get('/report/revenue/this-year'),
        axios.get('/report/sales/this-week'),
        axios.get('/report/sales/this-month'),
        axios.get('/report/sales/monthly'),
        axios.get('/report/revenue-overview/today'),
        axios.get('/report/revenue-overview/this-week'),
        axios.get('/report/revenue-overview/this-month'),
        axios.get('/report/revenue-overview/this-year'),
        axios.get('/report/popular/today'),
        axios.get('/report/popular/this-week'),
        axios.get('/report/popular/this-month'),
        axios.get('/report/popular/this-year'),
      ]);

      setToday(revenueToday.data[0]);
      setThisWeek(revenueThisWeek.data[0]);
      setThisMonth(revenueThisMonth.data[0]);
      setThisYear(revenueThisYear.data[0]);
      setSalesThisWeek(salesWeek.data);
      setSalesThisMonth(salesMonth.data);
      setSalesMonthly(salesMonthlyData.data);
      setPaymentRevenueToday(paymentToday.data[0]);
      setPaymentRevenueThisWeek(paymentWeek.data[0]);
      setPaymentRevenueThisMonth(paymentMonth.data[0]);
      setPaymentRevenueThisYear(paymentYear.data[0]);
      setPopularToday(popularTodayData.data[0]);
      setPopularThisWeek(popularWeek.data[0]);
      setPopularThisMonth(popularMonth.data[0]);
      setPopularThisYear(popularYear.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   fetchDataReport();
  // }, []);

  return (
    <dashboardContext.Provider
      value={{
        fetchDataReport,
        today,
        setToday,
        thisWeek,
        setThisWeek,
        thisMonth,
        setThisMonth,
        thisYear,
        setThisYear,
        salesThisWeek,
        setSalesThisWeek,
        salesThisMonth,
        setSalesThisMonth,
        salesMonthly,
        setSalesMonthly,
        paymentRevenueToday,
        setPaymentRevenueToday,
        paymentRevenueThisWeek,
        setPaymentRevenueThisWeek,
        paymentRevenueThisMonth,
        setPaymentRevenueThisMonth,
        paymentRevenueThisYear,
        setPaymentRevenueThisYear,
        popularToday,
        setPopularToday,
        popularThisWeek,
        setPopularThisWeek,
        popularThisMonth,
        setPopularThisMonth,
        popularThisYear,
        setPopularThisYear,
      }}
    >
      {children}
    </dashboardContext.Provider>
  );
};

DashboardContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardContextProvider;
