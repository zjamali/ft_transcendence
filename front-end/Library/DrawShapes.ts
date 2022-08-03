import { Data } from "./Data";

export function drawGame(context: object, data: Data) {
  drawRect(0, 0, data.get_Width(), data.get_Height(), "#000", context);
  drawBorder(
    0,
    0,
    data.get_Width(),
    0,
    "#FFF",
    data.get_borderHeight(),
    context
  );
  drawBorder(
    0,
    data.get_Height(),
    data.get_Width(),
    data.get_Height(),
    "#FFF",
    data.get_borderHeight(),
    context
  );
  drawTextOne(
    data.get_Score_One(),
    data.get_Width() / 4,
    data.get_Height() / 5,
    "#FFF",
    context
  );
  drawTextTwo(
    data.get_Score_Two(),
    (3 * data.get_Width()) / 4,
    data.get_Height() / 5,
    "#FFF",
    context
  );
  drawSeparator(
    data.get_Trace_X(),
    data.get_Trace_Y(),
    data.get_Trace_Width(),
    data.get_Trace_Height(),
    data.get_traceHeight(),
    "#FFF",
    context,
    data.get_Height()
  );
  drawRect(
    data.get_Left_Pddle_X(),
    data.get_PddleLeft_Y(),
    data.get_Paddle_Width(),
    data.get_Paddle_Height(),
    "#FFF",
    context
  );
  drawRect(
    data.get_Right_Pddle_X(),
    data.get_PddleRight_Y(),
    data.get_Paddle_Width(),
    data.get_Paddle_Height(),
    "#FFF",
    context
  );
  DrawCircle(
    data.get_Ball_X(),
    data.get_Ball_Y(),
    data.get_Ball_Radius(),
    "#ffff00",
    context
  );
}

function drawRect(
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  context: any
) {
  context.beginPath();
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

export function DrawCircle(
  x: number,
  y: number,
  r: number,
  color: string,
  context: any
) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
}

function drawTextOne(
  text: number,
  x: number,
  y: number,
  color: string,
  context: any
) {
  context.fillStyle = color;
  context.font = "40px 'Press Start 2P', cursive";
  context.fillText(text, x, y);
}

function drawTextComplet(
  text: string,
  x: number,
  y: number,
  color: string,
  context: any
) {
  context.fillStyle = color;
  context.font = "20px 'Press Start 2P', cursive";
  context.fillText(text, x, y);
}

function drawBorder(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  borderHeight: number,
  context: any
) {
  context.strokeStyle = color;
  context.lineWidth = borderHeight;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function drawSeparator(
  x: number,
  y: number,
  w: number,
  h: number,
  borderHeight: number,
  color: string,
  context: object,
  cHeight: number
) {
  for (
    let index = borderHeight;
    index < cHeight - borderHeight;
    index += borderHeight
  ) {
    drawRect(x, y + index, w, h, color, context);
  }
}

function drawTextTwo(
  text: number,
  x: number,
  y: number,
  color: string,
  context: any
) {
  context.fillStyle = color;
  context.font = "40px 'Press Start 2P', cursive";
  context.fillText(text, x, y);
}
