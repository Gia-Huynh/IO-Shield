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
	  width: 240,	  height: 240,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 48
	});
	shape.add(body);
	
  return [shape];
}
export function Port_CMOS({
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
	  radius: 70,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
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
	var body_width = 300;
	var body_height = 140;
	var center_width_ratio = 0.85;
	var center_height_ratio = 0.75;
	
	const body = new Konva.Rect({
	  x: x,
	  y: y,	  
	  width: body_width,	  height: body_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 9
	});
	const center = new Konva.Rect({
	  x: x+Math.floor((body_width - Math.floor(body_width * center_width_ratio))/2),
	  y: y+Math.floor((body_height - Math.floor(body_height * center_height_ratio))/2),	  
	  width: Math.floor(body_width * center_width_ratio),	  height: Math.floor(body_height * center_height_ratio),
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	  cornerRadius: 9
	});
	shape.add(body);
	shape.add(center);
	
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
	var body_width = 300;
	var body_height = 140;
	var center_width_ratio = 0.85;
	var center_height_ratio = 0.75;
	var usb_offset = 28;
	
	const body = new Konva.Rect({
	  x: x,
	  y: y,	  
	  width: body_width,	  height: body_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 9
	});
	const center = new Konva.Rect({
	  x: x+Math.floor((body_width - Math.floor(body_width * center_width_ratio))/2),
	  y: y+Math.floor((body_height - Math.floor(body_height * center_height_ratio))/2),	  
	  width: Math.floor(body_width * center_width_ratio),	  height: Math.floor(body_height * center_height_ratio),
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	  cornerRadius: 9
	});
	const body_2 = new Konva.Rect({
	  x: x,
	  y: y+body_height+usb_offset,	  
	  width: body_width,	  height: body_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 9
	});
	const center_2 = new Konva.Rect({
	  x: x+Math.floor((body_width - Math.floor(body_width * center_width_ratio))/2),
	  y: y+Math.floor((body_height - Math.floor(body_height * center_height_ratio))/2) + usb_offset + body_height,	  
	  width: Math.floor(body_width * center_width_ratio),	  height: Math.floor(body_height * center_height_ratio),
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	  cornerRadius: 9
	});
	shape.add(body);
	shape.add(body_2);
	shape.add(center);
	shape.add(center_2);
	
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
	  width: 230,	  height: 110,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: 40
	});
	shape.add(body);
	
  return [shape];
}