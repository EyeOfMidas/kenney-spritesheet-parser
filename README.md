# Kenney Spritesheet Parser

This is a very simple javascript/ajax class for reading in .xml TextureAtlas files and being able to use the name to render using HTML5 canvas.

## Simple Example
```
var spritesheet = new Spritesheet("sheet.xml");
spritesheet.load(function(){
	var canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	context.translate(0.5, 0.5); //gets rid of blurry aliasing effect when scaling

	spritesheet.drawCentered(context, "playerShip1_blue.png", {x:50, y:50});
});
```

## Example with Transforms
```
var spritesheet = new Spritesheet("sheet.xml");
spritesheet.load(function(){
	var canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	context.translate(0.5, 0.5); //gets rid of blurry aliasing effect when scaling
	
	var position = {x: 50, y: 50};
	var angle = 45;

	context.save();
	context.translate(position.x, position.y);
	context.scale(1, 1);	
	context.beginPath();
	context.rotate((angle + 90) * Math.PI / 180);
	spritesheet.drawCentered(context, "playerShip1_blue.png", {x:0, y:0});
	context.restore();
});
```
