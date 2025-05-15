'use client';

import { useSocket } from "@/Providers/SocketProvider";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface ISettings {
  color: string; size: number
}
export default function Draw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D|null>(null);
  const drawState = useRef<boolean>(false);
  const socket = useSocket();
  const { boardId } = useParams();
  const [settings,setSettings] = useState<ISettings>({color:"black",size:6})
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    // Join the specific board room when component mounts
    socket?.emit('join-board', boardId);


    // Get the context only once and store it
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Store ctx in ref so we can access it outside this effect
    ctxRef.current = ctx;

    // Set up initial canvas size to match its display size
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    resizeCanvas();

    // Configure drawing settings
    ctx.lineWidth = settings.size;
    ctx.lineCap = "round";
    ctx.strokeStyle = settings.color;

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
      socket?.emit('draw:start', coords, boardId,settings)
      // Begin a new path and move to the starting position
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      draw(e)
    }

    function finishedPosition() {
      drawState.current = false;
      socket?.emit('draw:stop', false, boardId, settings)
    }

    function draw(e: MouseEvent) {
      if (!drawState.current) return;

      const coords = getCoordinates(e);
      socket?.emit('drawing', coords, boardId, settings)

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
  }, [socket, boardId]);
  
  useEffect(()=>{
    const ctx = ctxRef.current;
    if(!ctx) return;

    // Update drawing settings without resetting canvas
    ctx.lineWidth = settings.size;
    ctx.strokeStyle = settings.color;
  },[settings.color, settings.size])

  return (
    <div className="w-screen h-screen p-10">
      <input type="color" name="color" id="color" onChange={(e:ChangeEvent)=>setSettings({...settings,color:e.target.value})} />
      <input type="range" name="" min={2} max={20} id="" onChange={(e: ChangeEvent) => setSettings({ ...settings, size: e.target.value })} />
      <canvas ref={canvasRef} className="border h-full w-full cursor-crosshair"></canvas>
    </div>
  );
}