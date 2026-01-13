import { noCase } from 'change-case';
// _mock
import _mock from './_mock';
import { randomNumberRange, randomInArray } from './funcs';

// ----------------------------------------------------------------------

export const _appRelated = ['Chrome', 'Drive', 'Dropbox', 'Evernote', 'Github'].map((appName, index) => ({
  id: _mock.id(index),
  name: appName,
  system: (index === 2 && 'Windows') || (index === 4 && 'Windows') || 'Mac',
  price: index === 0 || index === 2 || index === 4 ? 0 : _mock.number.price(index),
  rating: _mock.number.rating(index),
  review: randomNumberRange(999, 99999),
  shortcut: `https://minimal-assets-api-dev.vercel.app/assets/icons/ic_${noCase(appName)}.svg`,
}));

export const _appInstalled = ['de', 'en', 'fr', 'kr', 'us'].map((country, index) => ({
  id: _mock.id(index),
  name: ['Germany', 'England', 'France', 'Korean', 'USA'][index],
  android: randomNumberRange(999, 99999),
  windows: randomNumberRange(999, 99999),
  apple: randomNumberRange(999, 99999),
  flag: `/assets/icons/flags/ic_flag_${country}.svg`,
}));

export const _appAuthors = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  favourite: randomNumberRange(9999, 19999),
}));

export const _appInvoices = [...Array(6)].map((_, index) => ({
  id: `${1 + index}`,
  date: randomInArray(['01-04-2022', '02-04-2022', '03-04-2022', '04-04-2022', '05-04-2022', '05-04-2022']),
  orderId: randomInArray([
    '238b8bd6-aa1d-443f-ba9a-e5e213c536d8',
    '238b8bd6-aa1d-443f-ba9a-e5e213c536d8',
    '238b8bd6-aa1d-443f-ba9a-e5e213c536d8',
    '238b8bd6-aa1d-443f-ba9a-e5e213c536d8',
    '238b8bd6-aa1d-443f-ba9a-e5e213c536d8',
    '238b8bd6-aa1d-443f-ba9a-e5e213c536d8',
  ]),
  orderType: randomInArray(['Dine In', 'Dine In', 'Dine In', 'Dine In', 'Dine In', 'Order Online']),
  total: randomInArray([1050000, 1050000, 1050000, 1050000, 1050000, 200000]),
  paymentMethod: randomInArray(['Cash', 'Cash', 'Cash', 'Cash', 'Cash', 'OVO']),
}));

export const _appFeatured = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  title: ['Harry Potter and the Deathly Hallows - Part 2', 'Disney Zombies 2', 'Lightroom mobile - Koloro'][index],
  description: _mock.text.title(index),
  image: _mock.image.feed(index),
}));
