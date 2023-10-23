import React, { useEffect, useState, useRef } from 'react';
import { Stage, Sprite, TilingSprite, Graphics, Text } from '@pixi/react';
import { Texture } from 'pixi.js';

import blue from '../../assests/blue.png';
import green from '../../assests/green.png';
import red from '../../assests/red.png';
import backgroundImage from '../../assests/backgroundImage.png';
import one from '../../assests/one.png';
import backgroundMusicFile from '../../assests/backgroundMusic.mp3';
import archery from '../../assests/archery.png';
import arrow from '../../assests/arrow.png';

const wordList = ["Cake", "Fake", "Lake", "Make", "Dog", "Jog", "Log", "Blog", "Shake", "Bake", "Wake", "Flog", "Clog", "Bog"];

const relatedWords = {
  "Cake": ["Fake", "Lake", "Make", "Shake", "Bake", "Wake"],
  "Fake": ["Cake", "Lake", "Make", "Shake", "Bake", "Wake"],
  "Lake": ["Cake", "Fake", "Make", "Shake", "Bake", "Wake"],
  "Make": ["Cake", "Fake", "Lake", "Shake", "Bake", "Wake"],
  "Shake": ["Cake", "Fake", "Lake", "Make", "Bake", "Wake"],
  "Bake": ["Cake", "Fake", "Lake", "Make", "Shake", "Wake"],
  "Wake": ["Cake", "Fake", "Lake", "Make", "Bake", "Shake"],
  "Dog": ["Jog", "Log", "Blog", "Flog", "Clog", "Bog"],
  "Jog": ["Dog", "Log", "Blog", "Flog", "Clog", "Bog"],
  "Log": ["Dog", "Jog", "Blog", "Flog", "Clog", "Bog"],
  "Blog": ["Dog", "Jog", "Log", "Flog", "Clog", "Bog"],
  "Flog": ["Jog", "Log", "Blog", "Dog", "Clog", "Bog"],
  "Clog": ["Jog", "Log", "Blog", "Flog", "Dog", "Bog"],
  "Bog": ["Jog", "Log", "Blog", "Flog", "Clog", "Dog"],
};

const lightBrown = 0xD1B482;

const Balloon = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [balloons, setBalloons] = useState([]);
  const [isOverGameScreen, setIsOverGameScreen] = useState(false);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(() => {
    const storedHighestScore = localStorage.getItem('highestScore');
    return storedHighestScore ? parseInt(storedHighestScore, 10) : 0;
  });
  const [correctWord, setCorrectWord] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [level, setLevel] = useState(1);
  const [balloonSpeed, setBalloonSpeed] = useState(1);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isBackgroundMusicPlaying, setBackgroundMusicPlaying] = useState(true);
  const backgroundTexture = Texture.from(backgroundImage);
  const [showArcheryImage, setShowArcheryImage] = useState(false);

  const audioRef = useRef(null);
  const [hasInteractedWithAudio, setHasInteractedWithAudio] = useState(false);
  const [isBackgroundMusicPaused, setBackgroundMusicPaused] = useState(true);
  const [pathCoordinates, setPathCoordinates] = useState({ x: 0, y: 0 });
  const [arrowAngle, setArrowAngle] = useState(0);
  // Add arrow position state
 const [targetBalloonPosition, setTargetBalloonPosition] = useState({ x: 0, y: 0 });
const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
const [showArrow, setShowArrow] = useState(false);

  const toggleBackgroundMusic = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setBackgroundMusicPlaying(true);
      setBackgroundMusicPaused(false);
    } else {
      audioRef.current.pause();
      setBackgroundMusicPlaying(false);
      setBackgroundMusicPaused(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = backgroundMusicFile;
    }
  }, []);

  useEffect(() => {
    const initialBalloons = [];
    const randomCorrectWord = getRandomWord();
    setCorrectWord(randomCorrectWord);

    for (let i = 0; i < 10; i++) {
      let randomWord;
      do {
        randomWord = getRandomWord();
      } while (randomWord === randomCorrectWord);

      initialBalloons.push(generateBalloon(randomWord, true));
    }

    setBalloons(initialBalloons);

    const animate = () => {
      moveBalloons();
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const getRandomWord = () => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  };

  const generateBalloon = (word, isInteractive = true) => {
    const colors = [Texture.from(blue), Texture.from(green), Texture.from(red)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight - 200);
    const speedX = Math.random() * 2 - 1;
    const speedY = -Math.random() * 2;

    const textX = x;
    const textY = y - 40;

    return { texture: randomColor, x, y, speedX, speedY, word, isInteractive, textX, textY };
  };

  const moveBalloons = () => {
    setBalloons((prevBalloons) => {
      return prevBalloons.map((balloon) => {
        const newX = balloon.x + balloon.speedX * balloonSpeed;
        const newY = balloon.y + balloon.speedY * balloonSpeed;

        if (newX > window.innerWidth || newX < -100 || newY < -100) {
          return generateBalloon(balloon.word);
        }

        return { ...balloon, x: newX, y: newY };
      });
    });
  };

  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsOverGameScreen(true);
  };

  const handleMouseLeave = () => {
    setIsOverGameScreen(false);
  };


  // Define the position of the archery image
const archeryX = window.innerWidth / 2;
const archeryY = window.innerHeight - 195;

 // Create a function to handle the arrow animation
 const animateArrow = () => {
  const duration = 100; // Animation duration in milliseconds
  const interval = 16; // Update interval in milliseconds
  const frames = duration / interval;

  const deltaX = (targetBalloonPosition.x - archeryX) / frames;
  const deltaY = (targetBalloonPosition.y - archeryY) / frames;

  const angle = Math.atan2(deltaY, deltaX);
  setArrowAngle(angle);

  let currentFrame = 0;

  const animationInterval = setInterval(() => {
    if (currentFrame < frames) {
      setArrowPosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY,
      }));
      currentFrame++;
    } else {
      clearInterval(animationInterval);
      setShowArrow(false);
    }
  }, interval);
};

useEffect(() => {
  if (showArrow) {
    animateArrow();
  }
}, [showArrow]);



// Update your handleBalloonClick function to trigger the arrow animation
const handleBalloonClick = (index, clickedWord) => {
  if (correctWord && relatedWords[correctWord] && clickedWord) {
    const lowercaseCorrectWord = correctWord.toLowerCase();
    const lowercaseClickedWord = clickedWord.toLowerCase();
    const lowercaseRelatedWords = relatedWords[correctWord].map((word) =>
      word.toLowerCase()
    );

    setBalloons((prevBalloons) => {
      const newBalloons = [...prevBalloons];
      if (newBalloons[index]) {
        if (
          lowercaseClickedWord === lowercaseCorrectWord ||
          lowercaseRelatedWords.includes(lowercaseClickedWord)
        ) {
          newBalloons.splice(index, 1);

          if (newBalloons[index]) {
            newBalloons[index].isInteractive = false;
          }

          const newScore = score + 1;
          setScore(newScore);

          if (newScore > highestScore) {
            setHighestScore(newScore);
            localStorage.setItem('highestScore', newScore.toString());
          }

          if (newScore % 5 === 0) {
            setLevel(level + 1);
            setBalloonSpeed(balloonSpeed + 2);
            setIsLevelComplete(true);
          }

          setImagePosition({ x: balloons[index].x, y: balloons[index].y });
          setShowImage(true);
          setTimeout(() => {
            setShowImage(false);
          }, 1000);

          // Trigger arrow animation
          setTargetBalloonPosition({
            x: balloons[index].x,
            y: balloons[index].y,
          });
          setArrowPosition({ x: archeryX, y: archeryY });
          setShowArrow(true);
        } else {
          handleGameOver();
        }
      }
      return newBalloons;
    });
  }
};

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsGameActive(false);
  };

  const handlePlayAgain = () => {
    setIsGameOver(false);
    setIsGameActive(true);

    const initialBalloons = [];
    const randomCorrectWord = getRandomWord();
    setCorrectWord(randomCorrectWord);

    for (let i = 0; i < 10; i++) {
      let randomWord;
      do {
        randomWord = getRandomWord();
      } while (randomWord === randomCorrectWord);

      initialBalloons.push(generateBalloon(randomWord, true));
    }

    setBalloons(initialBalloons);
    setScore(0);
    setLevel(1);
    setBalloonSpeed(1);
    setIsLevelComplete(false);
  };

  function getFontSizeForBalloon(balloon) {
    switch (balloon.texture) {
      case Texture.from(blue):
        return 360;
      case Texture.from(green):
        return 900;
      case Texture.from(red):
        return 700;
      default:
        return 360;
    }
  }

  const handleNextLevel = () => {
    setIsLevelComplete(false);
    setIsGameActive(true);

    const initialBalloons = [];
    const randomCorrectWord = getRandomWord();
    setCorrectWord(randomCorrectWord);

    for (let i = 0; i < 10; i++) {
      let randomWord;
      do {
        randomWord = getRandomWord();
      } while (randomWord === randomCorrectWord);

      initialBalloons.push(generateBalloon(randomWord, true));
    }

    setBalloons(initialBalloons);
    setScore(score);
    setLevel(level);
    setBalloonSpeed(balloonSpeed + 2);
  };

  const renderLevelText = () => {
    if (isGameOver) {
      return "Game Over";
    } else if (isLevelComplete) {
      return `Level ${level - 1} Completed`;
    } else {
      return `Level: ${level}`;
    }
  };

  useEffect(() => {
    const handleMouseMoveForPath = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      setPathCoordinates({ x: mouseX, y: mouseY });
    };

    window.addEventListener("mousemove", handleMouseMoveForPath);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveForPath);
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={isGameActive ? 'target-cursor' : ''}
      style={{ overflow: 'hidden' }}
    >
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <TilingSprite texture={backgroundTexture} width={window.innerWidth} height={window.innerHeight} />

        <Graphics
          draw={(g) => {
            g.beginFill(lightBrown);
            g.drawRect(0, window.innerHeight - 200, window.innerWidth, 200);
            g.endFill();
          }}
        />

        <Graphics
          draw={(g) => {
            g.clear();
            g.lineStyle(2, 0xff0000);
            g.moveTo(window.innerWidth / 2, window.innerHeight - 195);
            g.lineTo(pathCoordinates.x, pathCoordinates.y);
          }}
        />

        {balloons.map((balloon, index) => (
          <Sprite
            key={index}
            texture={balloon.texture}
            x={balloon.x}
            y={balloon.y}
            anchor={0.5}
            width={80}
            height={80}
            interactive={isGameActive ? 'auto' : 'none'}
            pointerdown={() => isGameActive && handleBalloonClick(index, balloon.word)}
          >
            <Text
              text={balloon.word}
              style={{
                fill: 'black',
                fontSize: getFontSizeForBalloon(balloon),
                align: 'center',
              }}
              anchor={0.5}
              x={20}
              y={10}
            />
          </Sprite>
        ))}

        {!isGameOver && !isLevelComplete && balloons.findIndex((balloon) => balloon.word === correctWord) === -1 && (
          <Text
            text={correctWord}
            style={{
              fill: 'black',
              fontSize: 30,
              align: 'center',
            }}
            anchor={0.5}
            x={window.innerWidth / 2}
            y={window.innerHeight - 100}
          />
        )}

{showArrow && (
  <Sprite
    texture={Texture.from(arrow)}
    x={arrowPosition.x}
    y={arrowPosition.y}
    anchor={0.5}
    width={80}
    height={50}
    rotation={arrowAngle} // Set the rotation
  />
)}

      </Stage>
       
       
      {/* Display the archery image on top of the "soil" area word */}
      <div
        style={{
          position: 'absolute',
          bottom: 100, // Adjust this value to position the image within the soil area
          marginLeft:'910px',
          alignItems:'center', 
          zIndex: 1000, // Make sure the z-index is higher than other elements
        }}
      >
        <img src={archery} alt="Archery" style={{ width: '100px', height: '100px' }} />
      </div>
       

      {isGameOver && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '40px', color: 'white', marginBottom: '20px' }}>Game Over</div>
          <button onClick={handlePlayAgain} style={{ fontSize: '30px', padding: '10px 20px' }}>
            Play Again
          </button>
        </div>
      )}

      {isLevelComplete && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '40px', color: 'white', marginBottom: '20px' }}>{renderLevelText()}</div>
          <button onClick={handleNextLevel} style={{ fontSize: '30px', padding: '10px 20px' }}>
            Next Level
          </button>
        </div>
      )}

      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: '1000' }}>
        <div
          style={{
            fontSize: '30px',
            color: 'black',
          }}
        >
          Level: {level}
        </div>
      </div>

      <div style={{ marginLeft: '150px', textAlign: 'left', position: 'absolute', bottom: '15px', width: '100%' }}>
        <p style={{ fontSize: '30px', color: 'black' }}>Highest Score: {highestScore}</p>
        <p style={{ fontSize: '30px', color: 'black' }}>Score: {score}</p>
      </div>

      {showImage && (
        <div
          style={{
            position: 'fixed',
            top: imagePosition.y ,
            left: imagePosition.x ,
            zIndex: '1000',
          }}
        >
          <img src={one} alt="Burst Balloon" style={{ width: '50px', height: '50px' }} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: '1000',
        }}
      >
        <button
          onClick={toggleBackgroundMusic}
          style={{
            fontSize: '24px',
            padding: '10px 20px',
            backgroundColor: '#3DDC84' ,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {isBackgroundMusicPaused ? 'Play Music' : 'Pause Music'}
        </button>
      </div>

      <audio ref={audioRef} preload="auto" loop></audio>
    </div>
  );
};

export default Balloon;
