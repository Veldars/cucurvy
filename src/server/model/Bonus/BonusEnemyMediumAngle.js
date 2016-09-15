/**
 * Inverse Enemy Straight Angle
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusEnemyMediumAngle(x, y)
{
    BonusEnemy.call(this, x, y);
}

BonusEnemyMediumAngle.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyMediumAngle.prototype.constructor = BonusEnemyMediumAngle;

/**
 * Duration
 *
 * @type {Number}
 */
BonusEnemyMediumAngle.prototype.duration = 5000;

/**
 * Probability
 *
 * @type {Number}
 */
BonusEnemyMediumAngle.prototype.probability = 0.6;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyMediumAngle.prototype.getEffects = function(avatar)
{
    return [
        ['directionInLoop', false],
        ['angularVelocityBase', Math.PI/4]
    ];
};
