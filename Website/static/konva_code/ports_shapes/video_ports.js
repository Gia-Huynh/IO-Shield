import {FILL_COLOR, STROKE_COLOR, STROKE_WIDTH} from '../konva_config.js';

export function Port_HDMI({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x,
	  y: y,	  
	  width: 130,	  height: 54,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: [6,6,30,30]
	});
	shape.add(body);
	
  return [shape];
}
export function Port_DP ({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x,
	  y: y,	  
	  width: 160,	  height: 67,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: [16,16,16,30]
	});
	shape.add(body);
	
  return [shape];
}

export function Port_DVI({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x+54,     // attached to right side
	  y: y,	  
	  width: 200,	  height: 95,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	cornerRadius: 15
	});
	// bulge
	const Right_bulge = new Konva.Rect({
	  x: x+244,     // attached to right side
	  y: y+17,
	  width: 65,
	  height: 60,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 20
	});
	const Left_bulge = new Konva.Rect({
	  x: x,     // attached to right side
	  y: y+17,
	  width: 65,
	  height: 60,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 20
	});
	shape.add(body);
	shape.add(Right_bulge);
	shape.add(Left_bulge);

  return [shape];
}
export function Port_DSub({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x+47,     // attached to right side
	  y: y,	  
	  width: 140,	  height: 90,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	cornerRadius: 10
	});
	const Right_bulge = new Konva.Rect({
	  x: x+187,     // attached to right side
	  y: y+15,
	  width: 48,
	  height: 60,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 6
	});
	const Left_bulge = new Konva.Rect({
	  x: x,     // attached to right side
	  y: y+15,
	  width: 48,
	  height: 60,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 6
	});
	shape.add(body);
	shape.add(Right_bulge);
	shape.add(Left_bulge);

  return [shape];
}

export function Port_COM({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,
	  y: y,
	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x+49,     // attached to right side
	  y: y,
	  width: 400,
	  height: 70,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 10
	});
	// bulge
	const bulge = new Konva.Rect({
	  x: x+449,     // attached to right side
	  y: y+20,
	  width: 50,
	  height: 30,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 6
	});
	const Left_bulge = new Konva.Rect({
	  x: x,     // attached to right side
	  y: y+20,
	  width: 50,
	  height: 30,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: 6
	});
	shape.add(body);
	shape.add(bulge);
	shape.add(Left_bulge);

  return [shape];
}