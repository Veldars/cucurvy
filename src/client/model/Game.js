/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.animations = [];

    this.onResize = this.onResize.bind(this);
    this.onDie    = this.onDie.bind(this);
    this.degrees  = 0;
    this.prevDegrees  = 0;
    
    this.onLoad = this.onLoad.bind(this);
    
    this.loaded = false;
    
    this.backgroundSprite = new SpriteAsset('images/cat.jpg', 1, 1, this.onLoad, true);

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.onResize);

    //this.on("drawPoint", this.drawPoints);

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].on('die', this.onDie);
    }
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Margin between player an bonus stack
 *
 * @type {Number}
 */
Game.prototype.stackMargin = 15;


/**
 * Assets
 *
 * @type {Object}
 */
Game.prototype.assets = {};

/**
 * Background color
 *
 * @type {String}
 */
Game.prototype.backgroundColor = '#222222';

/**
 * Load DOM
 */
Game.prototype.loadDOM = function()
{
    this.render     = document.getElementById('render');
    this.gameInfos  = document.getElementById('game-infos');
    this.canvas     = new Canvas(0, 0, document.getElementById('game'));
    this.background = new Canvas(0, 0, document.getElementById('background'));
    this.effect     = new Canvas(0, 0, document.getElementById('effect'));

    this.bonusManager.loadDOM();
    this.onResize();
};

/**
 * On bonus sprite loaded
 */
Game.prototype.onLoad = function()
{
    var images = this.backgroundSprite.getImages();

    for (var i = 0; i >= 0; i--) {
        this.assets[i] = images[i];
    }

    this.loaded = true;
    this.clearBackground();
    //this.emit('load');
};

/**
 * Get new frame
 */
Game.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * Clear frame
 */
Game.prototype.clearFrame = function()
{
    window.cancelAnimationFrame(this.frame);
    this.frame = null;
};

/**
 * On frame
 *
 * @param {Number} step
 */
Game.prototype.onFrame = function(step)
{
    this.draw(step);
};

/**
 * On round new
 */
Game.prototype.onRoundNew = function()
{
    BaseGame.prototype.onRoundNew.call(this);
    
    this.degrees = 0;
    
    this.prevDegrees = 0;
    this.rotate(0);
    
    this.repaint();
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    this.effect.clear();
    BaseGame.prototype.onStart.call(this);
};

/**
 * Is tie break
 *
 * @return {Boolean}
 */
Game.prototype.isTieBreak = function()
{
    var maxScore = this.maxScore;

    return this.avatars.match(function () { return this.score >= maxScore; }) !== null;
};

/**
 * Are all avatars ready?
 *
 * @return {Boolean}
 */
Game.prototype.isReady = function()
{
    return this.started ? true : BaseGame.prototype.isReady.call(this);
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.clearBackground();
};

/**
 * End
 */
Game.prototype.end = function()
{
    if (BaseGame.prototype.end.call(this)) {
        window.removeEventListener('error', this.stop);
        window.removeEventListener('resize', this.onResize);
    }
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);
    this.onResize();
};

/**
 * Repaint
 */
Game.prototype.repaint = function()
{
    this.animations.length = 0;
    this.clearBackground();
    this.effect.clear();
    this.canvas.clear();
    this.draw();
};


/**
 * Draw
 *
 * @param {Number} step
 */
Game.prototype.draw = function(step)
{
    for (var animation, a = this.animations.length - 1; a >= 0; a--) {
        animation = this.animations[a];
        animation.draw();
        if (animation.done && animation.cleared) {
            this.animations.splice(a, 1);
        }
    }

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present && (avatar.alive || avatar.changed)) {
            this.clearAvatar(avatar);
            this.clearBonusStack(avatar);
            if (avatar.worldRotor && avatar.local) {
               this.rotate(this.degrees);
                this.degrees += 0.2;
                if(this.degrees > this.prevDegrees + 89.9){
                    this.prevDegrees += 89.9;
                    avatar.worldRotor = false;
                }
            }
        }
    }

    for (avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present && (avatar.alive || avatar.changed)) {
            if (avatar.alive) {
                avatar.update(this.frame ? step : 0);
            }

            this.drawTail(avatar);
            this.drawAvatar(avatar);
            this.drawBonusStack(avatar);

            if (!this.frame && avatar.local) {
                this.drawArrow(avatar);
            }
        }
    }

    this.bonusManager.draw();
};

Game.prototype.rotate = function(angle) {
    if(navigator.userAgent.match('Chrome')){
        this.render.style.WebkitTransform = 'rotate('+angle+'deg)';
    } else if(navigator.userAgent.match('Firefox')){
        this.render.style.MozTransform = 'rotate('+angle+'deg)';
    } else if(navigator.userAgent.match('MSIE')){
        this.render.style.msTransform = 'rotate('+angle+'deg)';
    } else if(navigator.userAgent.match('Opera')){
        this.render.style.OTransform = 'rotate('+angle+'deg)';
    } else {
        this.render.style.transform = 'rotate('+angle+'deg)';
    }
};

/**
 * Draw tail
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawTail = function(avatar)
{
    var points = avatar.trail.getLastSegment();
    if (points) {
        this.background.drawLineScaled(points, avatar.width, avatar.color, 'round');
    }
};

/**
 * Draw tail
 *
 * @param {Points} points
 */
Game.prototype.drawPoints = function(points)
{
    if (points) {
        this.background.drawLineScaled(points, 1.2, this.getRandomColor(), 'round');
    }
};

/**
 * Get random Color
 *
 * @return {String}
 */
Game.prototype.getRandomColor = function()
{
    var color = '',
        randomNum = function () { return Math.ceil(Math.random() * 200 + 55).toString(16); };

    color = '#' + randomNum() + randomNum() + randomNum();

    return color;
};


/**
 * Draw avatar
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawAvatar = function(avatar)
{
    this.canvas.drawImageTo(avatar.canvas.element, avatar.startX, avatar.startY);
    avatar.clearX     = avatar.startX;
    avatar.clearY     = avatar.startY;
    avatar.clearWidth = avatar.canvas.element.width;
};

/**
 * Clear bonus from the canvas
 *
 * @param {Bonus} bonus
 */
Game.prototype.clearAvatar = function(avatar)
{
    this.canvas.clearZone(avatar.clearX, avatar.clearY, avatar.clearWidth, avatar.clearWidth);
};

/**
 * Clear bonus stack
 *
 * @param {Avatar} avatar
 */
Game.prototype.clearBonusStack = function(avatar)
{
    if (avatar.bonusStack.lastWidth) {
        this.canvas.clearZone(
            avatar.startX + this.stackMargin,
            avatar.startY + this.stackMargin,
            avatar.bonusStack.lastWidth,
            avatar.bonusStack.lastHeight
        );
    }
};


/*
 * Draw bonus stack
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawBonusStack = function(avatar)
{
    if (avatar.hasBonus()) {
        avatar.bonusStack.lastWidth  = avatar.bonusStack.canvas.element.width;
        avatar.bonusStack.lastHeight = avatar.bonusStack.canvas.element.height;

        this.canvas.drawImageTo(
            avatar.bonusStack.canvas.element,
            avatar.startX + this.stackMargin,
            avatar.startY + this.stackMargin
        );
    }
};

/*
 * Draw arrow
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawArrow = function(avatar)
{
    this.effect.drawImageScaledAngle(avatar.arrow.element, avatar.x - 5, avatar.y - 5, 10, 10, avatar.angle);
};

/**
 * Clear background with color
 */
Game.prototype.clearBackground = function()
{
    this.background.color(this.backgroundColor);
    if (this.loaded) {
        console.log("Draw Image");
        this.background.drawImage(this.assets[0], 0, 0, this.background.element.width, this.background.element.height);
    }
};

/**
 * On die
 *
 * @param {Event} event
 */
Game.prototype.onDie = function(event)
{
    this.animations.push(new Explode(event.detail, this.effect));
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=document.body,x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x - this.gameInfos.clientWidth - 8, y - 8),
        scale = width / this.size,
        avatar;

    this.render.style.width  = (width + 8) + 'px';
    this.render.style.height = (width + 8) + 'px';
    this.canvas.setDimension(width, width, scale);
    this.effect.setDimension(width, width, scale);
    this.background.setDimension(width, width, scale, true);
    this.bonusManager.setDimension(width, scale);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        avatar.setScale(scale);

        if (typeof(avatar.input) !== 'undefined') {
            avatar.input.setWidth(x);
        }
    }
};
