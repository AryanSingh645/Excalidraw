type Shape =
    {
        type: "rect";
        x: number;
        y: number;
        width: number;
        height: number;
    }
    | {
        type: "circle";
        centerX: number;
        centerY: number;
        radius: number;
      };

export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    let existingShapes : Shape[] = []

    let startX = 0;
    let startY = 0;
    let clicked = false;

    if (!ctx) return;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    canvas.addEventListener("mousedown", (e) => {
        console.log("x:", e.clientX);
        console.log("y:", e.clientY);
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
}

function clearCanvas(ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement, existingShapes : Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach((s) => {
        if(s.type == "rect"){
            ctx.strokeRect(s.x, s.y, s.width, s.height)
        }
    })
}
