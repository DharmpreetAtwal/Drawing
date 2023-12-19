import { Draw } from "./draw.js";

export class Shape {
      constructor(x, y) {
            this.x =x;
            this.y=y;
            this.fill = "#000000";
      }      
  
      drawShape() {
            this.x = Draw.instance.startX;
            this.y = Draw.instance.startY;
            this.fill = $("#fillPicker").val();
            this.stroke = $("#strokePicker").val();
            this.strokeWidth = $("#strokeNumber").val();
      }

      toSVGString() {
            throw new Error('NOT IMEPLEMENTED toSVGSTRING');
      }
}
  
export class Rect extends Shape {
      constructor(x, y, h, w) {
            super(x, y);
            this.height = h;
            this.width = w;
      }
  
      drawShape() {
            super.drawShape();
            this.width = Math.abs( Draw.instance.startX -  Draw.instance.endX);
            this.height = Math.abs( Draw.instance.startY -  Draw.instance.endY);
      }

      toSVGString() {
            var diffX =  Draw.instance.endX -  Draw.instance.startX;
            var diffY =  Draw.instance.endY -  Draw.instance.startY;
            var angle = -1 * Math.atan(diffY/diffX);

            if(diffX < 0) {
                  angle =  angle + Math.PI
            }

            if(Math.tan(angle) > 0) {
                  var w = this.width;
                  var h = this.height; 
            } else {
                  var w = this.height;
                  var h = this.width;
            }
            let a=0;

            if(Math.sin(angle) > 0 && Math.cos(angle) > 0) {
                  a = -90;
            } else if(Math.sin(angle) > 0 && Math.cos(angle) < 0) {
                  a = -180;
            } else if(Math.sin(angle) < 0 && Math.cos(angle) < 0) {
                  a = -270;
            } else if(Math.sin(angle) < 0 && Math.cos(angle) < 0) {
                  a = 0;
            }

            return "<rect height='"+ w +
                        "' width ='"+ h + 
                        "' x='" + this.x + 
                        "' y='" + this.y  + "'" +
                        " transform='rotate("+ a + "," + 
                               Draw.instance.startX + "," +
                               Draw.instance.startY +")'" + 
                        " style='fill:"+ this.fill + 
                              "; stroke:" + this.stroke +
                              "; stroke-width:"+ this.strokeWidth + "' />";
      }
}

export class Circle extends Shape {
      constructor(x, y, r) {
            super(x, y);
            this.radius = r;
      }

      drawShape() {
            super.drawShape()
            this.radius = Math.max(Math.abs( Draw.instance.startX -  Draw.instance.endX), 
                                    Math.abs( Draw.instance.startY -  Draw.instance.endY));
      }

      toSVGString() {
            return "  <circle cx='" + this.x +
                        "' cy='" + this.y +
                        "' r='" + this.radius  +
                        "' style='fill:"+ this.fill +
                              "; stroke:" + this.stroke +
                              "; stroke-width:"+ this.strokeWidth + "' />";
                  }

}

export class Line extends Shape {
      constructor(x1, y1, x2, y2) {
            super(x1, y1);
            this.x2 = x2;
            this.y2 = y2;
      }

      drawShape() {
            super.drawShape();
            this.x1 =  Draw.instance.startX;
            this.y1 =  Draw.instance.startY;
            this.x2 =  Draw.instance.endX;
            this.y2 =  Draw.instance.endY;
      }

      toSVGString() {
            return "  <line x1='" + this.x1 +
                  "' y1='" + this.y1 +
                  "' x2='" + this.x2 +
                  "' y2='" + this.y2 + 
                  "' style='stroke:" + 
                        this.stroke  +
                        "; stroke-width:"+ this.strokeWidth + "' />";
            }
}

export class Polygon extends Shape {
      constructor() {
            super(0, 0);
            this.points = [];
      }

      drawShape() {
            super.drawShape()
            this.points.push([Draw.instance.startX, Draw.instance.startY]);
      }

      toSVGString() {
            let strPoints = "";
            this.points.forEach(point => {
                  strPoints = strPoints + point[0] + "," + point[1] + " ";
            });

            return "  <polygon points='" + strPoints + 
                  "' style='fill:"+ this.fill + 
                        "; stroke:" + this.stroke + 
                        "; stroke-width:" + this.strokeWidth + "' />";
      }
}

// PolyLine class is almost extact copy of Polygon
// Only diff is <polygon> vs <polyline>
export class PolyLine extends Polygon {
      constructor() {
            super();
      }

      toSVGString() {
            let strPoints = "";
            this.points.forEach(point => {
                  strPoints = strPoints + point[0] + "," + point[1] + " ";
            });

            return "  <polyline points='" + strPoints + 
                  "' style='fill:none" + 
                        "; stroke:" + this.stroke + 
                        "; stroke-width:" + this.strokeWidth + "' />";
      }

}