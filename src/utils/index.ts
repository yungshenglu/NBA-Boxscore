import { SCHEDULE } from './hardcode';

/**
 * 設定休眠時間
 * @param {*} ms            休眠時間
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * 驗證日期格式
 * @param {string} dateString     輸入的日期文字
 */
export function validateDateFormat(dateString: string) {
  // RegExp Checking
  if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString)) {
    return false;
  }

  // Parse the date parts to integers
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return false;
  }

  let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
};

/**
 * 判斷賽事時間是否為全明星賽
 */
export function isAllStarGameDate(dateTime: string) {
  const currGameDate = dateTime.split('T')[0];
  return SCHEDULE.find(item => item.start === currGameDate) ? true : false;
}