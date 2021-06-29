import React from 'react';

import '../styles/room.scss';
import LogoImg from '../assets/images/logo.svg';
import DeleteImg from '../assets/images/delete.svg';
import CheckImg from '../assets/images/check.svg';
import AnswerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id: roomId } = useParams<RoomParams>();
  const { questions, title } = useRoom(roomId);
  const history = useHistory();

  async function handleDeleteQuestion(questionId: string) {
    const canRemove = window.confirm(
      'Tem certeza que deseja excluir essa pergunta?',
    );
    if (!canRemove) return;
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(
    questionId: string,
    isAnswered: boolean,
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !isAnswered,
    });
  }

  async function handleHighlightQuestion(
    questionId: string,
    isHighlighted: boolean,
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <div className="">
            <RoomCode roomCode={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.length > 0 &&
            questions.map((question) => (
              <Question
                key={question.id}
                author={question.author}
                content={question.content}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleCheckQuestionAsAnswered(
                          question.id,
                          question.isAnswered,
                        )
                      }
                    >
                      <img
                        src={CheckImg}
                        alt={`Marcar pergunta ${question.id} como respondida`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleHighlightQuestion(
                          question.id,
                          question.isHighlighted,
                        )
                      }
                    >
                      <img
                        src={AnswerImg}
                        alt={`Dar destaque a pergunta ${question.id}`}
                      />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img
                    src={DeleteImg}
                    alt={`Remover pergunta ${question.id}`}
                  />
                </button>
              </Question>
            ))}
        </div>
      </main>
    </div>
  );
}
