/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useCashLog() {
  const queryClient = useQueryClient();
  const queryKey = ['listCashLog'];
  const queryKeyExist = ['existCash'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/cash-balance-history?${qs}`);
        return data;
      },
      enabled: !!params?.balanceRef,
      keepPreviousData: false,
    });

  const create = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/cash-balance-history', data);

      if (data?.cashOut) {
        await axios.post('/expense/', {
          date: new Date(),
          code: 8, // pengeluaran outlet
          description: data.title,
          amount: data.cashOut,
        });
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyExist);
    },
  });

  const closeCashier = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/cash-balance/close', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyExist);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/cash-balance-history/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyExist);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/cash-balance-history/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/cash-balance-history/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    list,
    getById,
    create,
    closeCashier,
    update,
    remove,
  };
}
