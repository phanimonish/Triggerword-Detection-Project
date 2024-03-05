import React, { useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import "./index.css";

function Audio({ sendAudio }) {
  const recorderControls = useAudioRecorder();

  useEffect(() => {
    if (recorderControls?.isRecording) {
      setTimeout(recorderControls.stopRecording, 1500);
    }
  }, [recorderControls.isRecording, recorderControls.stopRecording])

  return (
    <AudioRecorder
      recorderControls={recorderControls}
      onRecordingComplete={sendAudio}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={false}
      downloadFileExtension="webm"
    />
  );
}

export default Audio;
