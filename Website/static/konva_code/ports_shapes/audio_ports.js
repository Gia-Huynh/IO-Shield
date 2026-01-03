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
	  width: 76,	  height: 260,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 13
	});
	const center = new Konva.Rect({
	  x: x+(76/2 | 0), //integer division
	  y: y,	  
	  width: 1,	  height: 260,
	  stroke: STROKE_COLOR,	  strokeWidth: 1,	
	});
	shape.add(body);
	shape.add(center);
	
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
	  width: 90,	  height: 90,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 0
	});
	shape.add(body);
	
  return [shape];
}