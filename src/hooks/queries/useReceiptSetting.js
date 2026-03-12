// hooks/queries/useProduct.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useReceiptSetting = (options = {}) => {
  return useQuery(
    ['receiptHeader'],
    async () => {
      const res = await axios.get('/receipt-setting');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
