const categories = [
  {
    _id: 1,
    name: '액션',
  },
  {
    _id: 2,
    name: '아케이드',
  },
  {
    _id: 3,
    name: '어드벤처',
  },
  {
    _id: 4,
    name: 'RPG',
  },
  {
    _id: 5,
    name: '레이싱',
  },
  {
    _id: 6,
    name: '시뮬레이션',
  },
  {
    _id: 7,
    name: '스포츠',
  },
];

const price = [
  {
    _id: 0,
    name: 'Any',
    array: [],
  },
  {
    _id: 1,
    name: '0 ~ 2만원 미만',
    array: [0, 19990],
  },
  {
    _id: 2,
    name: '2만원 이상 ~ 4만원 미만',
    array: [20000, 39990],
  },
  {
    _id: 3,
    name: '4만원 이상 ~ 6만원 미만',
    array: [40000, 59990],
  },
  {
    _id: 4,
    name: '6만원 이상',
    array: [60000, 999999],
  },
];

export { categories, price };
