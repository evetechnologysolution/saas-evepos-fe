import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useReceiptSetting = (selectedOutlet, options = {}) => {
  return useQuery(
    ['receiptHeader', selectedOutlet],
    async () => {
      const res = await axios.get(`/receipt-setting?outletRef=${selectedOutlet}`);
      return res.data;
    },
    {
      enabled: !!selectedOutlet,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
