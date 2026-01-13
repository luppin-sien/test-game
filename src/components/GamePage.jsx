import { useState } from 'react';
import BossAvatar from './BossAvatar';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import { config } from '../utils/config';
import './GamePage.css';

/**
 * 測驗主畫面組件
 * @param {Array} questions - 題目列表
 * @param {function} onComplete - 測驗完成回調
 */
const GamePage = ({ questions, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isOvertime, setIsOvertime] = useState(false);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const isLastQuestion = currentIndex === questions.length - 1;

    const handleAnswer = (answer) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: answer,
        });
    };

    const handleNext = () => {
        if (isLastQuestion) {
            // 提交所有答案，包含時間資訊
            const answerList = questions.map(q => ({
                questionId: q.id,
                answer: answers[q.id] || '',
            }));
            onComplete(answerList, elapsedTime, isOvertime);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleTimeUp = () => {
        // 時間到時僅標記超時，不強制提交
        setIsOvertime(true);
    };

    const handleTimeUpdate = (time) => {
        setElapsedTime(time);
    };

    const canProceed = answers[currentQuestion.id] !== undefined;

    return (
        <div className="game-page">
            <div className="container">
                <div className="game-header">
                    {/* 計時器 */}
                    <Timer
                        timeLimit={config.timeLimit}
                        onTimeUp={handleTimeUp}
                        onTimeUpdate={handleTimeUpdate}
                    />

                    <div className="progress-container">
                        <div className="progress-label">
                            進度：{currentIndex + 1} / {questions.length}
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="game-content">
                    <BossAvatar
                        questionIndex={currentIndex}
                        questionNumber={currentIndex + 1}
                    />

                    <QuestionCard
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        selectedAnswer={answers[currentQuestion.id]}
                    />

                    <div className="game-actions">
                        <button
                            className="btn btn-primary btn-large"
                            onClick={handleNext}
                            disabled={!canProceed}
                        >
                            {isLastQuestion ? '提交答案' : '下一題'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
