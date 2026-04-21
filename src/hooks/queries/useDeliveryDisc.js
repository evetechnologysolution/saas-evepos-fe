// hooks/queries/useCategory.js
import { useQuery } from 'react-query';
import axios from '../../utils/axios';

export const useDeliveryDisc = () => {
  return useQuery(
    ['deliveryDisc'],
    async () => {
      const res = await axios.get('/delivery-discount');
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
