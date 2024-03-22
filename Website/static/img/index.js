const attachCropBox = function (imgWidth,imgHeight, img_top, img_left) { 
    
    console.log('image loaded : ',imgWidth ,' ', imgHeight)
    var margin = {top: 5, right: 5, bottom: 5, left: 5},
    width = imgWidth - margin.left - margin.right,
    height = imgHeight - margin.top - margin.bottom;

    var sourcePoints = [[0, 0], [width, 0], [width, height], [0, height]],
    targetPoints = [[0, 0], [width, 0], [width, height], [0, height]];

    var svg = d3.select("#background").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + img_left + "," + img_top + ")")
    .append("g")
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id","window_g");

    var line = svg.selectAll(".line")
    .data(d3.range(1, width + 1, 50).map(function(x) { return [[x, 0], [x, height]]; })
        .concat(d3.range(1, height + 1, 50).map(function(y) { return [[0, y], [width, y]]; }))
		.concat(d3.range(height-1, height, 50).map(function(y) { return [[0, y], [width, y]]; }))
		.concat(d3.range(width-1, width, 50).map(function(x) { return [[x, 0], [x, height]]; }))
		)
    .enter().append("path")
    .attr("class", "line line--x");
	

    var handle = svg.selectAll(".handle")
    .data(targetPoints)
    .enter().append("circle")
    .attr("class", "handle")
    .attr("transform", function(d) { return "translate(" + d + ")"; })
    .attr("r", 7)
    .call(d3.behavior.drag()
        .origin(function(d) { return {x: d[0], y: d[1]}; })
        .on("drag", dragged));

    d3.selectAll("button")
    .datum(function(d) { return JSON.parse(this.getAttribute("data-targets")); })
    .on("click", clicked)
    .call(transformed);

    function clicked(d) {
    d3.transition()
        .duration(750)
        .tween("points", function() {
        if (!(d == null)){
            var i = d3.interpolate(targetPoints, d);
            return function(t) {
            handle.data(targetPoints = i(t)).attr("transform", function(d) { return "translate(" + d + ")"; });
            transformed();
            };
        }
        });
    }

    function dragged(d) {
        d3.select(this).attr("transform", "translate(" + (d[0] = d3.event.x) + "," + (d[1] = d3.event.y) + ")");
        transformed();
    }

    function transformed() {
		for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
			var s = sourcePoints[i], t = targetPoints[i];
			a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
			a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
		}

		var X = solve(a, b, true), matrix = [
		X[0], X[3], 0, X[6],
		X[1], X[4], 0, X[7],
			0,    0, 1,    0,
		X[2], X[5], 0,    1
		].map(function(x) {
			return d3.round(x, 6);
		});

		line.attr("d", function(d) {
			return "M" + project(matrix, d[0]) + "L" + project(matrix, d[1]);
		});
    }
    function project(matrix, point) {
        point = multiply(matrix, [point[0], point[1], 0, 1]);
        return [point[0] / point[3], point[1] / point[3]];
    }

    function multiply(matrix, vector) {
    return [
        matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8 ] * vector[2] + matrix[12] * vector[3],
        matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9 ] * vector[2] + matrix[13] * vector[3],
        matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3],
        matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3]
    ];
    }
}
const getOffsetRect = (el) =>
{
  let rect = el.getBoundingClientRect();

  // add window scroll position to get the offset position
  let left   = rect.left   + window.scrollX;
  let top    = rect.top    + window.scrollY;
  let right  = rect.right  + window.scrollX;
  let bottom = rect.bottom + window.scrollY;

  // polyfill missing 'x' and 'y' rect properties not returned
  // from getBoundingClientRect() by older browsers
  let x = rect.x === undefined ? left : rect.x + window.scrollX;
  let y = rect.y === undefined ? top : rect.y + window.scrollY;

  // width and height are the same
  let width  = rect.width;
  let height = rect.height;

  return { left, top, right, bottom, x, y, width, height };
};
window.onload = function() {
    
    var img = new Image();
    // img.crossOrigin = "anonymous";
    img.src = "./B450M Pro4-F(L5).png";
	var viewportOffset = getOffsetRect(document.getElementById("sample"));
	// these are relative to the viewport
	var img_top = viewportOffset.top;
	var img_left = viewportOffset.left;
    img.onload = function () {
		console.log ("onload");
        const imgWidth = viewportOffset.width;
        const imgHeight = viewportOffset.height;
        attachCropBox(imgWidth,imgHeight, img_top, img_left);
    }	
}


