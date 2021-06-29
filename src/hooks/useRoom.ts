import React from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [title, setTitle] = React.useState('...');

  React.useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions: Question[] = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([, like]) => like.authorId === user?.id,
            )?.[0],
          };
        },
      );

      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomId, user]);

  return { questions, title };
}
