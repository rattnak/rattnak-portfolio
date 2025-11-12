'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
  interval?: number; // milliseconds between slides
}

export default function ImageSlider({ images, interval = 3000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 500); // Half of the animation duration
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 500);
  };

  const goToPrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 500);
  };

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div
      className="hidden md:flex items-center justify-center overflow-hidden"
      style={{
        height: '100%',
        minHeight: '500px',
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '0.75rem',
        border: '2px solid var(--border)',
        position: 'relative'
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex
                ? 'translateX(0)'
                : index < currentIndex
                  ? 'translateX(-100%)'
                  : 'translateX(100%)',
              transition: isAnimating ? 'all 0.5s ease-in-out' : 'none',
            }}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '0.75rem'
              }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '1.5rem',
          zIndex: 10,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
        aria-label="Previous image"
      >
        ‹
      </button>

      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '1.5rem',
          zIndex: 10,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
        aria-label="Next image"
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10,
        }}
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === currentIndex
                ? 'var(--accent-primary)'
                : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
