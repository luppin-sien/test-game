import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../utils/timeUtils';
import './Timer.css';

/**
 * 計時器組件
 * @param {number} timeLimit - 時間限制（秒），0 表示不限時
 * @param {function} onTimeUp - 時間到時的回調函數
 * @param {function} onTimeUpdate - 時間更新回調（用於記錄花費時間）
 */
const Timer = ({ timeLimit, onTimeUp, onTimeUpdate }) => {
    const [elapsedTime, setElapsedTime] = useState(0); // 已用時間
    const [isOvertime, setIsOvertime] = useState(false); // 是否超時

    // 使用 ref 來存儲回調函數，避免依賴項變化導致 interval 重置
    const onTimeUpRef = useRef(onTimeUp);
    const onTimeUpdateRef = useRef(onTimeUpdate);

    // 更新 ref 當回調函數改變時
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => {
                const newTime = prev + 1;

                // 使用 setTimeout 確保狀態更新在下一個事件循環中執行
                // 避免在渲染期間調用父組件的 setState
                setTimeout(() => {
                    if (onTimeUpdateRef.current) {
                        onTimeUpdateRef.current(newTime);
                    }
                }, 0);

                // 檢查是否超時（僅在有時間限制時）
                if (timeLimit > 0 && newTime >= timeLimit && !isOvertime) {
                    setIsOvertime(true);
                    setTimeout(() => {
                        if (onTimeUpRef.current) {
                            onTimeUpRef.current();
                        }
                    }, 0);
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLimit, isOvertime]); // 只依賴 timeLimit 和 isOvertime

    // 計算剩餘時間或已用時間
    const remainingTime = timeLimit > 0 ? Math.max(0, timeLimit - elapsedTime) : elapsedTime;
    const progress = timeLimit > 0 ? (elapsedTime / timeLimit) * 100 : 0;

    return (
        <div className="timer-container">
            <div className="timer-display">
                {timeLimit > 0 ? (
                    <>
                        <span className="timer-label">剩餘時間：</span>
                        <span className={`timer-value ${isOvertime ? 'overtime' : ''}`}>
                            {formatTime(remainingTime)}
                        </span>
                        {isOvertime && <span className="overtime-badge">逾時</span>}
                    </>
                ) : (
                    <>
                        <span className="timer-label">答題時長：</span>
                        <span className="timer-value">{formatTime(elapsedTime)}</span>
                    </>
                )}
            </div>

            {timeLimit > 0 && (
                <div className="timer-progress-bar">
                    <div
                        className={`timer-progress-fill ${isOvertime ? 'overtime' : ''}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default Timer;
