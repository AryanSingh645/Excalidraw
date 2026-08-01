import { Shape } from "@/utils/types";
import { CHAT } from "@repo/common/constants";

export function initDraw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, socket : WebSocket | null, existingShapes : Shape[]) {

    let startX = 0;
    let startY = 0;
    let clicked = false;

    if (!ctx) return;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    canvas.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        clicked = true;
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        })
        if(socket){
            console.log("message sent")
            socket.send(JSON.stringify({
                message: {
                    type: "rect",
                    x: startX,
                    y: startY,
                    width: e.clientX - startX,
                    height: e.clientY - startY
                },
                type: CHAT,
                roomId: 1
            }))
        }

    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            clearCanvas(ctx, canvas, existingShapes)
            ctx.strokeRect(
                startX,
                startY,
                e.clientX - startX,
                e.clientY - startY,
            );
        }
    });

    window.addEventListener("mouseup", (e) => {
        clicked = false;
        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        })
    })
}

export function clearCanvas(ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement, existingShapes : Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach((s) => {
        if(s.type == "rect"){
            ctx.strokeRect(s.x, s.y, s.width, s.height)
        }
    })
}
