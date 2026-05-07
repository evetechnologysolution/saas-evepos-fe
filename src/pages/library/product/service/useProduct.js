/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../../contexts/MainContext';

export default function useProduct() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();
  const queryKey = ['products'];
  const queryKeyAll = ['allProduct'];
  const queryKeyStatus = ['progress-status'];

  const list = (params = {}) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, params],
      queryFn: async () => {
        const { data } = await axios.get('/product', {
          params: {
            outletRef: ctm?.selectedOutlet,
            ...params,
          },
        });
        return data;
      },
      enabled: !!ctm?.selectedOutlet,
      keepPreviousData: false,
    });

  const listStatus = (params = {}) =>
    useQuery({
      queryKey: [...queryKeyStatus, params],
      queryFn: async () => {
        const { data } = await axios.get('/progress-label', {
          params,
        });
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
      const { data } = await axios.post(
        '/product/reorder',
        payload,
        {
          params: {
            outletRef: ctm?.selectedOutlet,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/product/${id}`,
        payload,
        {
          params: {
            outletRef: ctm?.selectedOutlet,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyAll);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, id],
      queryFn: async () => {
        const { data } = await axios.get(
          `/product/${id}`,
          {
            params: {
              outletRef: ctm?.selectedOutlet,
            },
          }
        );
        return data;
      },
      enabled: !!id && !!ctm?.selectedOutlet,
    });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `/product/${id}`,
        {
          params: {
            outletRef: ctm?.selectedOutlet,
          },
        }
      );
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
