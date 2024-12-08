import React from 'react';
import { Music, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddTab: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTab }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Music size={64} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No tabs found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by adding your first guitar tab.
      </p>
      <div className="mt-6">
        <button
          onClick={onAddTab}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle size={20} className="mr-2" />
          Add New Tab
        </button>
      </div>
    </div>
  );
};