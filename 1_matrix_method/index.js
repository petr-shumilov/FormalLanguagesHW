const fs = require('fs');
const dot = require('graphlib-dot');

try {
    let graph = dot.read(fs.readFileSync('../graphs/travel.dot', 'utf-8'));

    let grammarDesc = fs.readFileSync('../grammars/q1_grammar.txt', 'utf-8');

    let grammar = {};
    grammarDesc.split('\n').forEach((line) => {

        let parsedLine = /([^\s]+) -> ((([^\s]+) ([^\s]+))|([^\s]+))/.exec(line);
        if (parsedLine[1] === undefined) {
            throw new Error("Parse error");
        }

        if (parsedLine[4] !== undefined && parsedLine[5] !== undefined) {
            grammar[parsedLine[4]] = grammar[parsedLine[4]] || {};
            (grammar[parsedLine[4]][parsedLine[5]] = grammar[parsedLine[4]][parsedLine[5]] || []).push(parsedLine[1]);
        }
        else if (parsedLine[6] !== undefined) {
            (grammar[parsedLine[6]] = grammar[parsedLine[6]] || []).push(parsedLine[1]);
        }
    });

    //console.log(grammar);
    let matrix = {};
    graph.edges().forEach((e) => {
        let label = graph.edge(e.v, e.w).label;
        if (grammar[label] !== undefined) {
            grammar[label].forEach((nonTerm) => {
               matrix[e.v] = matrix[e.v] || {};
               (matrix[e.v][e.w] =  matrix[e.v][e.w] || []).push(nonTerm);
            });
        }
    });

    //console.log(matrix);
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

                            matrix[i][j] = matrix[i][j] || [];
                            if (!matrix[i][j].includes(grammar[nonTerm1][nonTerm2].toString())) {
                                hasChanges = true;
                                matrix[i][j] = matrix[i][j].concat(grammar[nonTerm1][nonTerm2]);
                                //console.log(`(${i}  ${k})-> (${k} ${j}) | ${nonTerm1} ${nonTerm2} ${grammar[nonTerm1][nonTerm2]} | ${matrix[i][j]}`);
                            }
                        });
                    });
                });
            });
        });
        console.log('closure');
    }

    let cnt = 0;
    Object.keys(matrix).forEach((i) => {
        Object.keys(matrix[i]).forEach((j) => {
            if (matrix[i][j].includes('S')) {
                cnt++;
            }
        });
    });
    console.log(cnt);
}
catch (e) {
    console.log(`Error: ${e.message}`);
}