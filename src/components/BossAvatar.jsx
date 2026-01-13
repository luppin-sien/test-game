import { getAvatarUrl } from '../services/avatarService';
import './BossAvatar.css';

/**
 * 關主頭像組件
 * @param {number} questionIndex - 題目索引
 * @param {number} questionNumber - 題目編號（顯示用）
 */
const BossAvatar = ({ questionIndex, questionNumber }) => {
    const avatarUrl = getAvatarUrl(questionIndex);

    return (
        <div className="boss-avatar-container">
            <div className="avatar-frame">
                <img src={avatarUrl} alt={`關主 ${questionNumber}`} />
            </div>
            <div className="boss-number">
                關卡 {questionNumber}
            </div>
        </div>
    );
};

export default BossAvatar;
