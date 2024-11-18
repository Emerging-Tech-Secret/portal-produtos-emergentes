import React from 'react';

interface Props {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagSelect }: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
            selectedTags.includes(tag)
              ? 'bg-itau-orange text-white'
              : 'bg-white text-itau-gray-700 border border-itau-gray-300 hover:bg-itau-gray-100'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}