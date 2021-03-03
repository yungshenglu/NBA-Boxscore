/**
 * 球員位置
 * 0: 前鋒 (F)
 * 1: 中鋒 (C)
 * 2: 後衛 (G)
 */
export const PLAYER_POSITION = [
  {
    key: '0',
    value: 'F',
    name: '前鋒',
    color: ''
  },
  {
    key: '1',
    value: 'C',
    name: '中鋒',
    color: ''
  },
  {
    key: '2',
    value: 'G',
    name: '後衛',
    color: ''
  }
];

/**
 * 賽事狀態
 * 0: 尚未進行
 * 1: 進行中
 * 2: 結束
 * 3: 延期
 */
export const MATCH_STATUS = [
  {
    key: '0',
    value: '1',
    name: '尚未進行',
    color: 'blue'
  },
  {
    key: '1',
    value: '2',
    name: '進行中',
    color: 'red'
  },
  {
    key: '2',
    value: '3',
    name: '結束',
    color: 'black'
  },
  {
    key: '3',
    value: '',
    name: '延期',
    color: 'brown'
  }
];