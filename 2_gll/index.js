const fs    = require('fs');
const dot   = require('graphlib-dot');
const Graph = require("graphlib").Graph;

const rfaPath = '../rfa/rfa_1.dot';
    const fsmPath = '../graphs/travel.dot';

//try {

    let rfaParsed = dot.read(fs.readFileSync(rfaPath, 'utf-8'));

    let rfaStartStates = [];

    rfaParsed.nodes().filter((node) => {return (rfaParsed.node(node).color === 'green');}).forEach((node) => {
        (rfaStartStates[`${rfaParsed.node(node).label}`.toString()] = rfaStartStates[`${rfaParsed.node(node).label}`.toString()] || []).push(node);
    });

    let rfaFinalStateSet = new Set();
    rfaParsed.nodes().filter((node) => { return (rfaParsed.node(node).shape === 'doublecircle');}).forEach((node) => {
        rfaFinalStateSet.add(node.toString());
    });
    let rfaGraph = new Graph({
        multigraph: true
    });
    let rfaTerminals = new Set();
    rfaParsed.edges().forEach((e) => {
        rfaGraph.setEdge(e.v, e.w, rfaParsed.edge(e).label, rfaParsed.edge(e).label);
        if (!/([A-Z]+)/.test(rfaParsed.edge(e).label.toString())) {
            rfaTerminals.add(rfaParsed.edge(e).label.toString());
        }
    });
    let rfa = {
        graph: rfaGraph,
        startStates: rfaStartStates,
        finalStatesSet: rfaFinalStateSet,
        terminals: rfaTerminals
    };

    let fsmParsed = dot.read(fs.readFileSync(fsmPath, 'utf-8'));
    let fsm = new Graph({
        multigraph: true
    });
    fsmParsed.edges().forEach((e) => {
        fsm.setEdge(e.v, e.w, fsmParsed.edge(e).label, fsmParsed.edge(e).label);
    });

    //console.log(rfa.graph.outEdges('1'));

    console.log(rfa.startStates);
    console.log(rfa.finalStatesSet);


    let queue = new Set();
    let used = new Set();
    let marked = {};
    let gss = {};
    let result = new Set();

    fsm.nodes().forEach((node) => {
       Object.keys(rfa.startStates).forEach((nonTerm) => {
           Object.keys(rfa.startStates[nonTerm]).forEach((k) => {
               //console.log(k);
               queue.add(JSON.stringify({
                   fsmPos: node,
                   rfaPos: rfa.startStates[nonTerm][k],
                   gss: `(${nonTerm},${node})`
               }));
           });
       })
    });

    //console.log(queue);
    //console.log(rfa.graph.outEdges('0'));

    //fsm.edges().forEach((e) => {
    //   console.log(e);
    //});
    let f = false;
    while (queue.size) {
        //console.log(queue.size);
        let config = queue.values().next().value;
        queue.delete(config);


        if (used.has(config)) {
            continue;
        }
        used.add(config);
        config = JSON.parse(config);

        // 3 case
        if (rfa.finalStatesSet.has(config.rfaPos.toString()) && gss[config.gss.toString()] !== undefined) {
            Object.keys(gss[config.gss]).forEach((j) => {
                gss[config.gss][j].forEach((x) => {
                    queue.add(JSON.stringify({
                        fsmPos: config.fsmPos,
                        rfaPos: x,
                        gss: j
                    }));
                });
            });
            //console.log(config.gss);
            let gssParsed = /\(([a-zA-Z]+),([0-9]+)\)/.exec(config.gss);
            result.add(JSON.stringify([gssParsed[2], gssParsed[1], config.fsmPos]));
            (marked[config.gss.toString()] = marked[config.gss.toString()] || []).push(config.fsmPos.toString());

        }


        rfa.graph.outEdges(config.rfaPos).forEach((rfaTo) => {
            fsm.outEdges(config.fsmPos).forEach((fsmTo) => {

                // 2 case
                //console.log(rfaTo.name);
                if (!rfa.terminals.has(rfaTo.name.toString())) {
                    let gssNew = `(${rfaTo.name},${config.fsmPos})`;
                    gss[gssNew] = gss[gssNew] || {};
                    gss[gssNew][config.gss] = gss[gssNew][config.gss] || new Set();
                    gss[gssNew][config.gss].add(rfaTo.w.toString());
                    //if (rfa.startStates[rfaTo.name.toString()] !== undefined) {
                    for (let st = 0; st < rfa.startStates[rfaTo.name.toString()].length; ++st) {
                        queue.add(JSON.stringify({
                            fsmPos: config.fsmPos,
                            rfaPos: rfa.startStates[rfaTo.name.toString()][st],
                            gss: gssNew
                        }));
                       // console.log(rfa.startStates[rfaTo.name.toString()][st]);
                    }
                    //}

                    if (marked[gssNew.toString()] !== undefined) {
                        for (let v = 0; v < marked[gssNew].length; ++v) {
                            let configTmp = JSON.stringify({
                                fsmPos: marked[gssNew][v],
                                rfaPos: rfaTo.w,
                                gss: config.gss
                            });
                            if (!used.has(configTmp)) {
                                queue.add(configTmp);
                            }
                        }
                    }
                }


                // 1 case
                if (rfaTo.name === fsmTo.name && rfa.terminals.has(rfaTo.name.toString())) {
                    queue.add(JSON.stringify({
                        fsmPos: fsmTo.w,
                        rfaPos: rfaTo.w,
                        gss: config.gss
                    }));
                    if (f === false) {
                        console.log(queue);
                    }
                    f = true;
                }
            });

        });
        //queue.clear();
        //console.log(queue.size);
    }
    console.log(gss);


/*let u = new Set();
let a = 'a';
let b = 1;
u.add(`(${a},${b})`);
console.log(u.has('(a,1)'));*/

      let cnt = 0;
    result.forEach((res) => {
       let w = JSON.parse(res);
        //console.log(w);

        if (w[1] === "S") {
           cnt++;
       }
    });
    console.log(cnt);
//    console.log(queue);

//}
//catch (e) {
//    console.log(`Error: ${e.message}`);
//}