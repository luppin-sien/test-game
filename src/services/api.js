/**
 * Google Apps Script API 整合服務
 */

import { config } from '../utils/config';

/**
 * 從 Google Sheets 撈取隨機題目
 * @param {string} sheetName - 工作表名稱
 * @param {number} count - 題目數量
 * @returns {Promise<Array>} 題目列表
 */
export const fetchQuestions = async (sheetName, count) => {
    try {
        // 使用 text/plain 避免觸發 CORS Preflight (OPTIONS) 請求
        const response = await fetch(config.googleAppScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                action: 'getQuestions',
                sheetName: sheetName,
                count: count,
            }),
        });

        const data = await response.json();

        console.log('API Response:', data); // 除錯用

        if (data.success) {
            // Google Apps Script 返回格式：{ success: true, data: { questions: [...] } }
            return data.data.questions;
        } else {
            throw new Error(data.error || '撈取題目失敗');
        }
    } catch (error) {
        console.error('fetchQuestions error:', error);
        throw error;
    }
};

/**
 * 提交答案並計算成績
 * @param {string} userId - 玩家 ID
 * @param {Array} answers - 答案列表 [{questionId, answer}]
 * @param {number} elapsedTime - 作答時間（秒）
 * @param {boolean} isOvertime - 是否超時
 * @returns {Promise<Object>} 成績結果
 */
export const submitAnswers = async (userId, answers, elapsedTime, isOvertime) => {
    try {
        // 使用 text/plain 避免觸發 CORS Preflight (OPTIONS) 請求
        const response = await fetch(config.googleAppScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                action: 'submitAnswers',
                userId: userId,
                answers: answers,
                elapsedTime: elapsedTime,
                isOvertime: isOvertime,
            }),
        });

        const data = await response.json();

        console.log('Submit Response:', data); // 除錯用

        if (data.success) {
            // Google Apps Script 返回格式：{ success: true, data: { score, total, passed, isFirstPass } }
            return {
                score: data.data.score,
                total: data.data.total,
                passed: data.data.passed,
                isFirstPass: data.data.isFirstPass,
                elapsedTime: elapsedTime,
                isOvertime: isOvertime,
            };
        } else {
            throw new Error(data.error || '提交答案失敗');
        }
    } catch (error) {
        console.error('submitAnswers error:', error);
        throw error;
    }
};

/**
 * 模擬 API - 用於測試（當沒有設置 Google Apps Script 時）
 */
export const mockFetchQuestions = async (sheetName, count) => {
    // 模擬網路延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockQuestions = [
        {
            id: 1,
            question: '以下哪個是 React 的核心概念？',
            optionA: '雙向綁定',
            optionB: '虛擬 DOM',
            optionC: 'MVC 架構',
            optionD: '依賴注入',
            answer: 'B'
        },
        {
            id: 2,
            question: 'JavaScript 中哪個關鍵字用於宣告常數？',
            optionA: 'var',
            optionB: 'let',
            optionC: 'const',
            optionD: 'static',
            answer: 'C'
        },
        {
            id: 3,
            question: 'CSS Flexbox 的主軸對齊屬性是？',
            optionA: 'align-items',
            optionB: 'justify-content',
            optionC: 'align-content',
            optionD: 'flex-direction',
            answer: 'B'
        },
        {
            id: 4,
            question: 'HTTP 狀態碼 404 代表什麼？',
            optionA: '伺服器錯誤',
            optionB: '未授權',
            optionC: '找不到資源',
            optionD: '請求成功',
            answer: 'C'
        },
        {
            id: 5,
            question: 'Git 中用於合併分支的指令是？',
            optionA: 'git branch',
            optionB: 'git merge',
            optionC: 'git commit',
            optionD: 'git push',
            answer: 'B'
        },
        {
            id: 6,
            question: 'Node.js 的套件管理工具是？',
            optionA: 'pip',
            optionB: 'gem',
            optionC: 'npm',
            optionD: 'composer',
            answer: 'C'
        },
        {
            id: 7,
            question: 'RESTful API 中，GET 方法的用途是？',
            optionA: '新增資料',
            optionB: '更新資料',
            optionC: '刪除資料',
            optionD: '讀取資料',
            answer: 'D'
        },
        {
            id: 8,
            question: 'async/await 是用來處理什麼的？',
            optionA: '同步操作',
            optionB: '非同步操作',
            optionC: '錯誤處理',
            optionD: '迴圈控制',
            answer: 'B'
        },
        {
            id: 9,
            question: 'localStorage 的資料會在什麼時候清除？',
            optionA: '關閉瀏覽器時',
            optionB: '關閉分頁時',
            optionC: '手動清除或清除瀏覽器資料時',
            optionD: '每次刷新頁面時',
            answer: 'C'
        },
        {
            id: 10,
            question: 'JSON 的全名是什麼？',
            optionA: 'JavaScript Object Notation',
            optionB: 'Java Standard Object Notation',
            optionC: 'JavaScript Oriented Network',
            optionD: 'Java Serialized Object Name',
            answer: 'A'
        },
    ];

    // 隨機選擇指定數量的題目
    const shuffled = mockQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, mockQuestions.length));

    // 移除答案欄位
    return selected.map(({ answer, ...question }) => question);
};

export const mockSubmitAnswers = async (userId, answers, elapsedTime, isOvertime) => {
    // 模擬網路延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模擬成績計算（隨機分數）
    const total = answers.length;
    const score = Math.floor(Math.random() * (total + 1));
    const passed = score >= config.passThreshold;

    return {
        score,
        total,
        passed,
        isFirstPass: true,
        elapsedTime, // 作答時間（秒）
        isOvertime,  // 是否超時
    };
};
