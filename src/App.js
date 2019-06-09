function App(canvasEl)
{
    this._canvasEl = canvasEl;
    this._context = this._canvasEl.getContext('2d');
    
    this._agentController = new AgentController(canvasEl.width, canvasEl.height);

    window.addEventListener('resize', this.resizeHandler.bind(this));
    this.resizeHandler();
}

App.prototype.resizeHandler = function()
{
    this._canvasEl.width = window.innerWidth;
    this._canvasEl.height = window.innerHeight;

    this._agentController.setBoundary(this._canvasEl.width, this._canvasEl.height);
};

App.prototype.init = function()
{
    this.addAgents(40);
    this.addObstacles(15);

    // register update function
    this.drawAnimationFrame();
};

App.prototype.drawAnimationFrame = function()
{
    // clear rect
    this._context.clearRect(0, 0, this._canvasEl.width, this._canvasEl.height);

    // draw agants
    var agents = this._agentController.getAgents();

    this._context.fillStyle="#000000";
    for(var i in agents) {
        var agent = agents[i];
        var x = agent.x;
        var y = agent.y;
        var wx = 10;
        var wy = 10;
        this._context.fillRect(x, y, wx, wy);
    }

    this._context.fillStyle="#FF0000";
    var obstacles = this._agentController.getObstacles();
    for(var i in obstacles) {
        var obs = obstacles[i];
        var x = obs.x;
        var y = obs.y;
        var wx = 10;
        var wy = 10;
        this._context.fillRect(x, y, wx, wy);
    }

    // iterate
    this._agentController.iterate();

    window.requestAnimationFrame(this.drawAnimationFrame.bind(this));
};

App.prototype.setTargetPos = function(x, y)
{
    this._agentController.setTargetPos(x, y);
}

App.prototype.enableTarget = function(val)
{
    this._agentController.enableTarget(val);
}

App.prototype.setAligmentWeight  = function(w)
{
    this._agentController.setAligmentWeight(w);
};

App.prototype.setCohesionWeight  = function(w)
{
    this._agentController.setCohesionWeight(w);
};

App.prototype.setSeparationWeight  = function(w)
{
    this._agentController.setSeparationWeight(w);
};

App.prototype.setMaxSpeed  = function(s)
{
    this._agentController.setMaxSpeed(s);
};

App.prototype.randomizeAgents = function()
{
    var boundary = this._agentController.getBoundary();
    var agents = this._agentController.getAgents();
    for(var i in agents) {
        var agent = agents[i];

        var rx = Math.floor(Math.random() * boundary[0]);
        var ry = Math.floor(Math.random() * boundary[1]);
        var vx = (Math.random() * 4) - 2;
        var vy = (Math.random() * 4) - 2;

        agent.x = rx;
        agent.y = ry;
        agent.vx = vx;
        agent.vy = vy;
    }

    var obstacles = this._agentController.getObstacles();
    for(var i in obstacles)
    {
        var obs = obstacles[i];
        var rx = Math.floor(Math.random() * boundary[0]);
        var ry = Math.floor(Math.random() * boundary[1]);
        
        obs.x = rx;
        obs.y = ry;
    }
};

App.prototype.addAgents = function(count)
{
    var boundary = this._agentController.getBoundary();
    for(var i=0; i<count; i++)
    {
        var rx = Math.floor(Math.random() * boundary[0]);
        var ry = Math.floor(Math.random() * boundary[1]);
        var vx = (Math.random() * 4) - 2;
        var vy = (Math.random() * 4) - 2;
        
        var agent = new Agent(rx, ry, vx, vy);
        this._agentController.addAgent(agent);
    }
};

App.prototype.clearAgents = function()
{
    this._agentController.removeAll();
}

App.prototype.getAgentCount = function()
{
    return this._agentController.getAgents().length;
}

App.prototype.addObstacles = function(count)
{
    var boundary = this._agentController.getBoundary();
    for(var i=0; i<count; i++)
    {
        var rx = Math.floor(Math.random() * boundary[0]);
        var ry = Math.floor(Math.random() * boundary[1]);
        
        var obstacle = new Obstacle(rx, ry);
        this._agentController.addObstacle(obstacle);
    }

}