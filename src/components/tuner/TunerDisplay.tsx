import React from 'react';
import { TunerNote } from '../../types';

interface TunerDisplayProps {
  currentNote: TunerNote;
}

export const TunerDisplay: React.FC<TunerDisplayProps> = ({ currentNote }) => {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-4">{currentNote.note}</h2>
      <div className="flex justify-center items-center space-x-4">
        <div className={`h-2 w-32 rounded ${
          currentNote.isInTune ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="text-lg">{currentNote.frequency.toFixed(1)} Hz</span>
      </div>
      <p className="mt-4 text-gray-600">String {currentNote.string}</p>
    </div>
  );
};