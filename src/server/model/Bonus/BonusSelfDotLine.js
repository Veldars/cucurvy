/**
 * Master Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfDotLine(x, y)
{
    BonusEnemy.call(this, x, y);
}

BonusSelfDotLine.prototype = Object.create(BonusEnemy.prototype);
BonusSelfDotLine.prototype.constructor = BonusSelfDotLine;

/**
 * Duration
 *
 * @type {Number}
 */
BonusSelfDotLine.prototype.duration = 7500;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfDotLine.prototype.getEffects = function(avatar)
{
    return [
        ['dotSize', -59]
    ];
};
