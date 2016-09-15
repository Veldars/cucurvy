/**
 * Master Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfEraser(x, y)
{
    BonusSelf.call(this, x, y);
}

BonusSelfEraser.prototype = Object.create(BonusSelf.prototype);
BonusSelfEraser.prototype.constructor = BonusSelfEraser;

/**
 * Duration
 *
 * @type {Number}
 */
BonusSelfEraser.prototype.duration = 20000;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfEraser.prototype.getEffects = function(avatar)
{
    return [
	    ['eraser', true]
    ];
};
