import { useState } from 'react';
import './QuestionCard.css';

/**
 * 題目卡片組件
 * @param {Object} question - 題目物件
 * @param {function} onAnswer - 答題回調函數
 * @param {string} selectedAnswer - 已選擇的答案
 */
const QuestionCard = ({ question, onAnswer, selectedAnswer }) => {
    const options = [
        { key: 'A', label: question.optionA },
        { key: 'B', label: question.optionB },
        { key: 'C', label: question.optionC },
        { key: 'D', label: question.optionD },
    ];

    const handleOptionClick = (optionKey) => {
        onAnswer(optionKey);
    };

    return (
        <div className="question-card">
            <div className="speech-bubble">
                <div className="question-text">{question.question}</div>
            </div>

            <div className="options-container">
                {options.map((option) => (
                    <button
                        key={option.key}
                        className={`option-btn ${selectedAnswer === option.key ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option.key)}
                    >
                        <span className="option-key">{option.key}.</span> {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
