class SpriteAtlas {
	constructor(assetsPath, xmlFilename) {
		this.assetsPath = assetsPath;
		this.xmlFilename = xmlFilename;
		this.xmlPath = `${assetsPath}/${xmlFilename}`;
		this.atlas = {};
		this.xmlData = {};
		this.spritesheetImage = new Image();
		this.cacheBusting = true;
	}

	load() {
		return new Promise((resolve, reject) => {
			var request = new XMLHttpRequest();
			request.addEventListener("load", (event) => this.xmlLoadComplete(event, resolve, reject));

			let url = this.xmlPath;
			if (this.cacheBusting) {
				url += "?v=" + new Date().getTime();
			}
			request.open("GET", url);
			request.setRequestHeader("Content-Type", "text/xml");
			request.send();
		});

	}

	xmlLoadComplete(event, resolve, reject) {
		var source = (new DOMParser()).parseFromString(event.target.responseText, "application/xml");
		this.xmlData = source;
		var textureAtlas = source.getElementsByTagName("TextureAtlas")[0];
		this.populateAtlas(source);
		var sheetsrc = `${this.assetsPath}/${textureAtlas.getAttribute("imagePath")}`;
		if (this.cacheBusting) {
			sheetsrc += "?v=" + new Date().getTime();
		}
		this.spritesheetImage.src = sheetsrc;
		this.spritesheetImage.addEventListener('load', resolve);
	};

	populateAtlas(source) {
		var subtextures = source.getElementsByTagName("SubTexture");
		for (var i = 0, subtexture = subtextures[0]; subtexture = subtextures[i]; i++) {
			this.atlas[subtexture.getAttribute("name")] = {
				name: subtexture.getAttribute("name"),
				x: parseInt(subtexture.getAttribute("x")),
				y: parseInt(subtexture.getAttribute("y")),
				width: parseInt(subtexture.getAttribute("width")),
				height: parseInt(subtexture.getAttribute("height"))
			};
		}
	};

	getSheet() {
		return this.spritesheetImage;
	}

	getSprite(name) {
		let imageLookup = this.atlas[name];
		if (!!imageLookup) {
			return imageLookup;
		}
		throw new Error(`Sprite ${name} not found in atlas ${this.xmlPath}`);
	}

	draw(context, name, position) {
		let imageLookup = this.getSprite(name);

		context.drawImage(this.spritesheetImage,
			imageLookup.x,
			imageLookup.y,
			imageLookup.width,
			imageLookup.height,
			position.x,
			position.y,
			imageLookup.width,
			imageLookup.height);
	};

	drawCentered(context, name, position) {
		let imageLookup = this.getSprite(name);

		context.drawImage(this.spritesheetImage,
			imageLookup.x,
			imageLookup.y,
			imageLookup.width,
			imageLookup.height,
			position.x - imageLookup.width / 2,
			position.y - imageLookup.height / 2,
			imageLookup.width,
			imageLookup.height);
	};


	drawBottomCentered(context, name, position) {
		let imageLookup = this.getSprite(name);

		context.drawImage(this.spritesheetImage,
			imageLookup.x,
			imageLookup.y,
			imageLookup.width,
			imageLookup.height,
			position.x - imageLookup.width / 2,
			position.y + imageLookup.height / 2,
			imageLookup.width,
			imageLookup.height);
	};

	getWidth(name) {
		return this.getSprite(name).width;
	};

	getHeight(name) {
		return this.getSprite(name).height;
	};
}

class Spritesheet {
	constructor(assetPath, filename, width, height, margin) {
		this.assetPath = assetPath;
		this.filename = filename;
		this.spritesheetImage = new Image();
		this.width = width;
		this.height = height;
		this.margin = margin;
		this.cacheBusting = true;
	}

	load() {
		return new Promise((resolve, reject) => {
			let url = this.assetPath + "/" + this.filename;
			this.spritesheetImage.src = url;
			this.spritesheetImage.addEventListener('load', (event) => this.loadComplete(event, resolve, reject));
			if (this.cacheBusting) {
				url += "?v=" + new Date().getTime();
			}
		});
	}

	loadComplete(event, resolve, reject) {
		resolve();
	}

	draw(context, spriteId, position) {
		let x = spriteId % (this.spritesheetImage.width / (this.width + this.margin));
		let y = Math.floor(spriteId / (this.spritesheetImage.width / (this.width + this.margin)));

		context.drawImage(this.spritesheetImage,
			(x * this.width) + (x * this.margin),
			(y * this.height) + (y * this.margin),
			this.width,
			this.height,
			position.x,
			position.y,
			this.width,
			this.height);
	};
}

class ColorSpriteCache {
	constructor(spritesheet) {
		this.spritesheet = spritesheet;
		this.sprites = {};
	}

	add(key, width, height, spriteId, foregroundColor = "white", backgroundColor = "transparent") {

		let background = document.createElement("canvas");
		background.width = width;
		background.height = height;
		let backgroundContext = background.getContext("2d");

		let canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		let context = canvas.getContext("2d");

		this.spritesheet.draw(backgroundContext, spriteId, { x: 0, y: 0 });

		context.fillStyle = foregroundColor;
		context.beginPath();
		context.rect(0, 0, width, height);
		context.fill();
		context.globalCompositeOperation = "destination-atop";

		context.drawImage(background, 0, 0);

		context.globalCompositeOperation = "destination-over";
		context.fillStyle = backgroundColor;
		context.beginPath();
		context.rect(0, 0, width, height);
		context.fill();

		context.globalCompositeOperation = "source-over";

		this.sprites[key] = { image: canvas, width: width, height: height };
	}

	get(key) {
		return this.sprites[key];
	}

	drawOnGrid(context, key, coordinates, tileSize) {
		context.drawImage(this.get(key).image, coordinates.x * tileSize.width, coordinates.y * tileSize.height);
	}
}
