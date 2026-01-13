# 日式漫畫風闖關問答測驗系統

一個採用「樸拙手感、低調、但細節講究」設計理念的闖關問答測驗系統，使用 React + Vite 開發，整合 Google Sheets 作為題庫和成績記錄系統。

## ✨ 主要功能

- 🎨 日式漫畫手繪風格的 UI 設計
- 🎭 每個關卡都有獨特的關主圖片（使用 DiceBear API）
- ⏱️ 可配置的答題時限（支援倒數計時和無限時）
- 📊 成績自動記錄到 Google Sheets
- 📱 完整的響應式設計（支援桌面、平板、手機）
- ⚡ 使用 Vite 提供快速的開發體驗

---

## 📋 目錄

- [快速開始](#快速開始)
- [環境變數配置](#環境變數配置)
- [Google Sheets 設置](#google-sheets-設置)
- [Google Apps Script 設置](#google-apps-script-設置)
- [測試題目範例](#測試題目範例)
- [部署到 GitHub Pages](#部署到-github-pages)
- [常見問題](#常見問題)

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數設置

複製 `.env.example` 為 `.env`：

```bash
copy .env.example .env
```

編輯 `.env` 文件，設置以下參數：

```env
# Google Apps Script 後端連結（稍後從 Google Apps Script 取得）
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 通過門檻（需要答對幾題才算通過）
VITE_PASS_THRESHOLD=6

# 每次測驗的題目數量
VITE_QUESTION_COUNT=10

# 指定的題庫工作表名稱
VITE_QUESTION_BANK_SHEET=題庫一

# 答題時限（秒）。設為 0 則不限時，僅統計答題時長
VITE_TIME_LIMIT=300
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 運行。

### 4. 建置生產版本

```bash
npm run build
```

---

## ⚙️ 環境變數配置

| 變數名稱 | 說明 | 預設值 | 範例 |
|---------|------|--------|------|
| `VITE_GOOGLE_APP_SCRIPT_URL` | Google Apps Script 部署後的 Web App URL | 無 | `https://script.google.com/macros/s/AKfy...` |
| `VITE_PASS_THRESHOLD` | 通過門檻（需答對題數） | 6 | `6` |
| `VITE_QUESTION_COUNT` | 每次測驗的題目數量 | 10 | `10` |
| `VITE_QUESTION_BANK_SHEET` | Google Sheets 題庫工作表名稱 | 題庫一 | `題庫一` 或 `Questions` |
| `VITE_TIME_LIMIT` | 答題時限（秒），0 表示不限時 | 300 | `300`（5分鐘）或 `0`（不限時） |

---

## 📊 Google Sheets 設置

### 步驟 1：建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表，命名為「闖關問答測驗系統」

### 步驟 2：建立題庫工作表

建立一個名為 **「題庫一」** 的工作表（或您自訂的名稱），包含以下欄位：

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | 什麼是 SEO 的全名？ | Search Engine Optimization | Social Engine Optimization | Search Email Optimization | Social Email Optimization | A |
| 2 | 以下哪個不是數位行銷的常見管道？ | 社群媒體 | 電子郵件 | 傳統報紙 | 搜尋引擎 | C |

**欄位說明**：
- **題號**：題目編號（數字）
- **題目**：問題內容（文字）
- **A, B, C, D**：四個選項的內容
- **解答**：正確答案（A、B、C 或 D）

### 步驟 3：建立回答記錄工作表

建立一個名為 **「題庫一回答」** 的工作表（格式：`{題庫名稱}回答`），包含以下欄位：

| ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 第一次通關時間 | 最短通關時間 | 花了幾次通關 | 最近遊玩時間 |
|----|---------|------|--------|---------------|---------------|-------------|-------------|-------------|
| USER001 | 3 | 24 | 9 | 7 | 280 | 245 | 2 | 2026-01-13 15:30:00 |

**欄位說明**：
- **ID**：使用者 ID
- **闖關次數**：該使用者測驗的總次數
- **總分**：所有測驗的總分
- **最高分**：歷史最高分
- **第一次通關分數**：第一次達到通過門檻的分數
- **第一次通關時間**：第一次通關花費的時間（秒）
- **最短通關時間**：歷史最短通關時間（秒）
- **花了幾次通關**：第幾次測驗才通過
- **最近遊玩時間**：最後一次測驗的時間

---

## 🔧 Google Apps Script 設置

### 步驟 1：開啟 Apps Script 編輯器

1. 在您的 Google Sheets 中，點擊 **「擴充功能」** → **「Apps Script」**
2. 會開啟一個新的編輯器視窗

### 步驟 2：貼上以下代碼

刪除預設代碼，貼上以下完整的 Google Apps Script 代碼：

```javascript
/**
 * 闖關問答測驗系統 - Google Apps Script 後端
 */

// 配置
const CONFIG = {
  PASS_THRESHOLD: 6, // 通過門檻
};

/**
 * 處理 POST 請求
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'getQuestions') {
      return getQuestions(data);
    } else if (action === 'submitAnswers') {
      return submitAnswers(data);
    } else {
      return createResponse(false, null, '未知的操作');
    }
  } catch (error) {
    return createResponse(false, null, error.toString());
  }
}

/**
 * 取得隨機題目
 */
function getQuestions(data) {
  const sheetName = data.sheetName || '題庫一';
  const count = data.count || 10;
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return createResponse(false, null, `找不到工作表：${sheetName}`);
  }

  // 取得所有題目（從第 2 列開始，第 1 列是標題）
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const questions = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0] && row[1]) { // 確保有題號和題目
      questions.push({
        id: row[0],
        question: row[1],
        optionA: row[2] || '',
        optionB: row[3] || '',
        optionC: row[4] || '',
        optionD: row[5] || '',
        answer: row[6] || ''
      });
    }
  }

  // 隨機選擇題目
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, questions.length));

  // 移除答案欄位
  const questionsWithoutAnswers = selected.map(q => {
    const { answer, ...questionWithoutAnswer } = q;
    return questionWithoutAnswer;
  });

  return createResponse(true, { questions: questionsWithoutAnswers });
}

/**
 * 提交答案並計算成績
 */
function submitAnswers(data) {
  const userId = data.userId;
  const answers = data.answers;
  const elapsedTime = data.elapsedTime || 0;
  const isOvertime = data.isOvertime || false;
  const sheetName = data.sheetName || '題庫一';

  // 取得題庫
  const questionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!questionSheet) {
    return createResponse(false, null, `找不到題庫工作表：${sheetName}`);
  }

  // 建立題目答案對照表
  const questionData = questionSheet.getDataRange().getValues();
  const answerKey = {};
  for (let i = 1; i < questionData.length; i++) {
    const questionId = questionData[i][0];
    const correctAnswer = questionData[i][6];
    answerKey[questionId] = correctAnswer;
  }

  // 計算分數
  let score = 0;
  answers.forEach(item => {
    if (answerKey[item.questionId] === item.answer) {
      score++;
    }
  });

  const total = answers.length;
  const passed = score >= CONFIG.PASS_THRESHOLD;

  // 記錄成績到回答工作表
  const recordSheetName = `${sheetName}回答`;
  let recordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(recordSheetName);
  
  // 如果回答工作表不存在，建立它
  if (!recordSheet) {
    recordSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(recordSheetName);
    recordSheet.appendRow(['ID', '闖關次數', '總分', '最高分', '第一次通關分數', '第一次通關時間', '最短通關時間', '花了幾次通關', '最近遊玩時間']);
  }

  // 查找使用者記錄
  const recordData = recordSheet.getDataRange().getValues();
  let userRow = -1;
  for (let i = 1; i < recordData.length; i++) {
    if (recordData[i][0] === userId) {
      userRow = i + 1; // 轉換為 1-based 索引
      break;
    }
  }

  const now = new Date();
  let isFirstPass = false;

  if (userRow === -1) {
    // 新使用者
    const attemptCount = 1;
    const totalScore = score;
    const highestScore = score;
    const firstPassScore = passed ? score : '';
    const firstPassTime = passed ? elapsedTime : '';
    const shortestTime = passed ? elapsedTime : '';
    const timesToPass = passed ? 1 : '';
    
    isFirstPass = passed;

    recordSheet.appendRow([
      userId,
      attemptCount,
      totalScore,
      highestScore,
      firstPassScore,
      firstPassTime,
      shortestTime,
      timesToPass,
      now
    ]);
  } else {
    // 現有使用者
    const currentData = recordData[userRow - 1];
    const attemptCount = (currentData[1] || 0) + 1;
    const totalScore = (currentData[2] || 0) + score;
    const highestScore = Math.max(currentData[3] || 0, score);
    let firstPassScore = currentData[4] || '';
    let firstPassTime = currentData[5] || '';
    let shortestTime = currentData[6] || '';
    let timesToPass = currentData[7] || '';

    // 如果這是第一次通關
    if (passed && !firstPassScore) {
      firstPassScore = score;
      firstPassTime = elapsedTime;
      timesToPass = attemptCount;
      isFirstPass = true;
    }

    // 更新最短通關時間
    if (passed) {
      if (!shortestTime || elapsedTime < shortestTime) {
        shortestTime = elapsedTime;
      }
    }

    // 更新記錄
    recordSheet.getRange(userRow, 2).setValue(attemptCount);
    recordSheet.getRange(userRow, 3).setValue(totalScore);
    recordSheet.getRange(userRow, 4).setValue(highestScore);
    recordSheet.getRange(userRow, 5).setValue(firstPassScore);
    recordSheet.getRange(userRow, 6).setValue(firstPassTime);
    recordSheet.getRange(userRow, 7).setValue(shortestTime);
    recordSheet.getRange(userRow, 8).setValue(timesToPass);
    recordSheet.getRange(userRow, 9).setValue(now);
  }

  return createResponse(true, {
    score: score,
    total: total,
    passed: passed,
    isFirstPass: isFirstPass
  });
}

/**
 * 建立回應
 */
function createResponse(success, data, error) {
  const response = {
    success: success,
    data: data || {},
    error: error || null
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 步驟 3：部署為 Web 應用程式

1. 點擊右上角的 **「部署」** → **「新增部署作業」**
2. 點擊「選取類型」旁的齒輪圖示，選擇 **「網頁應用程式」**
3. 設定如下：
   - **說明**：闖關問答測驗系統 API
   - **執行身分**：我
   - **具有存取權的使用者**：任何人
4. 點擊 **「部署」**
5. 授權應用程式（第一次需要授權）
6. 複製 **「網頁應用程式 URL」**
7. 將此 URL 貼到專案的 `.env` 檔案中的 `VITE_GOOGLE_APP_SCRIPT_URL`

### 步驟 4：啟用真實 API

在 `src/App.jsx` 中，將模擬 API 改為真實 API：

```javascript
// 找到這兩行
import { mockFetchQuestions, mockSubmitAnswers } from './services/api';

// 改成
import { fetchQuestions, submitAnswers } from './services/api';

// 然後找到使用這些函數的地方並替換
// mockFetchQuestions → fetchQuestions
// mockSubmitAnswers → submitAnswers
```

---

## 📝 測試題目範例

### 行銷廣告基礎知識測試題（10 題）

以下是可以直接複製貼上到 Google Sheets 的測試題目：

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | 什麼是 SEO 的全名？ | Search Engine Optimization | Social Engine Optimization | Search Email Optimization | Social Email Optimization | A |
| 2 | 以下哪個不是數位行銷的常見管道？ | 社群媒體 | 電子郵件 | 傳統報紙 | 搜尋引擎 | C |
| 3 | CTR 代表什麼？ | Click Through Rate | Cost Total Rate | Customer Trust Rating | Click Time Ratio | A |
| 4 | 以下哪個平台主要用於 B2B 行銷？ | Instagram | TikTok | LinkedIn | Snapchat | C |
| 5 | 什麼是 CTA？ | Customer Target Analysis | Call To Action | Cost Target Allocation | Click Through Advertising | B |
| 6 | Google Ads 的廣告排名主要取決於什麼？ | 出價金額和品質分數 | 僅出價金額 | 網站流量 | 社群媒體粉絲數 | A |
| 7 | 以下哪個指標用於衡量廣告投資報酬率？ | CPM | ROI | CPC | CTR | B |
| 8 | 什麼是內容行銷的主要目的？ | 直接銷售產品 | 提供有價值的內容吸引受眾 | 增加廣告點擊 | 降低成本 | B |
| 9 | Facebook 像素（Pixel）的主要功能是什麼？ | 美化圖片 | 追蹤轉換和再行銷 | 發布貼文 | 分析競爭對手 | B |
| 10 | 以下哪個是衡量社群媒體互動的關鍵指標？ | Engagement Rate | Revenue | Profit Margin | Conversion Cost | A |

**複製說明**：
1. 選取上方表格的所有內容（包含標題列）
2. 複製（Ctrl+C）
3. 在 Google Sheets 的「題庫一」工作表中，點擊 A1 儲存格
4. 貼上（Ctrl+V）

---

## ❓ 常見問題

### Q1：為什麼頁面顯示「這是您的第一次通關」但我已經測試過很多次了？

**A**：這是因為目前使用的是模擬 API。模擬 API 不會記錄實際資料。請按照上方「Google Apps Script 設置」完成真實 API 的設置。

### Q2：如何修改通過門檻？

**A**：在 `.env` 檔案中修改 `VITE_PASS_THRESHOLD` 的值，例如改為 `7` 表示需要答對 7 題才通過。

### Q3：如何設置不限時模式？

**A**：在 `.env` 檔案中將 `VITE_TIME_LIMIT` 設為 `0`。

### Q4：可以有多個題庫嗎？

**A**：可以！只需要：
1. 在 Google Sheets 建立新的工作表（例如「題庫二」）
2. 建立對應的回答工作表（例如「題庫二回答」）
3. 修改 `.env` 中的 `VITE_QUESTION_BANK_SHEET` 為新的題庫名稱

### Q5：如何部署到網路上？

**A**：請參考下方的「部署到 GitHub Pages」章節，有完整的自動部署設定說明。

---

## 🚀 部署到 GitHub Pages

本專案已設置 GitHub Actions 自動部署流程，每次推送到 `main` 分支時會自動建置並部署到 GitHub Pages。

### 📋 前置準備

1. **建立 GitHub Repository**
   - 前往 [GitHub](https://github.com) 並登入
   - 點擊右上角的 `+` → **New repository**
   - 填寫 Repository 名稱（例如：`test-game`）
   - 選擇 **Public** 或 **Private**（程式碼公開不會洩露您的題目，因為 `.env` 已被排除）
   - 點擊 **Create repository**

2. **推送程式碼到 GitHub**
   ```bash
   # 初始化 Git（如果還沒有）
   git init
   
   # 添加所有檔案（.env 會自動被 .gitignore 排除）
   git add .
   
   # 提交
   git commit -m "Initial commit"
   
   # 連接到 GitHub（替換成您的 Repository URL）
   git remote add origin https://github.com/您的使用者名稱/test-game.git
   
   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

### ⚙️ 設置 GitHub Secrets（重要！）

為了保護您的環境變數（特別是 Google Apps Script URL），需要在 GitHub Repository 中設置 Secrets：

1. 進入您的 GitHub Repository
2. 點擊 **Settings** → **Secrets and variables** → **Actions**
3. 點擊 **New repository secret**
4. 依序新增以下 Secrets：

| Secret 名稱 | 值 | 範例 |
|------------|----|----|
| `VITE_GOOGLE_APP_SCRIPT_URL` | 您的 Google Apps Script URL | `https://script.google.com/macros/s/AKfy.../exec` |
| `VITE_PASS_THRESHOLD` | 通過門檻 | `6` |
| `VITE_QUESTION_COUNT` | 題目數量 | `10` |
| `VITE_QUESTION_BANK_SHEET` | 題庫工作表名稱 | `題庫一` |
| `VITE_TIME_LIMIT` | 答題時限（秒） | `300` 或 `0`（不限時） |

**注意**：每個 Secret 需要個別新增，Name 欄位填入 Secret 名稱，Value 欄位填入對應的值。

### 🔧 啟用 GitHub Pages

1. 在 Repository 中，進入 **Settings** → **Pages**
2. 在 **Source** 下拉選單中選擇 **GitHub Actions**
3. 完成！

### 🎉 部署流程

現在，每次您推送更改到 `main` 分支時：

```bash
# 修改程式碼後
git add .
git commit -m "描述您的更改"
git push
```

GitHub Actions 會自動：
1. ✅ 安裝依賴套件
2. ✅ 從 Secrets 注入環境變數
3. ✅ 建置專案
4. ✅ 部署到 GitHub Pages

您可以在 Repository 的 **Actions** 分頁查看部署進度。

### 🌐 訪問您的測驗網站

部署完成後，您的網站會在以下網址：

```
https://您的使用者名稱.github.io/test-game/
```

**範例**：如果您的 GitHub 使用者名稱是 `john`，Repository 名稱是 `test-game`，網址就是：
```
https://john.github.io/test-game/
```

### 📤 分享給指定的人

1. **複製部署後的網址**
2. **傳送給需要作答的人**
3. **他們打開網址** → 輸入 ID → 開始測驗
4. **成績自動記錄**到您的 Google Sheets

### 🔒 安全性說明

- ✅ **程式碼公開**：別人能看到 React 程式碼
- ✅ **資料安全**：`.env` 不會上傳，Google Apps Script URL 完全保密
- ✅ **題目安全**：題目存在您的 Google Sheets，只有您能管理
- ✅ **網址難猜**：GitHub Pages 網址不會輕易被搜尋引擎找到

### 🛠️ 手動觸發部署

如果需要手動觸發部署（不推送程式碼）：

1. 進入 Repository → **Actions**
2. 選擇 **Deploy to GitHub Pages** workflow
3. 點擊 **Run workflow** → **Run workflow**

### ⚡ 更新 Vite 配置

專案已自動設置正確的 base path，如果您的 Repository 名稱不是 `test-game`，請修改 `vite.config.js`：

```javascript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/您的Repository名稱/' : '/',
})
```

---

## 📄 授權

MIT

---

## 🙏 致謝

- 使用 [DiceBear API](https://dicebear.com/) 生成關主頭像
- 字體來源：Google Fonts（Noto Sans TC、Patrick Hand）
- 開發框架：React 18 + Vite 7
