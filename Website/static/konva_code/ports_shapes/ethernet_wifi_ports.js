import {FILL_COLOR, STROKE_COLOR, STROKE_WIDTH} from '../konva_config.js';
export function Port_Ethernet({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x+15,     // attached to right side
	  y: y,	  
	  width: 108,	  height: 100,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	cornerRadius: 0
	});
	// bulge
	const Right_bulge = new Konva.Rect({
	  x: x+123,     // attached to right side
	  y: y+0,
	  width: 15,
	  height: 36,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 1
	});
	const Left_bulge = new Konva.Rect({
	  x: x,     // attached to right side
	  y: y+0,
	  width: 15,
	  height: 36,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 1
	});
	shape.add(body);
	shape.add(Right_bulge);
	shape.add(Left_bulge);

  return [shape];
}