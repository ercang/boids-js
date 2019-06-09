function Obstacle(x, y)
{
    this.x = x;
    this.y = y;
}

Obstacle.prototype.distanceFrom  = function(otherAgent)
{
    var dx = this.x - otherAgent.x;
    var dy = this.y - otherAgent.y;
    return Math.sqrt((dx*dx)+(dy*dy));
};