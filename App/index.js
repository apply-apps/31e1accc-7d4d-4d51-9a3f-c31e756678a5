// Filename: index.js
// Combined code from all files
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GRID_SIZE = 20;
const CELL_SIZE = Math.floor(Dimensions.get('window').width / GRID_SIZE);

const UP = 'UP';
const DOWN = 'DOWN';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

function getRandomCoords() {
  const x = Math.floor(Math.random() * GRID_SIZE);
  const y = Math.floor(Math.random() * GRID_SIZE);
  return [x, y];
}

export default function App() {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState(getRandomCoords());
  const [direction, setDirection] = useState(RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoop = useRef(null);

  useEffect(() => {
    gameLoop.current = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop.current);
  }, [direction, snake]);

  useEffect(() => {
    const handleTouch = (e) => {
      const { locationX, locationY } = e.nativeEvent;
      const xDiff = locationX - (CELL_SIZE * snake[0][0]);
      const yDiff = locationY - (CELL_SIZE * snake[0][1]);

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // Horizontal swipe
        if (xDiff > 0) setDirection(RIGHT);
        else setDirection(LEFT);
      } else {
        // Vertical swipe
        if (yDiff > 0) setDirection(DOWN);
        else setDirection(UP);
      }
    };
    document.addEventListener('touchstart', handleTouch);

    return () => {
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [snake]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[0]];

    switch (direction) {
      case UP:
        head[1] -= 1;
        break;
      case DOWN:
        head[1] += 1;
        break;
      case LEFT:
        head[0] -= 1;
        break;
      case RIGHT:
        head[0] += 1;
        break;
      default:
        break;
    }

    if (head[0] >= GRID_SIZE || head[1] >= GRID_SIZE || head[0] < 0 || head[1] < 0 || snake.some(cell => cell[0] === head[0] && cell[1] === head[1])) {
      setIsGameOver(true);
      clearInterval(gameLoop.current);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandomCoords());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake([[5, 5]]);
    setFood(getRandomCoords());
    setDirection(RIGHT);
    setIsGameOver(false);
    gameLoop.current = setInterval(moveSnake, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <View style={styles.row} key={row}>
            {Array.from({ length: GRID_SIZE }).map((_, col) => (
              <View
                key={col}
                style={[
                  styles.cell,
                  snake.some((segment) => segment[0] === col && segment[1] === row) && styles.snake,
                  food[0] === col && food[1] === row && styles.food,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      {isGameOver && (
        <Text style={styles.gameOverText}>Game Over</Text>
      )}
      <TouchableOpacity onPress={resetGame} style={styles.button}>
        <Text style={styles.buttonText}>{isGameOver ? 'Restart' : 'Start'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  grid: {
    width: CELL_SIZE * GRID_SIZE,
    height: CELL_SIZE * GRID_SIZE,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  snake: {
    backgroundColor: 'green',
  },
  food: {
    backgroundColor: 'red',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: 'red',
  },
  button: {
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});