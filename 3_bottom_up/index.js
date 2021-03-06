const fs    = require('fs');
const dot   = require('graphlib-dot');
const Graph = require("graphlib").Graph;

try {

    if (process.argv.length < 4) {
        throw new Error("invalid number of arguments. Usage: node index.js rfaPath fsmPath [resultPath|DEBUG]");
    }

    const rfaPath = process.argv[2].toString();
    const fsmPath = process.argv[3].toString();

    let _rfa = dot.read(fs.readFileSync(rfaPath, 'utf-8'));

    let _rfaStartStates = {};
    _rfa.nodes().filter((node) => {
        return (_rfa.node(node).color === 'green');
    }).forEach((node) => {
        _rfaStartStates[node] = _rfa.node(node).label;
    });

    let _rfaFinalState = {};
    _rfa.nodes().filter((node) => {
        return (_rfa.node(node).shape === 'doublecircle');
    }).forEach((node) => {
        _rfaFinalState[node] = _rfa.node(node).label;
    });

    let rfaGraph = new Graph({
        multigraph: true
    });

    _rfa.edges().forEach((e) => {
        rfaGraph.setEdge(e.v, e.w, _rfa.edge(e).label, _rfa.edge(e).label);
    });

    let rfa = {
        graph: rfaGraph,
        startStates: _rfaStartStates,
        finalStates: _rfaFinalState
    };

    let _fsm = dot.read(fs.readFileSync(fsmPath, 'utf-8'));

    let fsm = new Graph({
        multigraph: true
    });
    _fsm.edges().forEach((e) => {
        fsm.setEdge(e.v, e.w, _fsm.edge(e).label, _fsm.edge(e).label);

    });


    let matrix = {};
    let yetAnotherIteration = true;
    while (yetAnotherIteration) {

        yetAnotherIteration = false;

        let intersectionChanges = false;
        let hasChange = true;
        while (hasChange) {
            hasChange = false;
            rfa.graph.edges().forEach((rfaEdge) => {
                fsm.edges().forEach((fsmEdge) => {
                    if (rfaEdge.name === fsmEdge.name) {
                        let i = JSON.stringify([fsmEdge.v, rfaEdge.v]);
                        let j = JSON.stringify([fsmEdge.w, rfaEdge.w]);

                        if (matrix[i] === undefined || matrix[i][j] === undefined) {
                            matrix[i] = (matrix[i] || {});
                            matrix[i][j] = true;
                            hasChange = true;
                        }
                        if (rfa.startStates[rfaEdge.v] !== undefined && rfa.finalStates[rfaEdge.w] !== undefined && !fsm.hasEdge(fsmEdge.v, fsmEdge.w, rfa.startStates[rfaEdge.v])) {
                            fsm.setEdge(fsmEdge.v, fsmEdge.w, rfa.startStates[rfaEdge.v], rfa.startStates[rfaEdge.v]);
                            hasChange = true;
                        }
                    }
                });
            });
            if (hasChange)
                intersectionChanges = true;
        }

        let closureChanges = false;
        hasChange = intersectionChanges;
        while (hasChange) {
            hasChange = false;
            for (let i in matrix) {
                for (let j in matrix[i]) {
                    for (let k in matrix) {
                        for (let l in matrix[k]) {
                            if (j === k && (matrix[i] === undefined || matrix[i][l] === undefined)) {
                                matrix[i] = matrix[i] || {};
                                matrix[i][l] = true;
                                hasChange = true;
                                let ind1 = JSON.parse(i);
                                let ind2 = JSON.parse(l);

                                let a = ind1[0], b = ind1[1];
                                let c = ind2[0], d = ind2[1];
                                if (rfa.startStates[b] !== undefined && rfa.finalStates[d] !== undefined && !fsm.hasEdge(a, c, rfa.startStates[b])) {
                                    fsm.setEdge(a, c, rfa.startStates[b], rfa.startStates[b]);
                                }
                            }
                        }
                    }
                }
            }
            if (hasChange)
                closureChanges = true;
        }
        //console.log('kek');
        yetAnotherIteration = intersectionChanges || closureChanges;
    }

    let writeStream;
    let toFile = (process.argv[4] !== undefined && process.argv[4] !== 'DEBUG');
    let isDebug = (process.argv[4] === 'DEBUG');
    if (toFile) {
        writeStream = fs.createWriteStream(process.argv[4]);
    }
    let triplets = new Set();
    Object.keys(matrix).forEach((i) => {
        Object.keys(matrix[i]).forEach((j) => {
            let ind1 = JSON.parse(i);
            let ind2 = JSON.parse(j);
            let a = ind1[0], b = ind1[1];
            let c = ind2[0], d = ind2[1];
            if (rfa.startStates[b] !== undefined && rfa.finalStates[d] !== undefined) {

                triplets.add(`${a},${rfa.startStates[b]},${c}`);
            }
        });
    });
    Object.keys(rfa.startStates).forEach((startState) => {
        Object.keys(rfa.finalStates).forEach((finalState) => {
            if (rfa.startStates[startState] === rfa.finalStates[finalState] && startState === finalState ) {
                fsm.nodes().forEach((node) => {
                    triplets.add(`${node},${rfa.finalStates[finalState]},${node}`);
                });
            }
        });
    });
    let cnt = 0;
    Array.from(triplets).map((triplet) => {
        if (toFile) {
            writeStream.write(`${triplet}\n`);
        }
        else if (!isDebug) {
            console.log(triplet);
        }
        if (triplet.includes(',S,')) {
            cnt++;
        }
    });
    if (toFile) {
        writeStream.end();
    }
    else if (isDebug) {
        console.log(cnt);
    }
}
catch (e) {
    console.log(`Error: ${e.message}`);
}