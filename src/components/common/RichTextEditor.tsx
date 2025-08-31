import React, { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        insertFormatting('**', '**');
        break;
      case 'italic':
        insertFormatting('*', '*');
        break;
      case 'h1':
        insertFormatting('# ');
        break;
      case 'h2':
        insertFormatting('## ');
        break;
      case 'h3':
        insertFormatting('### ');
        break;
      case 'bullet':
        insertFormatting('- ');
        break;
      case 'number':
        insertFormatting('1. ');
        break;
    }
  };

  const convertToHTML = (text: string) => {
    if (!text) return '';
    
    // Split into lines and process each line
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      line = line.trim();
      if (!line) return '<br>';
      
      // Headers
      if (line.startsWith('### ')) {
        return `<h3 class="text-lg font-semibold text-secondary-800 mt-4 mb-2">${line.substring(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 class="text-xl font-semibold text-secondary-800 mt-6 mb-3">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1 class="text-2xl font-bold text-secondary-800 mt-8 mb-4">${line.substring(2)}</h1>`;
      }
      
      // Bullet points
      if (line.startsWith('- ')) {
        const content = line.substring(2);
        return `<div class="flex items-start mb-2 ml-4"><span class="mr-2 mt-1">•</span><span>${content}</span></div>`;
      }
      
      // Regular text
      return `<div class="mb-2">${line}</div>`;
    });
    
    let html = processedLines.join('');
    
    // Apply bold and italic formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-secondary-800">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    return html;
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-2">
        <button type="button" onClick={() => formatText('h1')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold">H1</button>
        <button type="button" onClick={() => formatText('h2')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold">H2</button>
        <button type="button" onClick={() => formatText('h3')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold">H3</button>
        <button type="button" onClick={() => formatText('bold')} className="p-2 hover:bg-gray-200 rounded font-bold">B</button>
        <button type="button" onClick={() => formatText('italic')} className="p-2 hover:bg-gray-200 rounded italic">I</button>
        <button type="button" onClick={() => formatText('bullet')} className="p-2 hover:bg-gray-200 rounded">•</button>
        <button type="button" onClick={() => formatText('number')} className="p-2 hover:bg-gray-200 rounded">1.</button>
        <div className="flex-1" />
        <button type="button" onClick={() => setShowPreview(!showPreview)} className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700">
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      <div className="min-h-[150px]">
        {showPreview ? (
          <div className="p-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: convertToHTML(value) }} />
        ) : (
          <textarea
            id="rich-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[150px] p-3 border-none outline-none resize-none"
          />
        )}
      </div>
      <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-600">
        Use **bold**, *italic*, # H1, ## H2, ### H3, - bullets, 1. numbers
      </div>
    </div>
  );
};

export default RichTextEditor;