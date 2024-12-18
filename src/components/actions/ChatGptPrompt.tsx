import { useState, useEffect, useRef } from 'react';
import { Target } from '../../types';
import { Button } from '../ui/Button';
import { Copy, ExternalLink } from 'lucide-react';

interface ChatGptPromptProps {
  target: Target;
  onCopy: (text: string) => void;
}

export function ChatGptPrompt({ target, onCopy }: ChatGptPromptProps) {
  const [prompt, setPrompt] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const category = target.categoryId;
    const subcategory = target.subcategoryId;
    
    const generatedPrompt = `I have a goal: "${target.title}"
Description: ${target.description}
Category: ${category}
Subcategory: ${subcategory}

Please propose 5 specific, actionable steps I need to take to achieve this goal. For each action:
1. Provide a clear title
2. Rate its urgency (high/medium/low)
3. Rate its impact (high/medium/low)
4. Explain why this action is important
5. Suggest potential obstacles I might face

Format your response in a clear, structured way.`;

    setPrompt(generatedPrompt);
  }, [target]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const openChatGpt = () => {
    window.open('https://chat.openai.com', '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          ChatGPT Prompt Generator
        </h3>
        <Button onClick={openChatGpt} variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open ChatGPT
        </Button>
      </div>

      <div className="relative">
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyPrompt}
            className="text-gray-500 hover:text-gray-700"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
          {prompt}
        </pre>
      </div>

      <div className="text-sm text-gray-600">
        <p>Instructions:</p>
        <ol className="list-decimal ml-4 space-y-1">
          <li>Click "Open ChatGPT" to open ChatGPT in a new tab</li>
          <li>Click the copy button to copy the prompt</li>
          <li>Paste the prompt into ChatGPT</li>
          <li>Copy the response and use it to create actions</li>
        </ol>
      </div>
    </div>
  );
}