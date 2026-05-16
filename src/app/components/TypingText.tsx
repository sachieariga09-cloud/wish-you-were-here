import { useState, useEffect } from 'react';

interface TypingTextProps {
  lines: string[];
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  lineClassName?: (lineIndex: number) => string | undefined;
}

export function TypingText({
  lines,
  speed = 50,
  className,
  style,
  lineClassName,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => {
          const newText = [...prev];
          if (newText[currentLineIndex] === undefined) {
            newText[currentLineIndex] = '';
          }
          newText[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newText;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentLineIndex < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, speed]);

  return (
    <div className={className} style={style}>
      {displayedText.map((line, index) => (
        <p
          key={index}
          className={[lineClassName?.(index), 'mb-0 leading-[60px]']
            .filter(Boolean)
            .join(' ')}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
