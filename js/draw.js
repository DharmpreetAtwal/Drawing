import { Rect, Circle, Line, Polygon, PolyLine, Path } from "./shape.js";

export class Draw {
      constructor() {
            if(Draw.instance) {
                  return Draw.instance;
            }

            this.savedSVG = "";
            this.currShape = new Line(0, 0, 0, 0);
            this.dragging = false;
            this.startX = 0;
            this.startY = 0;
            this.endX= 0;
            this.endY= 0;
            Draw.instance = this;

            return this;
      }

      setpos(x, y) {
            this.currShape.x = x;
            this.currShape.y = y;
      }

      static toSVGCoordinates(event, svg) {
            var clientX = event.clientX;
            var clientY = event.clientY;
      
            var canvasRect = svg.getBoundingClientRect();
            var canvasX = clientX - canvasRect.left;
            var canvasY = clientY - canvasRect.top;
      
            return [canvasX, canvasY];
      };
}

const draw = new Draw();
const svg = document.getElementById('svg');

document.onmousedown = function(event) {
      var coord = Draw.toSVGCoordinates(event, svg);
      draw.dragging = true;
      draw.startX = Math.round(coord[0]);
      draw.startY = Math.round(coord[1]);

      if( (draw.currShape instanceof Polygon || draw.currShape instanceof Path)
            && draw.startX > 0 && draw.startY > 0) {
            draw.currShape.drawShape();
            svg.innerHTML = draw.savedSVG + draw.currShape.toSVGString();
      }
}

document.onmousemove = function(event) {
      if(draw.dragging && draw.startX > 0) {
            var coord = Draw.toSVGCoordinates(event, svg);
            draw.endX = Math.round(coord[0])
            draw.endY = Math.round(coord[1])
            if(!(draw.currShape instanceof Polygon)) {
                  draw.currShape.drawShape();
                  svg.innerHTML = draw.savedSVG + draw.currShape.toSVGString();
            }  
      }
}

document.onmouseup =  function(event) {
      Draw.instance.dragging = false;
     // draw.currShape.drawShape()
      if(!(draw.currShape instanceof Polygon || draw.currShape instanceof Path)) {
            draw.savedSVG = svg.innerHTML;
      } 
}

// UI

$("#rectButton").on("click", function(event) {
      draw.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Rect(0, 0, 0, 0);
});
  
$("#ellipseButton").on("click",  function(event) {
      draw.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Circle(0, 0, 0)
});
  
$("#lineButton").on("click", function(event) {
      draw.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Line(0, 0, 0, 0);
});

$("#polygonButton").on("click", function(event) {
      draw.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Polygon();
});

$("#polylineButton").on("click", function(event) {
      draw.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new PolyLine();
});

$("#pathButton").on("click", function(event) {
      draw.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Path();
});

$("#clearButton").on("click", function(event) {
      svg.innerHTML = "";
      draw.savedSVG = "";
});