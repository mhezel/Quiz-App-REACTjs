import { useReactQuiz } from "../context/ReactQuizContext";

function StartScreen() {
  const { questions, dispatch } = useReactQuiz();
  const numQuestions = questions.length;
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "data/start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
