import { useReactQuiz } from "../context/ReactQuizContext";

function NextButton() {
  const { answer, index, questions, dispatch } = useReactQuiz();
  const numQuestions = questions.length;

  console.log(numQuestions);

  if (answer === null) return null;
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "data/nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "data/finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
