import * as React from 'react';
import { useState } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

interface InteractiveProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
  onValueChange: (value: number) => void;
}

export const InteractiveProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  InteractiveProgressProps
>(({ className, value, onValueChange, ...props }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateProgressFromMouse(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateProgressFromMouse(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateProgressFromMouse = (e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newValue = Math.round(Math.max(0, Math.min(100, (x / width) * 100)));
    onValueChange(newValue);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-gray-200 cursor-pointer',
        className
      )}
      {...props}
      onMouseDown={handleMouseDown}
      style={{ touchAction: 'none' }}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-blue-600 transition-transform duration-100"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      <div 
        ref={progressRef}
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
      />
    </ProgressPrimitive.Root>
  );
});

InteractiveProgress.displayName = 'InteractiveProgress';