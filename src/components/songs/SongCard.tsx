import React from 'react';
import { Play, BookOpen, Trash2 } from 'lucide-react';
import { Song } from '../../types';

const difficultyText = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
};

interface SongCardProps {
  song: Song;
  onView: (song: Song) => void;
  onDelete: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{song.title}</h3>
        <p className="text-gray-600">{song.artist}</p>
        <div className="mt-2 space-x-2">
          <span className={`inline-block px-2 py-1 rounded text-sm ${
            song.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            song.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficultyText[song.difficulty]}
          </span>
          {song.specialTuning && (
            <span className="inline-block px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
              调弦: {song.specialTuning}
            </span>
          )}
        </div>
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => onView(song)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <BookOpen size={16} className="mr-1" />
            查看谱子
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 size={16} className="mr-1" />
            删除
          </button>
        </div>
      </div>
    </div>
  );
};