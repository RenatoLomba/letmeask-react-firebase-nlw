import React from 'react';

import '../styles/room-code.scss';
import CopyImg from '../assets/images/copy.svg';

type RoomCodeProps = {
  roomCode: string;
};

export function RoomCode({ roomCode }: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(roomCode);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={CopyImg} alt="Copy room code" />
      </div>
      <span>Sala #{roomCode}</span>
    </button>
  );
}
