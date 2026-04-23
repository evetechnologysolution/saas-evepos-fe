/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useOrder() {
  const queryClient = useQueryClient();
  const queryKey = ['orders'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/order?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/order/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/order', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/order/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/order/${id}`);
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
    update,
    remove,
    queryKey,
  };
}
