import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Space } from 'antd';
import { Button, Typography } from '@douyinfe/semi-ui';
import { formatMs } from '@/utils/index';

const {Title} = Typography;

const ChronoComponent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [counter, setCounter] = useState(0);
  const previousRafDateRef = useRef(Date.now());
  const requestIdRef:any = useRef(null);

  const rafCallback = useCallback(() => {
    const deltaMs = Date.now() - previousRafDateRef.current;
    previousRafDateRef.current = Date.now();
    setCounter((prevCounter) => prevCounter + deltaMs);
    requestIdRef.current = requestAnimationFrame(rafCallback);
  }, []);

  useEffect(() => {
    if (isRunning) {
      previousRafDateRef.current = Date.now();
      requestIdRef.current = requestAnimationFrame(rafCallback);
    } else {
      cancelAnimationFrame(requestIdRef.current);
    }
  }, [isRunning, rafCallback]);

  const resume = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setCounter(0);
    setIsRunning(false);
    cancelAnimationFrame(requestIdRef.current);
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
      <Card style={{width:'50%'}} styles={{body:{display:'flex', justifyContent:'center', alignItems:'center'}}}>
        <Title>{formatMs(counter)}</Title>
      </Card>
      <Space style={{marginTop:'10px'}}>
        {!isRunning ? (
          <Button onClick={resume} type="primary" theme='solid'>开始</Button>
        ) : (
          <Button type='danger' onClick={pause} theme='solid'>停止</Button>
        )}
        <Button onClick={reset} type='warning' theme='solid'>重置</Button>
      </Space>
    </div>
  );
};

export default ChronoComponent;