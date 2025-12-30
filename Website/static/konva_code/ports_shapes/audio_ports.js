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
	  width: 83,	  height: 265,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 13
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
	  width: 90,	  height: 90,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 0
	});
	shape.add(body);
	
  return [shape];
}