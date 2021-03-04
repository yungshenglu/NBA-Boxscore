/**
 * API 網址
 * 0: 當日所有賽事
 * 1: 該廠賽事紀錄
 * 2: 球隊隊徽 
 */
export const API_URL = [
  {
    key: '0',
    name: 'matches',
    url: 'https://tw.global.nba.com/stats2/scores/daily.json?countryCode=TW&gameDate={gameDate}&locale=zh_TW'
  },
  {
    key: '1',
    name: 'snapshot',
    url: 'https://tw.global.nba.com/stats2/game/snapshot.json?countryCode=TW&gameId={gameId}&locale=zh_TW&tz=%2B8'
  },
  {
    key: '2',
    name: 'logo',
    url: 'https://tw.global.nba.com/media/img/teams/00/logos/{teamCode}_logo.svg'
  }
];

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

/**
 * 球隊組別
 */
export const DIVISION = [
  {
    key: 'Atlantic',
    name: '大西洋組'
  },
  {
    key: 'Central',
    name: '中央組'
  },
  {
    key: 'Southeast',
    name: '東南組'
  },
  {
    key: 'Northwest',
    name: '西北組'
  },
  {
    key: 'Pacific',
    name: '太平洋組'
  },
  {
    key: 'Southwest',
    name: '西南組'
  }
];