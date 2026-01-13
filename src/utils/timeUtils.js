/**
 * 時間格式化工具函數
 */

/**
 * 將秒數格式化為 MM:SS 格式
 * @param {number} seconds - 秒數
 * @returns {string} 格式化後的時間字串
 */
export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 將秒數格式化為中文描述
 * @param {number} seconds - 秒數
 * @returns {string} 中文格式的時間描述
 */
export const formatTimeText = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins === 0) {
        return `${secs} 秒`;
    } else if (secs === 0) {
        return `${mins} 分鐘`;
    } else {
        return `${mins} 分 ${secs} 秒`;
    }
};
