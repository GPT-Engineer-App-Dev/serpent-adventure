import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };

const Index = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(100);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Wrap around the grid
    head.x = (head.x + GRID_SIZE) % GRID_SIZE;
    head.y = (head.y + GRID_SIZE) % GRID_SIZE;

    // Check for self-collision
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1);
      // Generate new food
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(moveSnake, speed);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [moveSnake, speed]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Snake Game</h1>
        <div className="flex justify-between mb-4">
          <Badge variant="secondary" className="text-lg">Score: {score}</Badge>
          <Badge variant="secondary" className="text-lg">High Score: {highScore}</Badge>
        </div>
        <div
          className="border-4 border-gray-300 rounded-lg overflow-hidden"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            position: 'relative',
            backgroundColor: '#f0f0f0',
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              className="rounded-full"
              style={{
                position: 'absolute',
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: index === 0 ? '#4CAF50' : '#8BC34A',
                border: '1px solid #45a049',
                zIndex: snake.length - index,
              }}
            />
          ))}
          <div
            className="rounded-full"
            style={{
              position: 'absolute',
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: '#FF5722',
              boxShadow: '0 0 10px #FF5722',
            }}
          />
        </div>
        {gameOver && (
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold mb-2 text-red-600">Game Over!</p>
            <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white">Restart</Button>
          </div>
        )}
        <div className="mt-4">
          <p className="mb-2 text-gray-700">Speed:</p>
          <Slider
            min={50}
            max={200}
            step={10}
            value={[speed]}
            onValueChange={(value) => setSpeed(200 - value[0] + 50)}
          />
        </div>
        <p className="mt-4 text-center text-gray-600">Use arrow keys to control the snake</p>
      </div>
    </div>
  );
};

export default Index;