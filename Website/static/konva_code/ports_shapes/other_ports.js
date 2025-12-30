import {FILL_COLOR, STROKE_COLOR, STROKE_WIDTH} from '../konva_config.js';
export function Port_PS2({
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
	  width: 95,	  height: 95,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 12
	});
	shape.add(body);
	
  return [shape];
}

export function Port_USB({
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
	  width: 120,	  height: 57,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 3
	});
	shape.add(body);
	
  return [shape];
}
export function Port_USB_2x({
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
	  width: 120,	  height: 57,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 3
	});
	const body2 = new Konva.Rect({
	  x: x,
	  y: y+57+10,	  
	  width: 120,	  height: 57,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 3
	});
	shape.add(body);
	shape.add(body2);
	
  return [shape];
}
export function Port_USB_TypeC({
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
	  width: 90,	  height: 40,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 10
	});
	shape.add(body);
	
  return [shape];
}