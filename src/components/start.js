import React from "react";

export default function Start(props) {
  return (
    <div className="start">
      <h1 className="start-title">Quizzical</h1>
      <h2 className="start-subtitle">Query Your Brain</h2>
      <button className="start-button" onClick={props.startQuiz}>
        Start Quiz
      </button>
    </div>
  );
}
