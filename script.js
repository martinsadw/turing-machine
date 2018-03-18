// console.log(document.getElementById("Q").value);

// TODO(andre:2018-03-18): Utilizar git
// TODO(andre:2018-03-18): Indexar trasições pelo caracter de leitura
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
        [
            {
                "to": 1,
                "read": "a",
                "write": "a",
                "move": "D"
            }
        ]
    },
    {
        "final": false,
        "x": 150,
        "y": 10,
        "transitions":
        [
            {
                "to": 0,
                "read": "b",
                "write": "b",
                "move": "D"
            }
        ]
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
        var transitions = state.transitions;

        var newState = document.createElement("div");
        newState.classList.add("state");
        newState.id = "state-" + i;
        newState.style.left = state.x + "px";
        newState.style.top = state.y + "px";
        newState.textContent = i;
        statesRegion.appendChild(newState);

        for (var j = 0; j < transitions.length; ++j)
        {
            var endState = machine[transitions[j].to];

            // var connectionLine = createSVGElement("line");
            // connectionLine.setAttribute("x1", state.x + 20);
            // connectionLine.setAttribute("y1", state.y + 20);
            // connectionLine.setAttribute("x2", endState.x + 20);
            // connectionLine.setAttribute("y2", endState.y + 20);
            // svgConnections.appendChild(connectionLine);
            //
            // var lineMiddleX = (state.x + endState.x) / 2;
            // var lineMiddleY = (state.y + endState.y) / 2;
            // var connectionText = createSVGElement("text");
            // connectionText.setAttribute("x", lineMiddleX + 20);
            // connectionText.setAttribute("y", lineMiddleY + 20 - 0);
            // connectionText.setAttribute("text-anchor", "middle");
            // connectionText.setAttribute("alignment-baseline", "middle");
            // connectionText.setAttribute("font-size", "12px");
            // connectionText.textContent = "(" + transitions[j].read + ", " + transitions[j].write + ", " + transitions[j].move + ")";
            // svgConnections.appendChild(connectionText);

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
            // connectionTextPath.setAttribute("x", lineMiddleX + 20);
            // connectionTextPath.setAttribute("y", lineMiddleY + 20 - 0);
            connectionTextPath.setAttribute("startOffset", "50%");
            connectionTextPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#connection-" + connectionCount);
            connectionTextPath.textContent = "(" + transitions[j].read + ", " + transitions[j].write + ", " + transitions[j].move + ")";
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
        var transitions = state.transitions;

        // console.log(word[tapePosition]);

        var foundTransition = false;

        for (var i = 0; i < transitions.length; ++i)
        {
            // console.log("- " + transitions[i].read);
            if (transitions[i].read == word[tapePosition])
            {
                word[tapePosition] = transitions[i].write;
                currentState = transitions[i].to;
                switch (transitions[i].move)
                {
                    case "D":
                        tapePosition++;
                        break;
                    case "E":
                        tapePosition--;
                        break;
                }

                foundTransition = true;
                break;
            }
        }

        if (!foundTransition)
        {
            return state.final;
        }
    }
}

setMachine(machine);

console.log(processWord(machine, "aaaaab"));
console.log(processWord(machine, "abababababab"));
console.log(processWord(machine, "abbbbababababa"));
console.log(processWord(machine, "b"));
