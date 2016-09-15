/**
 * Master Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfGhost(x, y)
{
    BonusSelf.call(this, x, y);
}

BonusSelfGhost.prototype = Object.create(BonusSelf.prototype);
BonusSelfGhost.prototype.constructor = BonusSelfGhost;

/**
 * Duration
 *
 * @type {Number}
 */
BonusSelfGhost.prototype.duration = 7500;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfGhost.prototype.getEffects = function(avatar)
{
    return [
	    ['ghost', true]
    ];
};
