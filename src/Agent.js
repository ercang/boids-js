function Agent(x, y, vx, vy)
{
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

Agent.prototype.setPos  = function(px, py)
{
    this.x = px;
    this.y = py;
};

Agent.prototype.distanceFrom  = function(otherAgent)
{
    var dx = this.x - otherAgent.x;
    var dy = this.y - otherAgent.y;
    return Math.sqrt((dx*dx)+(dy*dy));
};