import React from 'react';
import './index.scss'

interface ScreenSplitIconProps {
  x: number;
  y: number;
  size?: number;
}

const ScreenSplitIcon: React.FC<ScreenSplitIconProps> = ({ x, y,size=50 }) => {
  // 创建一个二维数组来存储每个单元格
  const grid: null[][] = Array.from({ length: y }, () =>
    Array.from({ length: x }, () => null)
  );

  return (
    <div className="screen-split-icon">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((_, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="cell" style={{width:size,height:size}}/>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScreenSplitIcon;