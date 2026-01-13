/**
 * 關主圖片管理服務
 * 使用 DiceBear API 生成 100 張不同的頭像
 */

const DICEBEAR_STYLES = ['adventurer', 'avataaars', 'personas'];
const TOTAL_AVATARS = 100;

/**
 * 生成頭像 URL 列表
 * @returns {Array<string>} 頭像 URL 陣列
 */
export const generateAvatarUrls = () => {
    const avatars = [];
    const style = 'adventurer'; // 使用 adventurer 風格，較接近手繪感

    for (let i = 0; i < TOTAL_AVATARS; i++) {
        // 使用不同的 seed 生成不同的頭像
        const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${i}&backgroundColor=f5f1e8`;
        avatars.push(url);
    }

    return avatars;
};

/**
 * 預載所有頭像
 * @returns {Promise<Array<string>>} 預載完成的頭像 URL
 */
export const preloadAvatars = async () => {
    const avatarUrls = generateAvatarUrls();

    // 預載圖片（創建 Image 物件）
    const promises = avatarUrls.map(url => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(url); // 即使失敗也繼續
            img.src = url;
        });
    });

    await Promise.all(promises);
    return avatarUrls;
};

/**
 * 根據關卡索引獲取頭像 URL
 * @param {number} questionIndex - 題目索引（從 0 開始）
 * @param {Array<string>} avatarUrls - 頭像 URL 陣列
 * @returns {string} 頭像 URL
 */
export const getAvatarForQuestion = (questionIndex, avatarUrls) => {
    if (!avatarUrls || avatarUrls.length === 0) {
        return generateAvatarUrls()[0];
    }

    // 使用索引取得對應的頭像
    const index = questionIndex % avatarUrls.length;
    return avatarUrls[index];
};

/**
 * 直接生成單個頭像 URL（不需預載）
 * @param {number} questionIndex - 題目索引
 * @returns {string} 頭像 URL
 */
export const getAvatarUrl = (questionIndex) => {
    const style = 'adventurer';
    const seed = questionIndex % TOTAL_AVATARS;
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=f5f1e8`;
};
