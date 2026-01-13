import { useState } from 'react';
import { config } from '../utils/config';
import { formatTimeText } from '../utils/timeUtils';
import './HomePage.css';

/**
 * 首頁組件 - ID 輸入介面
 * @param {function} onStart - 開始測驗回調
 */
const HomePage = ({ onStart }) => {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userId.trim()) {
            setError('請輸入您的 ID');
            return;
        }

        setError('');
        onStart(userId.trim());
    };

    return (
        <div className="home-page">
            <div className="container">
                <div className="home-content">
                    <h1 className="game-title">
                        闖關問答測驗
                        <div className="title-underline"></div>
                    </h1>

                    <div className="game-description card">
                        <h3>測驗規則</h3>
                        <ul className="rules-list">
                            <li>每次測驗會隨機出現 {config.questionCount} 道題目</li>
                            <li>每道題目都有一位獨特的關主守護</li>
                            <li>選擇您認為正確的答案</li>
                            <li>答對 {config.passThreshold} 題即可通過挑戰</li>
                            {config.timeLimit > 0 ? (
                                <li className="time-limit-rule">
                                    ⏱️ 本次測試限制時間：<strong>{formatTimeText(config.timeLimit)}</strong>
                                    <br />
                                    <span className="time-limit-note">（超時仍可繼續作答，但成績會標註逾時）</span>
                                </li>
                            ) : (
                                <li className="time-limit-rule">
                                    ⏱️ 本次測試<strong>無時間限制</strong>，盡情發揮吧！
                                </li>
                            )}
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="start-form">
                        <div className="input-group">
                            <label htmlFor="userId" className="input-label">
                                請輸入您的 ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                className="input input-large"
                                placeholder="輸入 ID 開始測驗"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                autoFocus
                            />
                            {error && <div className="error-message">{error}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary btn-large">
                            開始挑戰
                        </button>
                    </form>

                    <div className="game-info">
                        <p className="info-text">
                            💡 提示：您的成績將被記錄到系統中
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
