const fs    = require('fs');
const dot   = require('graphlib-dot');
const Graph = require("graphlib").Graph;


//try {
    if (process.argv.length < 4) {
        throw new Error("invalid number of arguments. Usage: node index.js rfaPath fsmPath [resultPath|DEBUG]");
    }

    const rfaPath = process.argv[2].toString();
    const fsmPath = process.argv[3].toString();

    let rfaParsed = dot.read(fs.readFileSync(rfaPath, 'utf-8'));
    let rfaStartStates = [];
    let rfaFinalStatesSet = new Set();
    let rfaTerminals = new Set();
    let rfaGraph = new Graph({
        multigraph: true
    });
    rfaParsed.nodes().filter((node) => {return (rfaParsed.node(node).color === 'green');}).forEach((node) => {
        let label = `${rfaParsed.node(node).label}`;
        (rfaStartStates[label] = rfaStartStates[label] || []).push(node);
    });

    rfaParsed.nodes().filter((node) => { return (rfaParsed.node(node).shape === 'doublecircle');}).forEach((node) => {
        rfaFinalStatesSet.add(node.toString());
    });

    rfaParsed.edges().forEach((e) => {
        let label = rfaParsed.edge(e).label;
        rfaGraph.setEdge(e.v, e.w, label, label);
        if (!/([A-Z]+)/.test(label)) {
            rfaTerminals.add(label);
        }
    });

    let rfa = {
        graph: rfaGraph,
        startStates: rfaStartStates,
        finalStatesSet: rfaFinalStatesSet,
        terminals: rfaTerminals
    };

    let fsmParsed = dot.read(fs.readFileSync(fsmPath, 'utf-8'));
    let fsm = new Graph({
        multigraph: true
    });
    fsmParsed.edges().forEach((e) => {
        fsm.setEdge(e.v, e.w, fsmParsed.edge(e).label, fsmParsed.edge(e).label);
    });


    let queue = new Set();
    let used = new Set();
    let marked = {};
    let gss = {};
    let result = new Set();

    fsm.nodes().forEach((node) => {
       Object.keys(rfa.startStates).forEach((nonTerm) => {
           Object.keys(rfa.startStates[nonTerm]).forEach((k) => {
               queue.add(JSON.stringify({
                   fsmPos: node,
                   rfaPos: rfa.startStates[nonTerm][k],
                   gss: `(${nonTerm},${node})`
               }));
           });
       })
    });

    while (queue.size) {
        let config = queue.values().next().value;
        queue.delete(config);

        if (used.has(config)) {
            continue;
        }
        used.add(config);
        config = JSON.parse(config);

        rfa.graph.outEdges(config.rfaPos).forEach((rfaTo) => {
            fsm.outEdges(config.fsmPos).forEach((fsmTo) => {

                // 1 case
                if (rfaTo.name === fsmTo.name && rfa.terminals.has(rfaTo.name)) {
                    queue.add(JSON.stringify({
                        fsmPos: fsmTo.w,
                        rfaPos: rfaTo.w,
                        gss: config.gss
                    }));
                }

                // 2 case
                if (!rfa.terminals.has(rfaTo.name)) {
                    let gssNew = `(${rfaTo.name},${config.fsmPos})`;
                    gss[gssNew] = gss[gssNew] || {};
                    gss[gssNew][config.gss] = gss[gssNew][config.gss] || new Set();
                    gss[gssNew][config.gss].add(rfaTo.w);
                    rfa.startStates[rfaTo.name].forEach((start) => {
                        queue.add(JSON.stringify({
                            fsmPos: config.fsmPos,
                            rfaPos: start,
                            gss: gssNew
                        }));
                    });

                    if (marked[gssNew.toString()] !== undefined) {
                        marked[gssNew].forEach((v) => {
                            let configTmp = JSON.stringify({
                                fsmPos: v,
                                rfaPos: rfaTo.w,
                                gss: config.gss
                            });
                            if (!used.has(configTmp)) {
                                queue.add(configTmp);
                            }
                        });
                    }
                }
            });
        });

        // 3 case
        if (rfa.finalStatesSet.has(config.rfaPos.toString())) {
            if (gss[config.gss.toString()] !== undefined) {
                Object.keys(gss[config.gss]).forEach((j) => {
                    gss[config.gss][j].forEach((x) => {
                        queue.add(JSON.stringify({
                            fsmPos: config.fsmPos,
                            rfaPos: x,
                            gss: j
                        }));
                    });
                });
            }
            result.add(JSON.stringify([
                (/\(([a-zA-Z0-9]+),([0-9]+)\)/.exec(config.gss))[2],
                (/\(([a-zA-Z0-9]+),([0-9]+)\)/.exec(config.gss))[1],
                config.fsmPos
            ]));
            (marked[config.gss] = marked[config.gss] || []).push(config.fsmPos);
        }
    }


    let writeStream;
    let toFile = (process.argv[4] !== undefined && process.argv[4] !== 'DEBUG');
    let isDebug = (process.argv[4] === 'DEBUG');
    if (toFile) {
         writeStream = fs.createWriteStream(process.argv[4]);
    }
    let cnt = 0;
    result.forEach((res) => {
        let triplet = JSON.parse(res);
        if (toFile) {
            writeStream.write(`${triplet[0]},${triplet[1]},${triplet[2]}\n`);
        }
        else if (!isDebug) {
            console.log(`${triplet[0]},${triplet[1]},${triplet[2]}`);
        }
        if (triplet[1] === 'S') cnt++;
    });
    if (toFile) {
        writeStream.end();
    }
    else if (isDebug) {
        console.log(cnt);
    }

//}
//catch (e) {
//    console.log(`Error: ${e.message}`);
//}