/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useReceiptSetting() {
  const queryClient = useQueryClient();
  const queryKey = ['receiptHeader'];

  const getReceiptHeader = () =>
    useQuery({
      queryKey,
      queryFn: async () => {
        const { data } = await axios.get('/receipt-setting');
        return data;
      },
    });

  const update = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/receipt-setting', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    getReceiptHeader,
    update,
  };
}
