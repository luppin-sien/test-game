import { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import ResultPage from './components/ResultPage';
import { mockFetchQuestions, mockSubmitAnswers } from './services/api';
import { config } from './utils/config';
import './App.css';

/**
 * 測驗狀態
 */
const GAME_STATE = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    SUBMITTING: 'submitting',
    RESULT: 'result',
};

function App() {
    const [gameState, setGameState] = useState(GAME_STATE.IDLE);
    const [userId, setUserId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 開始測驗
     */
    const handleStart = async (id) => {
        setUserId(id);
        setGameState(GAME_STATE.LOADING);
        setError(null);

        try {
            // 撈取題目
            const fetchedQuestions = await mockFetchQuestions(
                config.questionBankSheet,
                config.questionCount
            );

            setQuestions(fetchedQuestions);
            setGameState(GAME_STATE.PLAYING);
        } catch (err) {
            console.error('載入題目失敗:', err);
            setError('載入題目失敗，請稍後再試');
            setGameState(GAME_STATE.IDLE);
        }
    };

    /**
     * 完成測驗並提交答案
     * @param {Array} answers - 答案列表
     * @param {number} elapsedTime - 作答時間（秒）
     * @param {boolean} isOvertime - 是否超時
     */
    const handleComplete = async (answers, elapsedTime, isOvertime) => {
        setGameState(GAME_STATE.SUBMITTING);
        setError(null);

        try {
            // 提交答案並計算成績
            const gameResult = await mockSubmitAnswers(userId, answers, elapsedTime, isOvertime);

            setResult(gameResult);
            setGameState(GAME_STATE.RESULT);
        } catch (err) {
            console.error('提交答案失敗:', err);
            setError('提交答案失敗，請稍後再試');
            setGameState(GAME_STATE.PLAYING);
        }
    };

    /**
     * 重新開始
     */
    const handleRestart = () => {
        setGameState(GAME_STATE.IDLE);
        setUserId('');
        setQuestions([]);
        setResult(null);
        setError(null);
    };

    return (
        <div className="app">
            {gameState === GAME_STATE.IDLE && (
                <HomePage onStart={handleStart} />
            )}

            {gameState === GAME_STATE.LOADING && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>正在載入題目...</p>
                </div>
            )}

            {gameState === GAME_STATE.PLAYING && (
                <GamePage
                    questions={questions}
                    onComplete={handleComplete}
                />
            )}

            {gameState === GAME_STATE.SUBMITTING && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>正在計算成績...</p>
                </div>
            )}

            {gameState === GAME_STATE.RESULT && result && (
                <ResultPage
                    result={result}
                    onRestart={handleRestart}
                />
            )}

            {error && (
                <div className="error-overlay">
                    <div className="error-card card">
                        <h3>發生錯誤</h3>
                        <p>{error}</p>
                        <button
                            className="btn btn-primary"
                            onClick={handleRestart}
                        >
                            返回首頁
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
