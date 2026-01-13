import {FILL_COLOR, STROKE_COLOR, STROKE_WIDTH} from '../konva_config.js';
export function Port_Audio_Column({
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
	  width: 225,	  height: 680,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 39
	});
	const center = new Konva.Rect({
	  x: x+(225/2 | 0), //integer division
	  y: y,	  
	  width: 3,	  height: 680,
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	});
	shape.add(body);
	shape.add(center);
	
  return [shape];
}
export function Port_Audio_Single({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Circle({
	  x: x,
	  y: y,	  
	  radius: 95,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	});
	shape.add(body);
	
  return [shape];
}
export function Port_Audio_Optic({
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
	  width: 240,	  height: 220,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 0
	});
	shape.add(body);
	
  return [shape];
}