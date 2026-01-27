/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function usePromotion() {
  const queryClient = useQueryClient();
  const queryKey = ['promotions'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/promotion?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/promotion', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/promotion/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/promotion/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/promotion/${id}`);
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
