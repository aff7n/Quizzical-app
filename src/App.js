import React, { useState, useEffect } from "react";
import Start from "./components/start";
import Quiz from "./components/quiz";

export default function App() {
  const [showStart, setShowStart] = useState(true);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allComplete, setAllComplete] = useState(false);

  function startQuiz() {
    setShowStart(false);
  }

  function playAgain() {
    setShowStart(true);
    setShowAnswers(false);
    setAllComplete(false);
  }

  function checkAnswers() {
    setShowAnswers(true);
  }

  function selectAnswer(event, quiz_id, option_id) {
    setQuestions(function (prev) {
      return questions.map(function (quiz, qid) {
        if (quiz_id === qid) {
          return { ...quiz, selected_answer: option_id };
        } else {
          return quiz;
        }
      });
    });
  }

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < questions.length; i++) {
      if (typeof questions[i].selected_answer !== "undefined") {
        if (
          questions[i].options[questions[i].selected_answer] ===
          questions[i].correct_answer
        ) {
          count++;
        }
      }
    }
    setScore(count);
  }, [showAnswers]);

  useEffect(() => {
    if (showStart === false) {
      fetch("https://opentdb.com/api.php?amount=5")
        .then((res) => res.json())
        .then((data) =>
          setQuestions(
            data.results.map(function (question) {
              return {
                question: question.question,
                options: question.incorrect_answers
                  .concat([question.correct_answer])
                  .map((value) => ({ value, sort: Math.random() }))
                  .sort((a, b) => a.sort - b.sort)
                  .map(({ value }) => value),
                selected_answer: undefined,
                correct_answer: question.correct_answer,
              };
            })
          )
        );
    }
  }, [showStart]);

  useEffect(() => {
    setAllComplete(
      questions.every((quiz) => typeof quiz.selected_answer !== "undefined")
    );
  }, [questions]);

  const quizQs = questions.map(function (question, index) {
    return (
      <Quiz
        key={index}
        question={question}
        showAnswers={showAnswers}
        selectAnswer={selectAnswer}
        id={index}
      />
    );
  });

  return (
    <div className="App">
      {showStart ? (
        <Start startQuiz={startQuiz} />
      ) : (
        <div className="quiz">
          {quizQs}
          {showAnswers ? (
            <div className="finished">
              <h3 className="finished-score">
                {"Your score => " + score + "/5 correct answers"}
              </h3>
              <button className="btn" onClick={playAgain}>
                Play Again
              </button>
            </div>
          ) : (
            <button
              className="btn"
              disabled={!allComplete}
              onClick={checkAnswers}
            >
              Check Your Answers
            </button>
          )}
        </div>
      )}
    </div>
  );
}
