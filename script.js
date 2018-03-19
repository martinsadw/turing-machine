// console.log(document.getElementById("Q").value);

// TODO(andre:2018-03-18): Deslocar descrição da transição para cada ocorrencia
// de um mesmo par de estados
// TODO(andre:2018-03-18): Inverter ordem de desenho da linha de transição para
// evitar que os textos fiquem de cabeça para baixo
// TODO(andre:2018-03-18): Permitir desenho de self loops
// TODO(andre:2018-03-18): Permitir a alteração da maquina de turing sem
// precisar editar o codigo
// TODO(andre:2018-03-18): Permitir a alterção da palavra a ser processada
// TODO(andre:2018-03-18): Exibir o resultado do processamento
// TODO(andre:2018-03-18): Permitir a execução passo a passo
var machine = [
    {
        "final": true,
        "x": 60,
        "y": 10,
        "transitions":
        {
            "a":
            {
                "to": 1,
                "read": "a",
                "write": "a",
                "move": "D"
            }
        }
    },
    {
        "final": false,
        "x": 150,
        "y": 10,
        "transitions":
        {
            "b":
            {
                "to": 0,
                "read": "b",
                "write": "b",
                "move": "D"
            }
        }
    }
];

function createSVGElement(name)
{
    return document.createElementNS("http://www.w3.org/2000/svg", name)
}

function setMachine(machine)
{
    var statesRegion = document.getElementById("states-region");
    while (statesRegion.firstChild)
    {
        statesRegion.removeChild(statesRegion.firstChild);
    }

    var svgConnections = createSVGElement("svg");
    svgConnections.classList.add("state-connections");
    statesRegion.appendChild(svgConnections);

    var connectionCount = 0;

    for (var i = 0; i < machine.length; ++i)
    {
        var state = machine[i];
        var transitionsDict = state.transitions;

        var newState = document.createElement("div");
        newState.classList.add("state");
        newState.id = "state-" + i;
        newState.style.left = state.x + "px";
        newState.style.top = state.y + "px";
        newState.textContent = i;
        statesRegion.appendChild(newState);

        for (var transitionKey in transitionsDict)
        {
            var transition = transitionsDict[transitionKey];
            var endState = machine[transition.to];

            var connectionLine = createSVGElement("path");
            connectionLine.setAttribute("id", "connection-" + connectionCount);
            connectionLine.setAttribute("d", "M" + (state.x + 20) + "," + (state.y + 20) + "L" + (endState.x + 20) + "," + (endState.y + 20));
            connectionLine.setAttribute("stroke", "red");
            svgConnections.appendChild(connectionLine);

            var connectionText = createSVGElement("text");
            connectionText.setAttribute("text-anchor", "middle");
            connectionText.setAttribute("dy", -5);
            connectionText.setAttribute("fill", "red");
            connectionText.setAttribute("font-size", "12px");
            svgConnections.appendChild(connectionText);

            var connectionTextPath = createSVGElement("textPath");
            connectionTextPath.setAttribute("startOffset", "50%");
            connectionTextPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#connection-" + connectionCount);
            connectionTextPath.textContent = "(" + transition.read + ", " + transition.write + ", " + transition.move + ")";
            connectionText.appendChild(connectionTextPath);

            connectionCount++;
        }
    }
}

function processWord(machine, word)
{
    var tapePosition = 0;
    var currentState = 0;

    for (;;)
    {
        var state = machine[currentState];
        var transitionsDict = state.transitions;

        var transition = transitionsDict[word[tapePosition]];

        if (transition)
        {
            word[tapePosition] = transition.write;
            currentState = transition.to;
            switch (transition.move)
            {
                case "D":
                    tapePosition++;
                    break;
                case "E":
                    tapePosition--;
                    break;
            }
        }
        else
        {
            return state.final;
        }
    }
}

setMachine(machine);

function log(message)
{
    var logDiv = document.getElementById("log")
    var currentDate = new Date;
    // TODO(andre:2018-03-18): Adicionar 0 caso o numero seja menor que 10
    var dateString = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    logDiv.textContent += dateString + ": " + message + "\n";
}

log("aaaaab - " + processWord(machine, "aaaaab"));
log("abababababab - " + processWord(machine, "abababababab"));
log("abbbbababababa - " + processWord(machine, "abbbbababababa"));
log("b - " + processWord(machine, "b"));
