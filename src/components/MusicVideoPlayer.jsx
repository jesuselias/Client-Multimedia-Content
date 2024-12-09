// components/MusicVideoPlayer.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  width: 100%;
  height: 200px; // Ajusta el tamaño según tus necesidades
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MusicControls = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 80%;
`;

const PlayPauseButton = styled.button`
  background-color: #ff4081;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const VolumeControl = styled.input`
  width: 60px;
  height: 20px;
`;

const MusicVideoPlayer = ({ musicData, videoData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    // Aquí iría el código para controlar el reproductor
    // Por ejemplo, para YouTube:
    // const player = new YT.Player('player', {
    //   height: '200',
    //   width: '100%',
    //   videoId: musicData.id,
    //   events: {
    //     'onReady': onPlayerReady,
    //     'onStateChange': onPlayerStateChange
    //   }
    // });
  }, [musicData]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <PlayerContainer>
      <VideoWrapper>
        {/* Aquí iría el elemento HTML5 para reproducir la música o video */}
        <video src={musicData.url} controls />
      </VideoWrapper>
      <MusicControls>
        <PlayPauseButton onClick={handlePlayPause}>
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </PlayPauseButton>
        <VolumeControl type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} />
      </MusicControls>
    </PlayerContainer>
  );
};

export default MusicVideoPlayer;