/**
 * Slow Enemy Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusEnemyPause(x, y)
{
    BonusEnemy.call(this, x, y);
}

BonusEnemyPause.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyPause.prototype.constructor = BonusEnemyPause;

BonusEnemyPause.prototype.duration = 1000;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyPause.prototype.getEffects = function(avatar)
{
    return [['velocity', -15.9]];
};
