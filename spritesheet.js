function Spritesheet(xmlFilename) {
	var self = this;
	var atlas = {};
	var spritesheetImage = new Image();

	this.load = function(callback) {
		var request = new XMLHttpRequest();
		request.addEventListener("load", function(event) { self.xmlLoadComplete(event, callback); });
		request.open("GET", xmlFilename);
		request.setRequestHeader("Content-Type", "text/xml");
		request.send();
	};

	this.xmlLoadComplete = function(event, callback) {
		var source = ( new DOMParser() ).parseFromString(event.target.responseText, "application/xml" );
		var textureAtlas = source.getElementsByTagName("TextureAtlas")[0];
		this.populateAtlas(source);
		var sheetsrc = textureAtlas.getAttribute("imagePath");
		spritesheetImage.src = sheetsrc;
		spritesheetImage.addEventListener('load', function(event) { self.imageLoadComplete(event, callback); });
	};

	this.populateAtlas = function(source) {
		var subtextures = source.getElementsByTagName("SubTexture");
		for(var i = 0, subtexture = subtextures[0]; subtexture = subtextures[i]; i++) {
			atlas[subtexture.getAttribute("name")] = {
				x: subtexture.getAttribute("x"),
				y: subtexture.getAttribute("y"),
				width: subtexture.getAttribute("width"),
				height: subtexture.getAttribute("height")
			};
		}
	};

	this.imageLoadComplete = function(event, callback) {
		callback();
	};

	this.drawCentered = function(context, name, position) {
		var imageLookup = atlas[name];

		context.drawImage(spritesheetImage,
		imageLookup.x,
		imageLookup.y,
		imageLookup.width,
		imageLookup.height,
		position.x - imageLookup.width / 2,
		position.y - imageLookup.height / 2,
		imageLookup.width,
		imageLookup.height);
	};
}
