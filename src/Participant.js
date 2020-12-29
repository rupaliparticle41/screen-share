import React, { useState, useEffect, useRef } from "react";

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [mediaTracks, setMediaTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const mediaRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {   
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      console.log("trackSubscribed", track)
      if (track.name === "screen") {
         setMediaTracks((mediaTracks) => [...mediaTracks, track]);
      }
      else if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      console.log("trackUnsubscribed", track)
       if (track.name === "screen") {
         setMediaTracks((mediaTracks) => mediaTracks.filter((v) => v !== track));
      } else if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack =  videoTracks[0];
    
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

   useEffect(() => {
    const mediaTrack =  mediaTracks[0];
    
    if (mediaTrack) {
      mediaTrack.attach(mediaRef.current);
      return () => {
        mediaTrack.detach();
      };
    }
  }, [mediaTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);
console.log("mediaTracks",mediaTracks)
  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      {mediaTracks.length>0 ? <video autoPlay ref={mediaRef} />:null}
     
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};

export default Participant;
