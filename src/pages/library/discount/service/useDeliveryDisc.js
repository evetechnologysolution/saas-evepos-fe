/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useDeliveryDisc() {
  const queryClient = useQueryClient();
  const queryKey = ['deliveryDisc'];

  const getAll = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/delivery-discount/data?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const getAvailable = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/delivery-discount?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const update = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/delivery-discount', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    queryKey,
    getAll,
    getAvailable,
    update,
  };
}
