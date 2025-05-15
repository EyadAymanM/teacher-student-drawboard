'use client';

import { useSocket } from "@/Providers/SocketProvider";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

interface ISettings {
  color: string; size: number
}

export default function ViewBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawState = useRef<boolean>(false);
  const socket = useSocket();
  const { boardId } = useParams();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Join the specific board room when component mounts
    socket?.emit('join-board', boardId);

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
    ctx.lineCap = "round";


    socket?.on('draw:start', (coords, settings:ISettings) => {
      console.log(settings);

      // Begin a new path and move to the starting position

      
      ctx.beginPath();
      ctx.lineWidth = settings.size;
      ctx.strokeStyle = settings.color;
      ctx.moveTo(coords.x, coords.y);

    });


    socket?.on('draw:stop', (state, settings:ISettings) => {
      console.log('draw stop');

      ctx.lineWidth = settings.size;
      ctx.strokeStyle = settings.color;

      drawState.current = state;
    });

    socket?.on('drawing', (coords, settings:ISettings) => {
      console.log('drawing');

      ctx.lineWidth = settings.size;
      ctx.strokeStyle = settings.color;

      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    });

    return () => {
      socket?.off('draw:start');
      socket?.off('draw:stop');
      socket?.off('drawing');
    };
  }, [socket, boardId]);

  return (
    <div className="w-screen h-screen p-10">
      <canvas ref={canvasRef} className="border h-full w-full"></canvas>
    </div>
  );
}