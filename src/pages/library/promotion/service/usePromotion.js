/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../../contexts/MainContext';

export default function usePromotion() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();
  const queryKey = ['promotions'];
  const queryKeyProduct = ['allProduct'];

  const list = (params = {}) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, params],
      queryFn: async () => {
        const { data } = await axios.get('/promotion', {
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

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/promotion', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(queryKeyProduct);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/promotion/${id}`,
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
      queryClient.invalidateQueries(queryKeyProduct);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, id],
      queryFn: async () => {
        const { data } = await axios.get(
          `/promotion/${id}`,
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
        `/promotion/${id}`,
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
      queryClient.invalidateQueries(queryKeyProduct);
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
