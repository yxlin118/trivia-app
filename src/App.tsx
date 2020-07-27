import React, { useState } from 'react';
import { fetchQuizQuestions } from "./API";

//components
import QuestionCard from "./components/QuestionCard"

//types
import { Difficulty, QuestionState } from "./API";

//styles
import { GStyle,Wrapper } from "./App.style";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string; 
}

const TOTAL_QUESTIONS= 10;
const App = () => {

  const [loading,setLoading] = useState(false);
  const [questions,setQuestions] = useState<QuestionState[]>([]);
  const [number,setNumber] = useState(0);
  const [userAnswers,setUserAnswer] = useState<AnswerObject[] >([]);
  const [score,setScore] = useState(0);
  const [gameOver,setGameOver] = useState(true);

  //console.log(questions);
  const startTriva = async () =>{
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS,Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //get user answer
      const answer = event.currentTarget.value;

      //check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      //add score if answer is correct
      if(correct) setScore(prev => prev+1);
      
      //save answer in array for user answers
      const answerObject = {
        question: questions[number].question,
        answer: answer, //if it's the same, just need to type it once
        correct: correct,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswer([...userAnswers,answerObject]);
    }
  } 

  const nextQuestion = () => {
    //move on to the next question
    const nextQuestion  = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }
  }
  return (
    <>
    <GStyle />
    <Wrapper>
      <div className="App">
        <h1> Quiz </h1>
        {(gameOver) ?
          (<button className = "start" onClick={startTriva}>
            Start
          </button>) : null
        }

        {(userAnswers.length === TOTAL_QUESTIONS) ?
          (<button className = "start" onClick={startTriva}>
            Restart
          </button>) : null
        }
        
        {!gameOver? <p className="score">Score: {score} </p> : null}
        {loading && <p>Loading Questions...</p>}
        { (!loading && !gameOver) ?
          (<QuestionCard
            questionNumber = {number + 1}
            totalQuestions = {TOTAL_QUESTIONS}
            question = {questions[number].question}
            answers = {questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}/>
        ): null}
        { !gameOver && !loading && userAnswers.length === number+1 
          && number + 1 !== TOTAL_QUESTIONS &&
          (<button className = "next" onClick={nextQuestion}>
            Next Question
          </button>)
        }
      </div>
    </Wrapper>
    </>
  );
}

export default App;
