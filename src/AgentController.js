function AgentController(boundaryX, boundaryY)
{
    this._agents = [];
    this._obstacles = [];

    this._boundaryX = boundaryX;
    this._boundaryY = boundaryY;

    this._aligmentWeight = 1.0;
    this._cohesionWeight = 1.0;
    this._separationWeight = 1.0;

    this._max_agent_speed = 5;

    this._aligmentRadius = 100;
    this._cohesionRadius = 100;
    this._separationRadius = 100;
    this._obstacleRadius = 100;

    this._targetX = 0;
    this._targetY = 0;
    this._enableTarget = false;
}

AgentController.prototype.setTargetPos = function(x, y)
{
    this._targetX = x;
    this._targetY = y;
}

AgentController.prototype.enableTarget = function(val)
{
    this._enableTarget = val;
}

AgentController.prototype.addAgent  = function(agent)
{
    this._agents.push(agent);
};

AgentController.prototype.getAgents  = function()
{
    return this._agents;
};

AgentController.prototype.addObstacle  = function(obstacle)
{
    this._obstacles.push(obstacle);
};

AgentController.prototype.getObstacles  = function()
{
    return this._obstacles;
};

AgentController.prototype.removeAll = function()
{
    this._agents = [];
}

AgentController.prototype.getBoundary  = function()
{
    return [this._boundaryX, this._boundaryY];
};

AgentController.prototype.setMaxSpeed  = function(s)
{
    this._max_agent_speed = s;
};

AgentController.prototype.setAligmentWeight  = function(w)
{
    this._aligmentWeight = w;
};

AgentController.prototype.setCohesionWeight  = function(w)
{
    this._cohesionWeight = w;
};

AgentController.prototype.setSeparationWeight  = function(w)
{
    this._separationWeight = w;
};

AgentController.prototype.setBoundary  = function(w, h)
{
    this._boundaryX = w;
    this._boundaryY = h;
};

AgentController.prototype.iterate = function()
{
    for(var i in this._agents) {
        var agent = this._agents[i];

        var aligmentVel = this.computeAlignment(agent);
        var cohVel = this.computeCohesion(agent);
        var sepVel = this.computeSeparation(agent);
        var obsVel = this.computeObstacles(agent);

        // add components
        agent.vx += this._aligmentWeight*aligmentVel[0] + this._cohesionWeight*cohVel[0] +
                    50*this._separationWeight*sepVel[0] + 50*obsVel[0];
        agent.vy += this._aligmentWeight*aligmentVel[1] + this._cohesionWeight*cohVel[1] +
                    50*this._separationWeight*sepVel[1] + 50*obsVel[1];

        this.computePosition(agent);
    }
};

AgentController.prototype.computePosition = function(agent)
{
    // normalize agent speed
    var magnitude = Math.sqrt((agent.vx*agent.vx)+(agent.vy*agent.vy));
    if(magnitude > this._max_agent_speed) {
        agent.vx = this._max_agent_speed*agent.vx/magnitude;
        agent.vy = this._max_agent_speed*agent.vy/magnitude;
    }

    agent.x += agent.vx;
    agent.y += agent.vy;

    if(agent.x < 0) {
        agent.x = this._boundaryX;
    }

    if(agent.y < 0) {
        agent.y = this._boundaryY;
    }

    if(agent.x > this._boundaryX) {
        agent.x = 0;
    }

    if(agent.y > this._boundaryY) {
        agent.y = 0;
    }
};

AgentController.prototype.computeAlignment = function(agent)
{
    var aligmentX = 0;
    var aligmentY = 0;
    var neighborCount = 0;

    for(var i in this._agents) {
        var currentAgent = this._agents[i];
        if(currentAgent != agent &&
            Math.abs(agent.x-currentAgent.x) < this._aligmentRadius &&
            Math.abs(agent.y-currentAgent.y) < this._aligmentRadius &&
            agent.distanceFrom(currentAgent) < this._aligmentRadius) {
            neighborCount++;
            aligmentX += currentAgent.vx;
            aligmentY += currentAgent.vy;
        }
    }

    if(neighborCount > 0)
    {
        aligmentX /= neighborCount;
        aligmentY /= neighborCount;
        var aligmentMag = Math.sqrt((aligmentX*aligmentX)+(aligmentY*aligmentY));
        aligmentX /= aligmentMag;
        aligmentY /= aligmentMag;
    }

    return [aligmentX, aligmentY];
};

AgentController.prototype.computeCohesion = function(agent)
{
    var cohX = 0;
    var cohY = 0;
    var neighborCount = 0;

    for(var i in this._agents) {
        var currentAgent = this._agents[i];
        if(currentAgent != agent &&
            Math.abs(agent.x-currentAgent.x) < this._cohesionRadius &&
            Math.abs(agent.y-currentAgent.y) < this._cohesionRadius &&
            agent.distanceFrom(currentAgent) < this._cohesionRadius) {
            neighborCount++;
            cohX += currentAgent.x;
            cohY += currentAgent.y;
        }
    }

    if(this._enableTarget == true)
    {
        neighborCount = 1;
        cohX = this._targetX;
        cohY = this._targetY;
    }

    if(neighborCount > 0)
    {
        cohX /= neighborCount;
        cohY /= neighborCount;

        cohX = cohX - agent.x;
        cohY = cohY - agent.y;

        var cohMag = Math.sqrt((cohX*cohX)+(cohY*cohY));
        cohX /= cohMag;
        cohY /= cohMag;
    }

    return [cohX, cohY];
};

AgentController.prototype.computeSeparation = function(agent)
{
    var sepX = 0;
    var sepY = 0;
    var neighborCount = 0;

    for(var i in this._agents) {
        var currentAgent = this._agents[i];

        if(Math.abs(agent.x-currentAgent.x) > this._separationRadius ||
           Math.abs(agent.y-currentAgent.y) > this._separationRadius)
        {
            continue;
        }

        var distance = agent.distanceFrom(currentAgent);
        if(currentAgent != agent && distance < this._separationRadius) {
            neighborCount++;
            var sx = agent.x - currentAgent.x;
            var sy = agent.y - currentAgent.y;
            sepX += (sx/distance)/distance;
            sepY += (sy/distance)/distance;
        }
    }

    return [sepX, sepY];
};

AgentController.prototype.computeObstacles = function(agent)
{
    var avoidX = 0;
    var avoidY = 0;

    for(var i in this._obstacles) {
        var currentObstacle = this._obstacles[i];

        if(Math.abs(agent.x-currentObstacle.x) > this._obstacleRadius ||
           Math.abs(agent.y-currentObstacle.y) > this._obstacleRadius)
        {
            continue;
        }

        var distance = agent.distanceFrom(currentObstacle);
        if(distance > 0 && distance < this._obstacleRadius) {
            var ox = agent.x - currentObstacle.x;
            var oy = agent.y - currentObstacle.y;
            avoidX += (ox/distance)/distance;
            avoidY += (oy/distance)/distance;
        }
    }

    return [avoidX, avoidY];
};
