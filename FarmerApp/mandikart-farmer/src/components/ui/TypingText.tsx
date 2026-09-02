/**
 * MandiKart — Animated Typing Text Component
 * 
 * Provides dynamic typing & erasing animation with blinking cursor for taglines.
 */

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface TypingTextProps {
  phrases: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delayBetweenPhrases?: number;
  style?: any;
  cursorStyle?: any;
}

export function TypingText({
  phrases,
  typingSpeed = 60,
  deleteSpeed = 30,
  delayBetweenPhrases = 2000,
  style,
  cursorStyle,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing & deleting loop
  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex % phrases.length];

    let timer: any;

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Pause at full phrase before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenPhrases);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex, phrases, typingSpeed, deleteSpeed, delayBetweenPhrases]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]}>
        {displayedText}
        <Text style={[styles.cursor, cursorStyle, { opacity: showCursor ? 1 : 0 }]}>|</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E8F5E9',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  cursor: {
    color: '#FFB74D',
    fontWeight: '700',
    fontSize: 16,
  },
});
