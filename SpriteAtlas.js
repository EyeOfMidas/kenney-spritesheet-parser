class SpriteAtlas {
    constructor(assetsPath, xmlFilename) {
        this.assetsPath = assetsPath;
        this.xmlFilename = xmlFilename;
        this.xmlPath = `./${assetsPath}/${xmlFilename}`;
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
        var sheetsrc = `./${this.assetsPath}/${textureAtlas.getAttribute("imagePath")}`;
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
