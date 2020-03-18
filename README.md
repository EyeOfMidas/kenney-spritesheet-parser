# Kenney Spritesheet Parser

This is a very simple javascript/ajax class for reading in .xml TextureAtlas files and being able to use the name to render using HTML5 canvas.

On your webserver in the root directory, put your `index.html`. Make a directory called `assets` and put your `sprites.xml` and your `sprites.png`.
In the `index.html` make sure to include a `<canvas>` tag element and the `SpriteAtlas.js` script.

I included assets from [Kenney.nl - Space Shooter Redux](https://kenney.nl/assets/space-shooter-redux) to provide an example. If you use these assets, please consider [donating](https://kenney.itch.io/kenney-donation) to help support his amazing efforts.

## Spritesheet Viewer
You can use the `SpriteAtlas.js` class and the `spritesheet.html` page to get the names of the sprites in a generated sheet.

Put your desired spritesheet and xml file somewhere within a directory accessible to the `spritesheet.html` page. Visit the `spritesheet.html` and in the url, pass in the following parameters:

* path: this is the containing folder for your spritesheet.
* file: this is name of the xml data file for the spritesheet.

Your url should look like this:
`spritesheet.html?path=assets&file=sprites.xml`

It is assumed the parameters are urlencoded (so things like spaces should be `%20` instead).

[You can try out the example here!](https://eyeofmidas.github.io/kenney-spritesheet-parser/spritesheet.html)

## Simple Example
```
let spriteAtlas = new SpriteAtlas("assets", "sprites.xml");
spriteAtlas.load(function(){
	var canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	context.translate(0.5, 0.5); //gets rid of blurry aliasing effect when scaling

	let shipSprite = spriteAtlas.getSprite("playerShip1_blue.png");
    context.drawImage(
        spriteAtlas.getSheet(),
        shipSprite.x,
        shipSprite.y,
        shipSprite.width,
        shipSprite.height,
        50,
        50,
        shipSprite.width,
        shipSprite.height);
});
```

This will draw the sprite out of the sheet full size, at the location 50,50 on the context. There are some convenience functions to make this easier.
```
let spriteAtlas = new SpriteAtlas("assets", "sprites.xml");
spriteAtlas.load(function(){
	var canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	context.translate(0.5, 0.5); //gets rid of blurry aliasing effect when scaling

	spriteAtlas.draw(context, "playerShip1_blue.png", {x: 50, y: 50});
});
```

This does the same thing as the above code, but requires the context and a location object.

## Example with Transforms
```
let spriteAtlas = new Spritesheet("assets", "sprites.xml");
spriteAtlas.load(function(){
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
	spriteAtlas.drawCentered(context, "playerShip1_blue.png", {x:0, y:0});
	context.restore();
});
```
