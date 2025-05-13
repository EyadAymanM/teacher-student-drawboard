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

    // Get proper coordinates relative to canvas
    function getCoordinates(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function startPosition(e: MouseEvent) {
      drawState.current = true;
      const coords = getCoordinates(e);
      socket?.emit('draw:start', coords)
      // Begin a new path and move to the starting position
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      draw(e)
    }

    function finishedPosition() {
      drawState.current = false;
      socket?.emit('draw:stop', false)
    }

    function draw(e: MouseEvent) {
      if (!drawState.current) return;

      const coords = getCoordinates(e);
      socket?.emit('drawing', coords)

      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    // Add proper event listeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", finishedPosition); // Stop drawing if mouse leaves canvas

    // Clean up event listeners on unmount
    return () => {
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("mouseup", finishedPosition);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", finishedPosition);
    };
  }, [socket]);

  return (
    <div className="w-screen h-screen p-10">
      <canvas ref={canvasRef} className="border h-full w-full"></canvas>
    </div>
  );
}