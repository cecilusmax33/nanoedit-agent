
import React, { useRef, useEffect, useState } from 'react';
import { Send, Image as ImageIcon, Loader2, Download, RefreshCcw, Sparkles, X } from 'lucide-react';
import { Message, MessageRole } from '../types';
import ReactMarkdown from 'react-markdown';

// --- Message Bubble Component ---
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Role Label */}
        <span className={`text-xs mb-1 font-medium ${isUser ? 'text-blue-400' : 'text-orange-400'}`}>
          {isUser ? 'You' : 'Nano Agent'}
        </span>

        {/* Content Container */}
        <div className={`rounded-2xl overflow-hidden ${
          isUser 
            ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 rounded-tr-sm' 
            : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
        }`}>
          
          {/* Image Display */}
          {message.imageUrl && (
            <div className="relative group">
              <img 
                src={message.imageUrl} 
                alt="Content" 
                className="max-w-full md:max-w-md object-contain max-h-[500px] bg-black/20"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                <div className="relative group/tooltip">
                  <a 
                    href={message.imageUrl} 
                    download={`nano-edit-${message.timestamp}.png`}
                    className="bg-slate-900/80 p-2 rounded-full text-white hover:bg-blue-600 transition-colors block"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <div className="absolute right-0 bottom-full mb-2 w-32 p-2 bg-slate-900 text-[10px] text-white rounded shadow-xl border border-slate-700 invisible group-hover/tooltip:visible z-50 pointer-events-none">
                    Save this image to your device.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text Display */}
          {message.text && (
            <div className="px-4 py-3 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}

          {/* Error Display */}
          {message.isError && (
             <div className="px-4 py-3 bg-red-900/20 text-red-300 text-sm">
                Error processing request. Please try again.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Chat Interface ---
interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, image?: File) => void;
  isProcessing: boolean;
  currentModel: string;
  onModelChange: (model: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isProcessing, 
  currentModel, 
  onModelChange 
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isProcessing) return;

    onSendMessage(inputText, selectedFile || undefined);
    setInputText('');
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
      
      {/* Header Bar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">NanoEdit Workspace</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase font-semibold tracking-wide hidden sm:block">Model</span>
          <div className="relative group">
            <select
              value={currentModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 hover:bg-slate-750 transition-colors"
            >
              <option value="gemini-2.5-flash-image">Gemini 2.5 Flash (Fast)</option>
              <option value="gemini-3-pro-image-preview">Gemini 3.0 Pro (High Quality)</option>
            </select>
            <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
              <span className="font-bold text-white block mb-1">AI Engine Selection</span>
              <p className="mb-1"><span className="text-blue-400">Flash</span>: Optimized for speed and simple filters.</p>
              <p><span className="text-orange-400">Pro</span>: Best for complex edits, scene generation, and reasoning.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 relative">
         {/* Empty State / Welcome */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 pointer-events-none">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-800">
              <RefreshCcw className="w-10 h-10 text-yellow-500 opacity-80" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">NanoEdit Agent</h2>
            <p className="text-center max-w-md">
              Upload an image and ask for edits like "Add a retro filter" or "Remove the background".
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isProcessing && (
          <div className="flex w-full mb-6 justify-start">
             <div className="flex flex-col items-start max-w-[85%]">
                <span className="text-xs mb-1 font-medium text-orange-400">Nano Agent</span>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl rounded-tl-sm flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                  <span className="text-slate-300 text-sm">Processing with {currentModel.includes('pro') ? 'Gemini Pro' : 'Gemini Flash'}...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 z-20">
        
        {/* File Preview */}
        {previewUrl && (
          <div className="mb-3 relative inline-block group">
            <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-700" />
            <button 
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-slate-800 text-slate-400 rounded-full p-1 hover:text-white border border-slate-700 shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none text-center">
              Discard this image.
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          
          <div className="relative group">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-xl transition-colors ${selectedFile ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            <div className="absolute left-0 bottom-full mb-3 w-44 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
              <span className="font-bold text-white block mb-1">Attach Source</span>
              Select an image from your computer to start editing or provide a visual reference.
            </div>
          </div>

          <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the edit (e.g., 'Make it look like a sketch')"
              className="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 p-3 max-h-32 focus:ring-0 resize-none"
              rows={1}
              style={{ minHeight: '44px' }}
            />
          </div>

          <div className="relative group">
            <button 
              onClick={() => handleSubmit()}
              disabled={(!inputText.trim() && !selectedFile) || isProcessing}
              className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Send className="w-6 h-6" />
            </button>
            <div className="absolute right-0 bottom-full mb-3 w-40 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
              <span className="font-bold text-white block mb-1">Send Command</span>
              Submit your prompt and image to the selected Gemini model.
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-center">
          <p className="text-xs text-slate-600">
            Powered by Google Gemini. Images are processed securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
