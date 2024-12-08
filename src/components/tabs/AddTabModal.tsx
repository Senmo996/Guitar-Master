import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { NewSong } from '../../types';

interface AddTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newSong: NewSong) => void;
}

export const AddTabModal: React.FC<AddTabModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const defaultFormData: NewSong = {
    title: '',
    artist: '',
    difficulty: 'beginner',
    specialTuning: 'EADGBE',
    sheetMusicImages: [],
    tabContent: '',
    totalPracticeTime: 0,
  };

  const [formData, setFormData] = useState<NewSong>(defaultFormData);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultFormData);
    }
  }, [isOpen]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const newImages = await Promise.all(
          Array.from(files).map(file => convertFileToBase64(file))
        );
        setFormData(prev => ({
          ...prev,
          sheetMusicImages: [...prev.sheetMusicImages, ...newImages],
        }));
      } catch (error) {
        console.error('Error converting files:', error);
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sheetMusicImages: prev.sheetMusicImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sheetMusicImages.length === 0) {
      alert('请至少添加一张乐谱图片');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">添加新谱</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">歌曲名称</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">艺术家</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              难度
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="specialTuning" className="block text-sm font-medium text-gray-700">
              特殊调弦（可选）
            </label>
            <input
              type="text"
              id="specialTuning"
              name="specialTuning"
              value={formData.specialTuning || ''}
              onChange={handleInputChange}
              placeholder="e.g., Drop D, DADGAD"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传乐谱图片
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                className="mt-1 block w-full"
              />
            </div>

            {formData.sheetMusicImages.length > 0 && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600 mb-2">乐谱图片：</p>
                {formData.sheetMusicImages.map((image, index) => (
                  <div key={index} className="relative border rounded-lg p-2">
                    <img
                      src={image}
                      alt={`乐谱 ${index + 1}`}
                      className="max-w-full h-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              附加说明（可选）
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.tabContent}
              onChange={(e) => setFormData({ ...formData, tabContent: e.target.value })}
              placeholder="输入关于谱子的任何附加说明..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              添加谱子
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};