/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';
// context
import { mainContext } from '../../../contexts/MainContext';

export default function useOrder() {
  const ctm = useContext(mainContext);
  const queryClient = useQueryClient();
  const queryKey = ['transferOrders'];

  const list = (params = {}) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, params],
      queryFn: async () => {
        const { data } = await axios.get('/order', {
          params: {
            outletRef: ctm?.selectedOutlet,
            isTransfer: "yes",
            ...params,
          },
        });

        return data;
      },
      enabled: !!ctm?.selectedOutlet,
      keepPreviousData: false,
    });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, ctm?.selectedOutlet, id],
      queryFn: async () => {
        const { data } = await axios.get(
          `/order/${id}`,
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

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        '/order',
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
    },
  });

  const generatePoint = useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await axios.patch(
        `/order/generate-point/${id}`, null, {
        params: {
          outletRef: ctm?.selectedOutlet,
        },
      }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/order/${id}`,
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
    },
  });

  const updateRaw = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/order/raw/${id}`,
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
    },
  });

  const updatePrintReceipt = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/order/print-count/${id}`,
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
    },
  });

  const updatePrintLaundry = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(
        `/order/print-laundry/${id}`,
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
    },
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `/order/${id}`,
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
    },
  });

  return {
    list,
    getById,
    create,
    update,
    generatePoint,
    updateRaw,
    updatePrintReceipt,
    updatePrintLaundry,
    remove,
    queryKey,
  };
}
