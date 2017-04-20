/**
 * Master Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfCurvy(x, y)
{
    BonusSelf.call(this, x, y);
}

BonusSelfCurvy.prototype = Object.create(BonusSelf.prototype);
BonusSelfCurvy.prototype.constructor = BonusSelfCurvy;

/**
 * Duration
 *
 * @type {Number}
 */
BonusSelfCurvy.prototype.duration = 5000;


BonusSelfCurvy.prototype.probability = 5;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfCurvy.prototype.getEffects = function(avatar)
{
    return [
	    ['invincible', true],
        ['velocity', 0.75 * BaseAvatar.prototype.velocity]
    ];
};
