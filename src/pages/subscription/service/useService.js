/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useService() {
  const queryClient = useQueryClient();
  const queryKeyAuth = ['authUser'];
  const queryKey = ['statusPayment'];

  const successById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.post(`/payment/success/${id}`);
        return data;
      },
      enabled: !!id,
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyAuth);
      },
    });

  const failedById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.post(`/payment/failed/${id}`);
        return data;
      },
      enabled: !!id,
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyAuth);
      },
    });

  return {
    successById,
    failedById,
  };
}
