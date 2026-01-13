import { config } from '../utils/config';
import { formatTimeText } from '../utils/timeUtils';
import './ResultPage.css';

/**
 * 成績結算頁面
 * @param {Object} result - 成績結果
 * @param {function} onRestart - 重新開始回調
 */
const ResultPage = ({ result, onRestart }) => {
    const { score, total, passed, elapsedTime, isOvertime } = result;
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="result-page">
            <div className="container">
                <div className="result-content">
                    <div className={`result-badge ${passed ? 'success' : 'fail'}`}>
                        {passed ? '🎉 恭喜通過！' : '💪 再接再厲'}
                    </div>

                    <div className="result-card card">
                        <h2 className="result-title">您的成績</h2>

                        <div className="score-display">
                            <div className="score-number">
                                {score} <span className="score-divider">/</span> {total}
                            </div>
                            <div className="score-percentage">{percentage}%</div>
                        </div>

                        <div className="result-details">
                            <div className="detail-item">
                                <span className="detail-label">答對題數：</span>
                                <span className="detail-value correct">{score} 題</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">答錯題數：</span>
                                <span className="detail-value wrong">{total - score} 題</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">通過門檻：</span>
                                <span className="detail-value">{config.passThreshold} 題</span>
                            </div>
                            {elapsedTime !== undefined && (
                                <div className="detail-item time-item">
                                    <span className="detail-label">
                                        {isOvertime ? '花費總時間：' : '完成時間：'}
                                    </span>
                                    <span className={`detail-value ${isOvertime ? 'overtime' : ''}`}>
                                        {formatTimeText(elapsedTime)}
                                        {isOvertime && ' (逾時)'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {passed ? (
                            <div className="success-message">
                                <p>太棒了！您已成功完成挑戰 🌟</p>
                                {result.isFirstPass && (
                                    <p className="first-pass-note">這是您的第一次通關！</p>
                                )}
                            </div>
                        ) : (
                            <div className="fail-message">
                                <p>差一點就成功了！</p>
                                <p>需要答對 {config.passThreshold} 題才能通過</p>
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary btn-large"
                        onClick={onRestart}
                    >
                        再玩一次
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
