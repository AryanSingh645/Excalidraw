"use client"
import Canvas from "@/components/Canvas";
import { initDraw } from "@/draw";
import { SocketProvider, useSocket } from "@/hooks/useSocket";
import {useEffect, useRef} from "react"
export default function Home() {

  return (
    <SocketProvider>
      <Canvas/>
    </SocketProvider>
  );
}
