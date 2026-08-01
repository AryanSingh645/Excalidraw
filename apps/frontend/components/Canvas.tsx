import { clearCanvas, initDraw } from "@/draw";
import { useSocket } from "@/hooks/useSocket";
import { Shape } from "@/utils/types";
import { JOIN_ROOM } from "@repo/common/constants";
import React, { useEffect, useRef, useState } from "react";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [existingShapes, setExistingShapes] = useState<Shape[]>([])

    const { socket } = useSocket();
    useEffect(() => {
        if (socket) {
            socket.send(
                JSON.stringify({
                    type: JOIN_ROOM,
                    roomId: 1,
                }),
            );
        }
    }, [socket]);
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;

            const ctx = canvas.getContext("2d");
            if(!ctx) return;

            if (socket) {
                console.log("Inside socket conditional block");
                socket.onmessage = (event) => {
                    console.log("message event catched", event);
                    if(!event || !event.data) return;

                    const parsedEvent = JSON.parse(event.data);
                    console.log(parsedEvent, "parsedEvent")
                    existingShapes.push(parsedEvent.message)
                    clearCanvas(ctx, canvas, existingShapes)

                };
                console.log(socket);
            }
            initDraw(canvas, ctx, socket, existingShapes);
        }
    }, [canvasRef, socket]);

    return (
        <div className="">
            <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                className="bg-black"
            ></canvas>
        </div>
    );
};

export default Canvas;
