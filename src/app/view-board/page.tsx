'use client';

import { useSocket } from "@/Providers/SocketProvider";
import { useEffect, useRef } from "react";

export default function Draw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawState = useRef<boolean>(false);
  const socket = useSocket();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the context only once and store it
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up initial canvas size to match its display size
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    resizeCanvas();

    // Configure drawing settings
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    
    socket?.on('draw:start',(coords)=>{
      console.log('draw start');
      
      // Begin a new path and move to the starting position
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
  
    });

    
    socket?.on('draw:stop',(state)=>{
      console.log('draw stop');
      
      drawState.current = state;
    });
      
    socket?.on('drawing', (coords) => {
      console.log('drawing');
      
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    });
    
    return () => {
      socket?.off('draw:start');
      socket?.off('draw:stop');
      socket?.off('drawing');
    };
  }, [socket]);

  return (
    <div className="w-screen h-screen p-10">
      <canvas ref={canvasRef} className="border h-full w-full"></canvas>
    </div>
  );
}