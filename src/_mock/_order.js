import _mock from './_mock';

export const _order = [...Array(6)].map((_, index) => ({
  id: _mock.order.id(index),
  date: _mock.order.date(index),
  time: _mock.order.time(index),
  table: _mock.order.table(index),
  order: _mock.order.order(index),
  totalPrice: _mock.order.totalPrice(index),
  status: _mock.order.status(index),
}));
