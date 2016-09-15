/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color, team)
{
    BasePlayer.call(this, client, name, color, team);
}

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;

/**
 * Serialize
 *
 * @return {Object}
 */
Player.prototype.serialize = function()
{
    var data = BasePlayer.prototype.serialize.call(this);

    data.active = this.client.active;

    return data;
};
