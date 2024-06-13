import { useEffect, useReducer } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Loader from "./Loader.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import Footer from "./Footer.js";
import Timer from "./Timer.js";

function reducer (state, action){
  
  switch (action.type){
    case 'dataReceived':
      return {
        ...state, 
        questions: action.payload, 
        status: 'ready'
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      };
    case 'start':
      return{
        ...state, 
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':

      const question = state.questions.at(state.index);
      return{
        ...state, 
        answer: action.payload,
        points: 
        action.payload === question.correctOption
        ? state.points + question.points
        : state.points,
      };

    case 'nextQuestion':
      return{
        ...state, 
        index: state.index + 1, 
        answer: null
      };

    case 'finish':
      return{
        ...state,
        status: 'finish',
        highscore:
        state.points > state.highscore ? state.points : state.highscore,
      };

    case 'restart':
      return{
        ...initialState,
        questions: state.questions,
        status: 'ready',
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
  }
}
const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading', // loading, error, active, ready 
  answer: null,
  index: 0,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

export default function App(){
const [{questions, status, answer, index, points, highscore, secondsRemaining}, dispatch] = useReducer(reducer, initialState);

const numQuestions = questions.length;
const maxPossiblePoints = questions.reduce(
  (prev, cur) => prev + cur.points,
  0
);

useEffect(() => {
    fetch('http://localhost:9000/questions')
    .then((res) => res.json())
    .then((data) => dispatch({type: 'dataReceived', payload: data}))
    .catch((err) => dispatch({type: 'error'}))
}, []);

 return(
  <div className="app">
    <Header/>
    <Main>
        {status === 'loading' && <Loader/>}
        {status === 'error' && <Error/>}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
        {status === 'active' && (
        <>
            <Progress maxPossiblePoints={maxPossiblePoints} points={points} numQuestions={numQuestions} index={index} answer={answer}/>
            <Question dispatch={dispatch} answer={answer} questions={questions} index={index}/>
            <Footer>
                  <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
                  <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
            </Footer>
          </>
        )}
        {status === 'finish' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch}/>}
    </Main>
  </div>

 );
}
