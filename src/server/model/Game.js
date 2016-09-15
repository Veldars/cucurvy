/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world        = new World(this.size);
    this.deaths       = new Collection([], 'id');
    this.controller   = new GameController(this);
    this.bonusStack   = new GameBonusStack(this);
    this.roundWinner  = null;
    this.gameWinner   = null;
    this.deathInFrame = false;
    this.time         = 0;
    this.elapseTime   = 0;
    this.acceleration = 0;

    this.onPoint = this.onPoint.bind(this);

    var avatar, i;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.clear();
        avatar.on('point', this.onPoint);
    }
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    if (this.room.config.isClockGame) {
        var deltaTime = 0;
        if (this.time === 0) {
            this.time = Date.now();
        } else {
            var actTime = Date.now();
            deltaTime = actTime - this.time;
            this.time = actTime;
        }
        this.elapseTime += deltaTime;
    }
    if (this.elapseTime >= 1000) {
        this.acceleration += 0.5;
        this.elapseTime = 0;
    }
    
    var score = this.deaths.count(),
        avatar, border, i, borderX, borderY, borderAxis, position, killer;

    this.deathInFrame = false;

    step += this.acceleration;
    
    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        
        //this.avatars.items[i].velocity += acceleration;
        
        
        avatar = this.avatars.items[i];
        dead   = false;

        if (avatar.alive) {
            avatar.update(step);

            border = this.world.getBoundIntersect(avatar.body, (this.borderless || avatar.ghost) ? 0 : avatar.radius);

            if (border) {
                if (this.borderless || avatar.ghost) {
                    position = this.world.getOposite(border[0], border[1]);
                    avatar.setPosition(position[0], position[1]);
                } else {
                    this.kill(avatar, null, score);
                }
            } else {
                if (!avatar.invincible) {
                    killer = this.world.getBody(avatar.body);
		    
                    if (killer && !avatar.eraser) {
			this.kill(avatar, killer, score);
                    }
		    if (killer && avatar.eraser) {
			var pts = this.world.removeMultipleBody(killer);
			var bonus = avatar.bonusStack.getBonus('eraser');
			avatar.bonusStack.remove(bonus);
			avatar.onEraser(pts);
		    }
                }
            }

            if (avatar.alive) {
                avatar.printManager.test();
                this.bonusManager.testCatch(avatar);
            }
        }
    }

    if (this.deathInFrame) {
        this.checkRoundEnd();
    }
};

/**
 * Kill an avatar
 *
 * @param {Avatar} avatar
 * @param {Body|null} killer
 * @param {Number} score
 */
Game.prototype.kill = function(avatar, killer, score) {
    avatar.die(killer);
    
    if (!this.room.config.isTeamGame) {
        avatar.addScore(score);
    } else {
        var allTeamDie = true;
        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            if (this.avatars.items[i].id !== avatar.id) {
                if (this.avatars.items[i].alive && this.avatars.items[i].team === avatar.team) {
                    allTeamDie = false;
                }
            }
        }
        if (allTeamDie) {
            avatar.addScore(score);
            for (var j = this.avatars.items.length - 1; j >= 0; j--) {
                if (this.avatars.items[j].id !== avatar.id) {
                    if (this.avatars.items[j].team === avatar.team) {
                        this.avatars.items[j].addScore(score);
                    }
                }
            }
        }
    }
    this.deaths.add(avatar);
    this.deathInFrame = true;
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    BaseGame.prototype.removeAvatar.call(this, avatar);
    this.emit('player:leave', {player: avatar.player});
    this.checkRoundEnd();
};

/**
 * On avatar add point
 *
 * @param {Object} data
 */
Game.prototype.onPoint = function(data)
{
    if (this.started && this.world.active) {
        this.world.addBody(new AvatarBody(data.x, data.y, data.avatar));
    }
};

/**
 * Is done
 *
 * @return {Boolean}
 */
Game.prototype.isWon = function()
{
    var present = this.getPresentAvatars().count();

    if (present <= 0) { return true; }
    if (this.avatars.count() > 1 && present <= 1) { return true; }

    var maxScore = this.maxScore,
        players = this.avatars.filter(function () { return this.present && this.score >= maxScore; });
    if (players.count() === 0) {
        return null;
    }
    
    for (var i = 0; i < players.items.length; i++) {
        if (players.items[i].score > maxScore) {
            maxScore = players.items[i].score;
        }
    }
    players = players.filter(function () { return this.score >= maxScore; });

    if (players.count() === 1 || (this.room.config.isTeamGame && this.allSameTeam(players))) {
        return players.getFirst();
    }

    this.sortAvatars(players);

    return players.items[0].score === players.items[1].score ? null : players.getFirst();
};

Game.prototype.allSameTeam = function(players) {
    var team = players.items[0].team;
    for (var i = 1; i < players.items.length; i++) {
        if (players.items[i].team !== team) {
            return false;
        }
    }
    return true;
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (!this.inRound) {
        return;
    }

    var alive = false;
    var teamAvatar = null;

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        if (this.avatars.items[i].alive) {
            if (!alive) {
                teamAvatar = this.avatars.items[i];
                alive = true;
            } else if (!this.room.config.isTeamGame || (teamAvatar !== null && this.avatars.items[i].team !== teamAvatar.team)){
                return;
            }
        }
    }

    this.endRound();
};

/**
 * Resolve scores
 */
Game.prototype.resolveScores = function()
{
    var winner;

    if (this.avatars.count() === 1) {
        winner = this.avatars.getFirst();
    } else {
        winner = this.avatars.match(function () { return this.alive; });
    }

    if (winner) {
        winner.addScore(Math.max(this.avatars.count() - 1, 1));
        this.roundWinner = winner;
        if (this.room.config.isTeamGame) {
            for (var i = this.avatars.items.length - 1; i >= 0; i--) {
                if (this.avatars.items[i].id !== winner.id && this.avatars.items[i].team === winner.team) {
                    this.avatars.items[i].addScore(Math.max(this.avatars.count() - 1, 1));
                    this.roundWinner += ' - ' + winner;
                }
            }
        }
    }

    for (var j = this.avatars.items.length - 1; j >= 0; j--) {
        this.avatars.items[j].resolveScore();
    }
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.world.clear();
    this.world.activate();
    this.emit('clear', {game: this});
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);

    this.world.clear();
    this.world = new World(this.size);

    this.bonusManager.setSize();
};

/**
 * Check end of round
 */
Game.prototype.onRoundEnd = function()
{
    this.resolveScores();
    this.emit('round:end', {winner: this.roundWinner});
};

/**
 * New round
 */
Game.prototype.onRoundNew = function()
{
    this.time         = 0;
    this.elapseTime   = 0;
    this.acceleration = 0;
    this.emit('round:new', {game: this});
    BaseGame.prototype.onRoundNew.call(this);

    var avatar, position, i;

    this.roundWinner = null;
    this.world.clear();
    this.deaths.clear();
    this.bonusStack.clear();

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present) {
            position = this.world.getRandomPosition(avatar.radius, this.spawnMargin);
            avatar.setPosition(position[0], position[1]);
            avatar.setAngle(this.world.getRandomDirection(avatar.x, avatar.y, this.spawnAngleMargin));
        } else {
            this.deaths.add(avatar);
        }
    }
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    this.emit('game:start', {game: this});

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        setTimeout(avatar.printManager.start, 3000);
    }

    this.world.activate();

    BaseGame.prototype.onStart.call(this);
};

/**
 * On stop
 */
Game.prototype.onStop = function()
{
    this.emit('game:stop', {game: this});

    BaseGame.prototype.onStop.call(this);

    var won = this.isWon();

    if (won) {
        if (won instanceof Avatar) {
            this.gameWinner = won;
        }
        this.end();
    } else {
        this.newRound();
    }
};

/**
 * Set borderless
 *
 * @param {Boolean} borderless
 */
Game.prototype.setBorderless = function(borderless)
{
    if (this.borderless !== borderless) {
        BaseGame.prototype.setBorderless.call(this, borderless);
        this.emit('borderless', this.borderless);
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    if (BaseGame.prototype.end.call(this)) {
        this.avatars.clear();
        this.world.clear();

        delete this.world;
        delete this.avatars;
        delete this.deaths;
        delete this.bonusManager;
        delete this.controller;
    }
};
