var app;

function main()
{
    // Main entry for the application
    var canvasEl = document.getElementById("mainCanvas");

    app = new App(canvasEl);
    app.init();

    // register controls
    var aligmentRange = document.getElementById("aligmentRange");
    aligmentRange.addEventListener("input", aligmentRangeChanged);
    aligmentRange.addEventListener("change", aligmentRangeChanged);

    var cohesionRange = document.getElementById("cohesionRange");
    cohesionRange.addEventListener("input", cohesionRangeChanged);
    cohesionRange.addEventListener("change", cohesionRangeChanged);

    var separationRange = document.getElementById("separationRange");
    separationRange.addEventListener("input", separationRangeChanged);
    separationRange.addEventListener("change", separationRangeChanged);

    var maxSpeedRange = document.getElementById("maxSpeedRange");
    maxSpeedRange.addEventListener("input", maxSpeedRangeChanged);
    maxSpeedRange.addEventListener("change", maxSpeedRangeChanged);

    var randomizeButton = document.getElementById("randomizeButton");
    randomizeButton.addEventListener("click", randomizeClicked);

    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetClicked);
    
    var addButton = document.getElementById("addButton");
    addButton.addEventListener("click", addButtonClicked);
    
    var clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", clearButtonClicked);

    var mouseCheckBox = document.getElementById("mouseCheckBox");
    mouseCheckBox.addEventListener("change", mouseCheckBoxChanged);

    canvasEl.addEventListener("mousemove", onMouseMove);

    updateAgentCount();
}

function mouseCheckBoxChanged()
{
    var mouseCheckBox = document.getElementById("mouseCheckBox");
    app.enableTarget(mouseCheckBox.checked);
}

function onMouseMove(e)
{
    app.setTargetPos(e.clientX, e.clientY);
}

function aligmentRangeChanged()
{
    var aligmentValue = document.getElementById("aligmentValue");
    var value = document.getElementById("aligmentRange").value;
    aligmentValue.innerText = value/100;
    app.setAligmentWeight(value/100);
}

function cohesionRangeChanged()
{
    var cohesionValue = document.getElementById("cohesionValue");
    var value = document.getElementById("cohesionRange").value;
    cohesionValue.innerText = value/100;
    app.setCohesionWeight(value/100);
}

function separationRangeChanged()
{
    var separationValue = document.getElementById("separationValue");
    var value = document.getElementById("separationRange").value;
    separationValue.innerText = value/100;
    app.setSeparationWeight(value/100);
}

function maxSpeedRangeChanged()
{
    var maxSpeedValue = document.getElementById("maxSpeedValue");
    var value = document.getElementById("maxSpeedRange").value;
    maxSpeedValue.innerText = value/100;
    app.setMaxSpeed(value/100);
}

function randomizeClicked()
{
    app.randomizeAgents();
}

function resetClicked()
{
    document.getElementById("aligmentRange").value = 100;
    document.getElementById("cohesionRange").value = 100;
    document.getElementById("separationRange").value = 100;
    document.getElementById("maxSpeedRange").value = 500;

    aligmentRangeChanged();
    cohesionRangeChanged();
    separationRangeChanged();
    maxSpeedRangeChanged();
}

function addButtonClicked()
{
    app.addAgents(20);
    updateAgentCount();
}

function clearButtonClicked()
{
    app.clearAgents();
    updateAgentCount();
}

function updateAgentCount()
{
    var count = app.getAgentCount();
    document.getElementById("agentCountArea").innerText = "Agent Count: " + count;
}