/**
 * Room Configuration
 *
 * @param {Room} room
 */
function RoomConfig(room)
{
    BaseRoomConfig.call(this, room);
}

RoomConfig.prototype = Object.create(BaseRoomConfig.prototype);
RoomConfig.prototype.constructor = RoomConfig;

/**
 * Bonus types
 *
 * @type {Array}
 */
RoomConfig.prototype.bonusTypes = {
    BonusSelfSmall: BonusSelfSmall,
    BonusSelfSlow: BonusSelfSlow,
    BonusSelfFast: BonusSelfFast,
    BonusSelfMaster: BonusSelfMaster,
    BonusSelfCurvy: BonusSelfCurvy,
    BonusSelfGhost: BonusSelfGhost,
    BonusSelfEraser: BonusSelfEraser,
    BonusEnemySlow: BonusEnemySlow,
    BonusEnemyFast: BonusEnemyFast,
    BonusEnemyBig: BonusEnemyBig,
    BonusEnemyInverse: BonusEnemyInverse,
    BonusGameBorderless: BonusGameBorderless,
    BonusAllColor: BonusAllColor,
    BonusGameClear: BonusGameClear,
    BonusEnemyStraightAngle: BonusEnemyStraightAngle,
    BonusEnemyMediumAngle: BonusEnemyMediumAngle,
    BonusEnemyPause: BonusEnemyPause,
    BonusSelfDotLine: BonusSelfDotLine,
    BonusGameMaster: BonusGameMaster,
    BonusEnemyWorldRotor: BonusEnemyWorldRotor
};

/**
 * Set open
 *
 * @param {Boolean} open
 */
RoomConfig.prototype.setOpen = function(open)
{
    if (this.open !== open) {
        this.open     = open;
        this.password = this.open ? null : this.generatePassword();

        this.emit('room:config:open', {room: this.room, open: this.open});

        return true;
    }

    return false;
};

/**
 * Set isClockGame
 *
 * @param {Boolean} isClockGame
 */
RoomConfig.prototype.setIsClockGame = function(isClockGame)
{
    if (this.isClockGame !== isClockGame) {
        this.isClockGame     = isClockGame;

        this.emit('room:config:isClockGame', {room: this.room, isClockGame: this.isClockGame});

        return true;
    }

    return false;
};

/**
 * Set isTeamGame
 *
 * @param {Boolean} isTeamGame
 */
RoomConfig.prototype.setIsTeamGame = function(isTeamGame)
{
    if (this.isTeamGame !== isTeamGame) {
        this.isTeamGame     = isTeamGame;

        this.emit('room:config:isTeamGame', {room: this.room, isTeamGame: this.isTeamGame});

        return true;
    }

    return false;
};

/**
 * Set isMapGame
 *
 * @param {Boolean} isMapGame
 */
RoomConfig.prototype.setIsMapGame = function(isMapGame)
{
    if (this.isMapGame !== isMapGame) {
        this.isMapGame     = isMapGame;

        this.emit('room:config:isMapGame', {room: this.room, isMapGame: this.isMapGame});

        return true;
    }

    return false;
};
/**
 * Get available bonuses
 *
 * @return {Array}
 */
RoomConfig.prototype.getBonuses = function()
{
    var bonuses = [];

    for (var bonus in this.bonuses) {
        if (this.bonuses[bonus]) {
            bonuses.push(this.bonusTypes[bonus]);
        }
    }

    return bonuses;
};
