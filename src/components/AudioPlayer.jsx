import React, { Fragment, useEffect } from "react";
import correct from "../assets/correct.mp3";
import wrong from "../assets/wrong.mp3";
import lose from "../assets/lose.mp3";
import win from "../assets/win.mp3";

const audios = [correct, wrong, lose, win];

const AudioPlayer = ({ selectedSound }) => {
  const handleAction = () => {
    if (selectedSound) {
      const audio = new Audio(audios[selectedSound.audio]);
      audio.volume = 1;
      audio.play();
    }
  };
  useEffect(() => {
    handleAction();
  }, [selectedSound]);
  return null;
};

export default AudioPlayer;
