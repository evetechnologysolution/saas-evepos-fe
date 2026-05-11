/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useGeneralSetting() {
  const queryClient = useQueryClient();
  const queryKeyAll = ['allTaxSetting'];
  const queryKey = ['taxSetting'];

  const getDataSetting = (params = {}) =>
    useQuery({
      queryKey: [...queryKeyAll, params],
      queryFn: async () => {
        const { data } = await axios.get('/tax', { params });
        return data;
      },
    });

  const update = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/tax', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeyAll);
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    getDataSetting,
    update,
  };
}
