/**
 * 設定休眠時間
 * @param {*} ms            休眠時間
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};