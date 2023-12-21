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

function inBounds() {
      return (Draw.instance.startX > 0 && Draw.instance.startY > 0)
}

function displayDrawing() {
      Draw.instance.currShape.drawShape();
      svg.innerHTML = Draw.instance.savedSVG + Draw.instance.currShape.toSVGString();
}

$(document).on('mousedown', function(event) {
      var coord = Draw.toSVGCoordinates(event, svg);
      Draw.instance.dragging = true;
      Draw.instance.startX = Math.round(coord[0]);
      Draw.instance.startY = Math.round(coord[1]);
      Draw.instance.endX = Math.round(coord[0]);
      Draw.instance.endY = Math.round(coord[1]);

      if( (Draw.instance.currShape instanceof Polygon 
            || Draw.instance.currShape instanceof Path)
            && inBounds()) {
            displayDrawing()
      }
});

$(document).on('mousemove', function(event) {
      if(Draw.instance.dragging && inBounds()) {
            var coord = Draw.toSVGCoordinates(event, svg);
            Draw.instance.endX = Math.round(coord[0])
            Draw.instance.endY = Math.round(coord[1])
            if(!(Draw.instance.currShape instanceof Polygon)) {
                  displayDrawing()
            }  
      }
});

$(document).on('mouseup', function(event) {
      if(inBounds()) {
            Draw.instance.dragging = false;
            displayDrawing()
            if(!(Draw.instance.currShape instanceof Polygon || Draw.instance.currShape instanceof Path)) {
                  Draw.instance.savedSVG = svg.innerHTML;
            } 
      }
});

// UI

$("#rectButton").on("click", function(event) {
      Draw.instance.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Rect(0, 0, 0, 0);
});
  
$("#circleButton").on("click",  function(event) {
      Draw.instance.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Circle(0, 0, 0)
});
  
$("#lineButton").on("click", function(event) {
      Draw.instance.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Line();
});

$("#polygonButton").on("click", function(event) {
      Draw.instance.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Polygon();
});

$("#polylineButton").on("click", function(event) {
      Draw.instance.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new PolyLine();
});

$("#pathButton").on("click", function(event) {
      Draw.instance.savedSVG = svg.innerHTML;
      Draw.instance.currShape = new Path();
});

$("#clearButton").on("click", function(event) {
      svg.innerHTML = "";
      Draw.instance.savedSVG = "";
      Draw.instance.currShape = new Line()
});