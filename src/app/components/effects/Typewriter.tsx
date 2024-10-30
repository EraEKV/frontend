// components/Typewriter.tsx

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  sentences: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  delayBetweenSentences?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({
  sentences,
  typingSpeed = 50,
  erasingSpeed = 30,
  delayBetweenSentences = 2000,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isTyping) {
      if (currentIndex < sentences[currentSentence].length) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev + sentences[currentSentence][currentIndex]);
          setCurrentIndex((prev) => prev + 1);
          setIsPaused(false);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsPaused(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
          setIsPaused(false);
        }, delayBetweenSentences);
        return () => clearTimeout(timer);
      }
    } else {
      if (currentIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
          setIsPaused(false);
        }, erasingSpeed);
        return () => clearTimeout(timer);
      } else {
        setCurrentSentence((prev) => (prev + 1) % sentences.length);
        setIsTyping(true);
        setIsPaused(false);
      }
    }
  }, [currentIndex, currentSentence, isTyping, sentences, typingSpeed, erasingSpeed, delayBetweenSentences]);

  return (
    <div className="text-2xl font-bold flex items-center">
      {displayedText}
      <span className={`apple-cursor ${isPaused ? 'blink' : ''}`}></span>
    </div>

  );
};

export default Typewriter;