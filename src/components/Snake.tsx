import React from 'react';

interface SnakeProps {
    segments: Array<{ x: number; y: number }>;
}

const Snake: React.FC<SnakeProps> = ({ segments }) => {
    return (
        <div>
            {segments.map((segment, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        width: '20px',
                        height: '20px',
                        background: 'green',
                        left: `${segment.x * 20}px`,
                        top: `${segment.y * 20}px`,
                    }}
                />
            ))}
        </div>
    );
};

export default Snake;
