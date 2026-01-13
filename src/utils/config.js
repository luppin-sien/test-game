/**
 * 環境變數配置管理
 * 從 .env 載入並提供預設值
 */

export const config = {
  // Google Apps Script 後端 URL
  googleAppScriptUrl: import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL || '',

  // 通過門檻
  passThreshold: parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 6,

  // 題目數量
  questionCount: parseInt(import.meta.env.VITE_QUESTION_COUNT) || 10,

  // 題庫工作表名稱
  questionBankSheet: import.meta.env.VITE_QUESTION_BANK_SHEET || '題庫一',

  // 答題時限（秒），0 表示不限時
  timeLimit: parseInt(import.meta.env.VITE_TIME_LIMIT) || 0,
};

/**
 * 驗證配置是否完整
 */
export const validateConfig = () => {
  const errors = [];

  if (!config.googleAppScriptUrl) {
    errors.push('缺少 VITE_GOOGLE_APP_SCRIPT_URL 環境變數');
  }

  if (config.passThreshold < 1) {
    errors.push('通過門檻必須大於 0');
  }

  if (config.questionCount < 1) {
    errors.push('題目數量必須大於 0');
  }

  if (config.passThreshold > config.questionCount) {
    errors.push('通過門檻不能大於題目數量');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
