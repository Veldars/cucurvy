/**
 * Slow Enemy Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusEnemyWorldRotor(x, y)
{
    BonusEnemy.call(this, x, y);
}

BonusEnemyWorldRotor.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyWorldRotor.prototype.constructor = BonusEnemyWorldRotor;

/**
 * Duration
 *
 * @type {Number}
 */
BonusEnemyWorldRotor.prototype.duration = 10000;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyWorldRotor.prototype.getEffects = function(avatar)
{
    return [
	    ['worldRotor', true]
    ];
};
