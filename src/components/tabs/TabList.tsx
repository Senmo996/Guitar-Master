import React from 'react';
import { Search } from 'lucide-react';
import { Song, TabFilter } from '../../types';
import { SongCard } from '../songs/SongCard';

const difficultyText = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
};

interface TabListProps {
  songs: Song[];
  filter: TabFilter;
  onFilterChange: (filter: TabFilter) => void;
  onViewTab: (song: Song) => void;
  onDeleteTab: (id: string) => Promise<void>;
}

export const TabList: React.FC<TabListProps> = ({ songs, filter, onFilterChange, onViewTab, onDeleteTab }) => {
  const displayDifficulty = (difficulty: string | undefined) => {
    if (!difficulty) return '所有难度';
    return difficultyText[difficulty as keyof typeof difficultyText];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索谱子..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.difficulty || ''}
            onChange={(e) => onFilterChange({ 
              ...filter, 
              difficulty: e.target.value as TabFilter['difficulty'] || undefined 
            })}
          >
            <option value="">所有难度</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.sortBy}
            onChange={(e) => onFilterChange({ 
              ...filter, 
              sortBy: e.target.value as TabFilter['sortBy']
            })}
          >
            <option value="dateAdded">最近添加</option>
            <option value="lastPlayed">最近播放</option>
            <option value="title">按标题</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onView={() => onViewTab(song)}
            onDelete={() => onDeleteTab(song.id)}
          />
        ))}
      </div>
    </div>
  );
};