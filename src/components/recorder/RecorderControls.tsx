import React from 'react';
import { Mic, Square, Pause } from 'lucide-react';

interface RecorderControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
}

export const RecorderControls: React.FC<RecorderControlsProps> = ({
  isRecording,
  isPaused,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {!isRecording ? (
        <button
          onClick={onStartRecording}
          className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <Mic size={24} />
        </button>
      ) : (
        <>
          <button
            onClick={onPauseRecording}
            className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
          >
            <Pause size={24} />
          </button>
          <button
            onClick={onStopRecording}
            className="p-4 bg-gray-500 text-white rounded-full hover:bg-gray-600"
          >
            <Square size={24} />
          </button>
        </>
      )}
    </div>
  );
};