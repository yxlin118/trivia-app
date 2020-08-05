import React, { useState } from 'react';
import Select from 'react-select';
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

const Difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard'},
];

//const totalNumber= 10;
const App = () => {

  const [loading,setLoading] = useState(false);
  const [level,setLevel] = useState(Difficulty.EASY);
  const [totalNumber,setTotalNumber] = useState(1);
  const [questions,setQuestions] = useState<QuestionState[]>([]);
  const [number,setNumber] = useState(0);
  const [userAnswers,setUserAnswer] = useState<AnswerObject[] >([]);
  const [score,setScore] = useState(0);
  const [gameOver,setGameOver] = useState(true);
  const [restart,setRestart] = useState(false);

  //console.log(questions);
  const startTriva = async () =>{
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(totalNumber,level);

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
    console.log(number);
    const nextQuestion  = number + 1;
    if(nextQuestion === totalNumber){
      setRestart(true);
    }else{
      setNumber(nextQuestion);
    }
  }

  const handleLevelSelection = (e:any) => {
    setLevel(e.value);
  };

  const handleSetTotalNumber = (e:any) => {
    setTotalNumber(e.target.value);

  }

  const handleRestart = () => {
    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);
    setRestart(false);
    setGameOver(true);
  };

  if(questions[0]) console.log(questions[0]);
  return (
    <>
    <GStyle />
    <Wrapper>
      <div className="App">
        <h1> Fun with Trivia </h1>
        {(gameOver) &&
          (
          <>
          <button className = "start" onClick={startTriva}>
            Start
          </button>
          <p><b>Select Difficulty Level</b></p>
          <Select 
          id="option"
          options={Difficulties}
          isMulti = {false} 
          onChange={handleLevelSelection}/>

          <p><b>Select Question Number</b></p>
          <input
            id="option"          
            type="number"
            value={totalNumber}
            onChange={handleSetTotalNumber} />
          </>)

        }

        {totalNumber && (userAnswers.length == totalNumber) &&
          (
          <>
          <button className = "start" onClick={handleRestart}>
            Restart
          </button>
          {questions.map((q, i:number) => (
            <QuestionCard
            key={i}
            questionNumber = {i + 1}
            totalQuestions = {totalNumber}
            question = {q.question}
            answers = {q.answers}
            userAnswer={userAnswers[i]}
            callback={checkAnswer}/>
          ))}
          </>)
        }
        
        {!gameOver && <p className="score">Score: {score} </p>}
        {loading && <p>Loading Questions...</p>}
        { !(userAnswers.length == totalNumber) && (!loading && !gameOver) &&
          (
          <>
          <QuestionCard
            questionNumber = {number + 1}
            totalQuestions = {totalNumber}
            question = {questions[number].question}
            answers = {questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}/>
            <br></br>
            </>
        )}
        { !(userAnswers.length == totalNumber) &&
        !gameOver && !loading && userAnswers.length === number+1 
          && number + 1 !== totalNumber &&
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
