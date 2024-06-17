import { createContext, useContext, useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "rejected":
      return {
        ...state,
        status: "error",
      };

    case "data/received":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };

    case "data/start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "data/newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "data/tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "data/nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "data/finish":
      return {
        ...state,
        status: "finish",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "data/restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    default:
      throw new Error("Undefined action...");
  }
}

const SECS_PER_QUESTION = 30;
const ReactQuizContext = createContext();

const initialState = {
  questions: [],
  status: "loading", // loading, error, active, ready
  answer: null,
  index: 0,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function ReactQuizProvider({ children }) {
  const [
    { questions, status, answer, index, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "data/received", payload: data }))
      .catch((err) => dispatch({ type: "rejected", payload: err }));
  }, []);

  return (
    <ReactQuizContext.Provider
      value={{
        questions,
        status,
        answer,
        index,
        points,
        highscore,
        secondsRemaining,
        dispatch,
      }}
    >
      {children}
    </ReactQuizContext.Provider>
  );
}

function useReactQuiz() {
  const context = useContext(ReactQuizContext);
  if (context === undefined)
    throw new Error("Unable to use context hook in this area");

  return context;
}

export { ReactQuizProvider, useReactQuiz };
