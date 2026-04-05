/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useProduct() {
  const queryClient = useQueryClient();
  const queryKey = ['products'];
  const queryKeyAll = ['allProduct'];
  const queryKeyStatus = ['progress-status'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/product?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const listStatus = (params) =>
    useQuery({
      queryKey: [...queryKeyStatus, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/progress-label`);
        return data;
      },
      keepPreviousData: false,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/product', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
    },
  });

  const updateSorting = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/product/reorder', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/product/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/product/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/product/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
    },
  });

  return {
    list,
    listStatus,
    getById,
    create,
    updateSorting,
    update,
    remove,
    queryKey,
  };
}
