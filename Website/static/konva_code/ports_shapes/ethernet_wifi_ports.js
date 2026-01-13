import {FILL_COLOR, STROKE_COLOR, STROKE_WIDTH} from '../konva_config.js';
export function Port_Ethernet ({
  x = 150,
  y = 100,
  bulge_width = 30,
  bulge_height = 90,
  body_width = 300,
  body_height = 240,
  AlignLine_x_offset_ratio = 0.09,
  AlignLine_y_offset_ratio = 0.92,
  bulge_y_offset = 0,
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	//var bulge_y_offset = Math.floor((body_height - bulge_height)/2);
	var AlignLine_x_offset = Math.floor(AlignLine_x_offset_ratio * body_width);
	
	// main rectangle
	// I SWEAR TO GOD THIS BODY IS PERFECT, STOP MESSING WITH IT
	const Left_bulge = new Konva.Rect({
	  x: x,     
	  y: y+bulge_y_offset,
	  width: bulge_width,
	  height: bulge_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH
	}); 
	const body = new Konva.Rect({
	  x: x+bulge_width,     // attached to right side
	  y: y,	  
	  width: body_width,	  height: body_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH
	});
	
	// bulge
	const Right_bulge = new Konva.Rect({
	  x: x+(body_width+bulge_width),     // attached to right side
	  y: y+bulge_y_offset,
	  width: bulge_width,
	  height: bulge_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH
	});
	
	const Right_AlignLine = new Konva.Rect({
	  x: x+body_width+bulge_width-AlignLine_x_offset, //integer division
	  y: y,	  
	  width: 3,	  height: 110,
	  stroke: STROKE_COLOR,	  strokeWidth: 2,	
	});
	const Left_AlignLine = new Konva.Rect({
	  x: x+bulge_width+AlignLine_x_offset, //integer division
	  y: y,	  
	  width: 3,	  height: 110,
	  stroke: STROKE_COLOR,	  strokeWidth: 2,	
	});
	const Bot_AlignLine = new Konva.Rect({
	  x: x+bulge_width, //integer division
	  y: y+Math.floor(AlignLine_y_offset_ratio*body_height),	  
	  width: 110,	  height: 2,
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	});
	
	shape.add(body);
	shape.add(Right_bulge);
	shape.add(Left_bulge);
	shape.add(Right_AlignLine);
	shape.add(Left_AlignLine);
	shape.add(Bot_AlignLine);

  return [shape];
}

export function Port_Wifi({
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
	  radius: 110,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	});
	shape.add(body);
	
  return [shape];
}