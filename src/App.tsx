import React, {useCallback, useEffect, useState} from "react";

import "./App.css";
import Snake from "./components/Snake";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGesture } from 'react-use-gesture';

const App: React.FC = () => {
    const [snakeSegments, setSnakeSegments] = useState([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState("Right");
    const [target, setTarget] = useState({ x: 5, y: 5 });
    const [isGameOver, setIsGameOver] = useState(false);

    const handleGameOver = useCallback(() => {
        setIsGameOver(true);
    }, []);


    const handleRestartGame = () => {
        setIsGameOver(false);
        setSnakeSegments([{ x: 0, y: 0 }]);
        setDirection("Right");
        generateNewTarget();
    };

    const generateNewTarget = useCallback(() => {
        const x = Math.floor(Math.random() * 19);
        const y = Math.floor(Math.random() * 19);

        setTarget({ x, y });
    }, []);

    const moveSnake = useCallback(() => {
        const newSegments = [...snakeSegments];
        const head = { ...newSegments[0] };

        switch (direction) {
            case "Right":
                head.x += 1;
                break;
            case "Left":
                head.x -= 1;
                break;
            case "Up":
                head.y -= 1;
                break;
            case "Down":
                head.y += 1;
                break;
            default:
                break;
        }

        if (head.x < 0 || head.x >= 19 || head.y < 0 || head.y >= 19) {
            handleGameOver();
            return;
        }

        newSegments.unshift(head);

        if (head.x === target.x && head.y === target.y) {
            generateNewTarget();
        } else {
            newSegments.pop();
        }

        setSnakeSegments(newSegments);
    }, [snakeSegments, direction, target, generateNewTarget, handleGameOver]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowRight":
                    setDirection("Right");
                    break;
                case "ArrowLeft":
                    setDirection("Left");
                    break;
                case "ArrowUp":
                    setDirection("Up");
                    break;
                case "ArrowDown":
                    setDirection("Down");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        const interval = setInterval(moveSnake, 100);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearInterval(interval);
        };
    }, [moveSnake, direction]);

    const handleTouch = useGesture({
        onDrag: (state) => {
            const { vxvy: [vx, vy] } = state;

            if (Math.abs(vx) > Math.abs(vy)) {
                if (vx > 0) {
                    setDirection("Right");
                } else {
                    setDirection("Left");
                }
            } else {
                if (vy > 0) {
                    setDirection("Down");
                } else {
                    setDirection("Up");
                }
            }
        },
    });

    return (
        <div className="App">
            <div
                className="GameArea position-relative border border-dark bg-light p-3 rounded"
                {...handleTouch()}
            >
                <Snake segments={snakeSegments} />
                <div
                    className="Target position-absolute bg-danger"
                    style={{
                        width: '20px',
                        height: '20px',
                        left: `${target.x * 20}px`,
                        top: `${target.y * 20}px`,
                    }}
                />
            </div>

            <Modal show={isGameOver} onHide={() => setIsGameOver(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">Game Over!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-dark">Score: {snakeSegments.length - 1}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => window.close()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRestartGame}>
                        Restart Game
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default App;
