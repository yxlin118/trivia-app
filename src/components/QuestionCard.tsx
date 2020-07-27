import React from 'react';


//types
import { AnswerObject } from "../App"

//styles
import { Wrapper, ButtonWrapper } from "./QuestionCard.style"

type Props = {
    question: string;
    answers: string[];
    callback: (event: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined;
    questionNumber: number;
    totalQuestions: number;
}
const QuestionCard: React.FC<Props> = ({ question, answers, callback, userAnswer, questionNumber,totalQuestions}) => (
    <Wrapper>
        <p className="number">
            Question: {questionNumber}/{totalQuestions}
        </p>
        <p dangerouslySetInnerHTML={{__html: question}}/>
        <div>
            {answers.map((answer)=>(
                <ButtonWrapper 
                    key={answer}
                    //optional chaining??in type script
                    correct={userAnswer?.correctAnswer === answer}
                    userClicked={userAnswer?.answer === answer}
                >
                    <button disabled={userAnswer? true : false} value={answer} onClick={callback}>
                        <span dangerouslySetInnerHTML={{__html:answer}} />
                    </button>
                </ButtonWrapper>
            ))}
        </div>
    </Wrapper>
);
export default QuestionCard;