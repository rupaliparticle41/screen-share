import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isSharing, setIsSharing] = useState(false)
  const [screenTrack,setScreenTrack]=useState(null)

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  const handleSharing = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: {
          frameRate: 10,
          height: 1080,
          width: 1920,
        },
      })
      .then(stream => {
       let track =stream.getTracks()[0]
          setScreenTrack(track)
        room.localParticipant
          .publishTrack(track, {
            name: 'screen', 
            priority: 'low',
          })
          .then(trackPublication => {
             setIsSharing(true)
          })
          .catch((onError) => {
            console.log("onError",onError)
          });
      })
      .catch(error => {
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
           console.log("onError",error)
        }
      });
  }

  const handlestopSharing = () => {
      room.localParticipant.unpublishTrack(screenTrack);
        screenTrack.stop();
        setScreenTrack(null)
        setIsSharing(false);
      }
  

  return (
    <div className="room">
       
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
     <div >
        {!isSharing
          ?
          <button onClick={handleSharing}>share screen</button>
          :
          <button onClick={handlestopSharing}>stop share screen</button>
        }
      </div>
      // <div >
       
      // </div>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
