const fs = require('fs');
const dot = require('graphlib-dot');
const Graph = require('graphlib').Graph;

try {

    if (process.argv.length < 4) {
        throw new Error("invalid number of arguments. Usage: node index.js grammarPath graphPath [resultPath|DEBUG]");
    }

    const grammarPath = process.argv[2].toString();
    const graphPath = process.argv[3].toString();

    let grammarDesc = fs.readFileSync(grammarPath, 'utf-8');

    let grammar = {};
    grammarDesc.split('\n').forEach((line) => {

        if (line === "") {
            return;
        }

        let parsedLine = /([^\s]+) -> ((([^\s]+) ([^\s]+))|([^\s]+))/.exec(line);
        if (parsedLine === null) {
            throw new Error("Parse error");
        }

        if (parsedLine[4] !== undefined && parsedLine[5] !== undefined) {
            grammar[parsedLine[4]] = grammar[parsedLine[4]] || {};
            (grammar[parsedLine[4]][parsedLine[5]] = grammar[parsedLine[4]][parsedLine[5]] || []).push(parsedLine[1].toString());
        }
        else if (parsedLine[6] !== undefined) {
            (grammar[parsedLine[6]] = grammar[parsedLine[6]] || []).push(parsedLine[1].toString());
        }
    });

    //console.log(grammar);
    let matrix = {};
    let _graph = dot.read(fs.readFileSync(graphPath, 'utf-8'));

    let graph = new Graph({
        multigraph: true
    });
    _graph.edges().forEach((e) => {
        graph.setEdge(e.v, e.w, _graph.edge(e).label, _graph.edge(e).label);
    });

    graph.edges().forEach((e) => {
        let label = e.name;
        if (grammar[label] !== undefined) {
            grammar[label].forEach((nonTerm) => {
               matrix[e.v] = matrix[e.v] || {};
               (matrix[e.v][e.w] =  matrix[e.v][e.w] || new Set()).add(nonTerm);
            });
        }
    });

    let hasChanges = true;
    while (hasChanges) {
        hasChanges = false;
        graph.nodes().forEach((i) => {
            graph.nodes().forEach((j) => {
                graph.nodes().forEach((k) => {
                    if (matrix[i] === undefined || matrix[i][k] === undefined) return;

                    matrix[i][k].forEach((nonTerm1) => {
                        if (matrix[k] === undefined || matrix[k][j] === undefined) return;

                        matrix[k][j].forEach((nonTerm2) => {
                            if (grammar[nonTerm1] === undefined || grammar[nonTerm1][nonTerm2] === undefined) {
                                return;
                            }

                            matrix[i][j] = matrix[i][j] || new Set();
                            grammar[nonTerm1][nonTerm2].forEach((symb) => {
                                if (!matrix[i][j].has(symb)) {
                                    hasChanges = true;
                                    matrix[i][j].add(symb);
                                }
                            });

                        });
                    });
                });
            });
        });
        //console.log('closure');
    }

    let writeStream;
    let toFile = (process.argv[4] !== undefined && process.argv[4] !== 'DEBUG');
    let isDebug = (process.argv[4] === 'DEBUG');
    if (toFile) {
        writeStream = fs.createWriteStream(process.argv[4]);
    }
    let cnt = 0;
    Object.keys(matrix).forEach((i) => {
        Object.keys(matrix[i]).forEach((j) => {
            matrix[i][j].forEach((nonTerm) => {
                if (toFile) {
                    writeStream.write(`${i},${nonTerm},${j}\n`);
                }
                else if (!isDebug) {
                    console.log(`${i},${nonTerm},${j}`);
                }
                if (nonTerm === 'S') {
                    cnt++;
                }
            });
            //if (matrix[i][j].includes('S')) {

        });
    });
    if (toFile) {
        writeStream.end();
    }
    else if (isDebug) {
        console.log(cnt);
    }
    //console.log(cnt);
}
catch (e) {
    console.log(`Error: ${e.message}`);
}