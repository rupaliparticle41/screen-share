import React, {useState, useEffect, useRef} from "react";
import Video from "./Video"

const Participant = ({ participant }) => {
  const [allTracks,setallTracks]=useState([])


  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {   
    setallTracks(trackpubsToTracks(participant.videoTracks))
    const trackSubscribed = (track) => {
      setallTracks((allTracks) => [...allTracks, track])
    };

    const trackUnsubscribed = (track) => {
        setallTracks((allTracks) => allTracks.filter((t) => t !== track))
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      
      setallTracks([])
      participant.removeAllListeners();
    };
  }, [participant]);

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      {
        allTracks && allTracks.map((track, index) => (
        <div>
          {console.log(track)}
            <Video track={track} key={index} />
        </div>
      ))    
      }
      
    </div>
  );
};

export default Participant;
