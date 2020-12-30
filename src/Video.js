import React, {useState, useEffect, useRef} from "react";

const Video = ({track}) => {

    const videoRef = useRef(null)

    useEffect(() => {
        const userTrack =  track;
        
        if (userTrack) {
        userTrack.attach(videoRef.current);
        return () => {
            userTrack.detach();
        };
        }
    }, [track]);
console.log("video track",track)
    return (
         <video ref={videoRef} autoPlay={true} />
    )
}

export default Video