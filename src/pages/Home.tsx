import React, { FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import '../styles/auth.scss';
import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import GoogleIcon from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useErrorToast } from '../hooks/useErrorToast';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = React.useState('');

  async function handleCreateRoomButton() {
    if (!user) await signInWithGoogle();
    history.push('/rooms/new');
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();
    if (roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      useErrorToast('Room does not exists');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={IllustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Letmeask" />
          <button onClick={handleCreateRoomButton} className="create-room">
            <img src={GoogleIcon} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
