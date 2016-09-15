/**
/**
 * Big All Color
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusGameMaster(x, y)
{
    BonusAll.call(this, x, y);
}

BonusGameMaster.prototype = Object.create(BonusAll.prototype);
BonusGameMaster.prototype.constructor = BonusGameMaster;

/**
 * Duration
 *
 * @type {Number}
 */
BonusGameMaster.prototype.duration = 3000;


/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusGameMaster.prototype.getEffects = function(avatar)
{
	   return [
	    ['invincible', true],
	    ['printing', -1]
    ];
};
