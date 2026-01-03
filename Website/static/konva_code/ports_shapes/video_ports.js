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
	  width: 125,	  height: 52,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: [6,6,24,24]
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
	  width: 137,	  height: 53,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: [12,12,12,28]
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
	// I SWEAR TO GOD THIS BODY IS PERFECT, STOP MESSING WITH IT
	const body = new Konva.Rect({
	  x: x+40,     // attached to right side
	  y: y,	  
	  width: 230,	  height: 90,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	cornerRadius: 15
	});
	shape.add(body);
	
	// bulge
	const Right_bulge = new Konva.Rect({
	  x: x+(230+40),     // attached to right side
	  y: y+16,
	  width: 40,
	  height: 56,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: [0,6,6,0]
	});
	const Left_bulge = new Konva.Rect({
	  x: x,     
	  y: y+16,
	  width: 40,
	  height: 56,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: [6,0,0,6]
	}); 
	shape.add(Right_bulge);
	shape.add(Left_bulge);
	
	const Right_AlignLine = new Konva.Rect({
	  x: x+230+40-14, //integer division
	  y: y,	  
	  width: 1,	  height: 25,
	  stroke: STROKE_COLOR,	  strokeWidth: 1,	
	});
	const Left_AlignLine = new Konva.Rect({
	  x: x+40+14, //integer division
	  y: y,	  
	  width: 1,	  height: 25,
	  stroke: STROKE_COLOR,	  strokeWidth: 1,	
	});
	shape.add(Right_AlignLine);
	shape.add(Left_AlignLine);

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
	  x: x+55,     // attached to right side
	  y: y,	  
	  width: 140,	  height: 72,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	cornerRadius: 10
	});
	shape.add(body);
	
	const Left_bulge = new Konva.Rect({
	  x: x,     // attached to right side
	  y: y+8,
	  width: 56,
	  height: 56,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: [6,0,0,6]
	});
	const Right_bulge = new Konva.Rect({
	  x: x+195,     // attached to right side
	  y: y+8,
	  width: 56,
	  height: 56,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: [0,6,6,0]
	});
	shape.add(Left_bulge);
	shape.add(Right_bulge);

	const Left_AlignLine = new Konva.Rect({
	  x: x+55+7, //integer division
	  y: y,	  
	  width: 1,	  height: 25,
	  stroke: STROKE_COLOR,	  strokeWidth: 1,	
	});
	const Right_AlignLine = new Konva.Rect({
	  x: x+195-7, //integer division
	  y: y,	  
	  width: 1,	  height: 25,
	  stroke: STROKE_COLOR,	  strokeWidth: 1,	
	});
	shape.add(Left_AlignLine);
	shape.add(Right_AlignLine);
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