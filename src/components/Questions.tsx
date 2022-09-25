import './Questions.css';
import { BiDownArrow } from "react-icons/bi";
import { AiFillEdit, AiFillDelete} from "react-icons/ai";
import IQuestionData from '../models/Question';
import { useEffect, useState } from 'react';
import AdminApi from '../api/AdminApi';

const Questions = () => {

    const [questions, setQuestions] = useState<IQuestionData[]>([]);

    const [question, setQuestion] = useState("");
    const [firstAnswer, setFirstAnswer] = useState("");
    const [secondAnswer, setSecondAnswer] = useState("");
 
    useEffect(() => {
        getQuestions()
    }, [])

    function getQuestions() {
        AdminApi.getAllQuestions()
            .then((response: any) => {
                setQuestions(response.data)
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    function deleteQuestion(questionId: any) {
        console.log("delete " + questionId)
        AdminApi.deleteQuestion(questionId)
        .then((response: any) => {
            console.log(response.data);
            setQuestions(questions.filter(question=> question.questionId !== questionId))
        })
        .catch((e: Error) => {
            console.log(e);
        });
    }

    function editQuestion(id: any) {
        console.log("edit " + id)
    }

    function confirmEditQuestion(id: any) {
        console.log("delete " + id)
        
    }

    function addQuestion(){

        console.log(question)
        console.log(firstAnswer)
        console.log(secondAnswer)
        AdminApi.addQuestion(question,firstAnswer,secondAnswer)
        .then((response: any) => {

            setQuestions([...questions,response.data])
            console.log(response.data)
            setQuestion("")
            setFirstAnswer("")
            setSecondAnswer("")
          })
          .catch((e: Error) => {
            console.log(e);
          });
    }
    return (

        <div className='questions'>

            <div className='questions__header'>
                New Question
            </div>


            <div>
                <div className="questions_box">
                    <div className="questions_line"><div className="questions_input">
                        <input type="text"
                            value={question}
                            className="questions_text"
                            placeholder="Enter question"
                            onChange={(e) => setQuestion(e.target.value)}></input></div></div>

                    <div className="questions_line"><div className="questions_input">
                    <input type="text"
                            value={firstAnswer}
                            className="questions_text"
                            placeholder="Enter first answer"
                            onChange={(e) => setFirstAnswer(e.target.value)}></input></div></div>

                    <div className="questions_line"><div className="questions_input">
                    <input type="text"
                            value={secondAnswer}
                            className="questions_text"
                            placeholder="Enter second answer"
                            onChange={(e) => setSecondAnswer(e.target.value)}></input></div></div>
                </div>

                <button className="questions__save-button" onClick={addQuestion}>
                Save
                </button>
            </div>

            <div className='questions__header'>
                Questions
            </div>

            {questions && questions.map((question,index) => (
                <div key={question.questionId}>
                    <div className="questions_box">
                        <div className="questions_line"><div className="questions_input"><div className='questions_text'>{index+1}. {question.questionText}</div></div><div className="questions_icon"><BiDownArrow size={30} /></div></div>
                        <div className="questions_line"><div className="questions_input"><div className='questions_text'>{question.answers[0].answerText}</div></div><div className="questions_icon" onClick={() => editQuestion(question.questionId)}><AiFillEdit size={30} /></div></div>
                        <div className="questions_line"><div className="questions_input"><div className='questions_text'>{question.answers[1].answerText}</div></div><div className="questions_icon" onClick={() => deleteQuestion(question.questionId)}><AiFillDelete size={30} /></div></div>
                    </div>
                </div>))}


        </div>

    )
}

export default Questions