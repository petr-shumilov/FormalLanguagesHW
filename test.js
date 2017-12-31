const { exec }  = require('child_process');

try {
    let matrix = [{
            param1: 'graphs/skos.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '810'
        },
        {
            param1: 'graphs/generations.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '2164'
        },
        {
            param1: 'graphs/travel.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '2499'
        },
        {
            param1: 'graphs/univ-bench.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '2540'
        },
        {
            param1: 'graphs/atom-primitive.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '15454'
        },
        {
            param1: 'graphs/biomedical-mesure-primitive.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '15156'
        },
        {
            param1: 'graphs/foaf.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '4118'
        },
        {
            param1: 'graphs/people_pets.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '9472'
        },
        {
            param1: 'graphs/funding.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '17634'
        },
        {
            param1: 'graphs/wine.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '66572'
        },
        {
            param1: 'graphs/pizza.dot',
            param2: 'grammars/q1_grammar.txt',
            output: '56195'
        },
        {
            param1: 'graphs/skos.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '1'
        },
        {
            param1: 'graphs/generations.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '0'
        },
        {
            param1: 'graphs/travel.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '63'
        },
        {
            param1: 'graphs/univ-bench.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '81'
        },
        {
            param1: 'graphs/atom-primitive.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '122'
        },
        {
            param1: 'graphs/biomedical-mesure-primitive.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '2871'
        },
        {
            param1: 'graphs/foaf.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '10'
        },
        {
            param1: 'graphs/people_pets.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '37'
        },
        {
            param1: 'graphs/funding.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '1158'
        },
        {
            param1: 'graphs/wine.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '133'
        },
        {
            param1: 'graphs/pizza.dot',
            param2: 'grammars/q2_grammar.txt',
            output: '1262'
        }
    ];

    let gllAndGlr = [{
            param1: 'graphs/skos.dot',
            param2: 'rfa/rfa_1.dot',
            output: '810'
        },
        {
            param1: 'graphs/generations.dot',
            param2: 'rfa/rfa_1.dot',
            output: '2164'
        },
        {
            param1: 'graphs/travel.dot',
            param2: 'rfa/rfa_1.dot',
            output: '2499'
        },
        {
            param1: 'graphs/univ-bench.dot',
            param2: 'rfa/rfa_1.dot',
            output: '2540'
        },
        {
            param1: 'graphs/atom-primitive.dot',
            param2: 'rfa/rfa_1.dot',
            output: '15454'
        },
        {
            param1: 'graphs/biomedical-mesure-primitive.dot',
            param2: 'rfa/rfa_1.dot',
            output: '15156'
        },
        {
            param1: 'graphs/foaf.dot',
            param2: 'rfa/rfa_1.dot',
            output: '4118'
        },
        {
            param1: 'graphs/people_pets.dot',
            param2: 'rfa/rfa_1.dot',
            output: '9472'
        },
        {
            param1: 'graphs/funding.dot',
            param2: 'rfa/rfa_1.dot',
            output: '17634'
        },
        {
            param1: 'graphs/wine.dot',
            param2: 'rfa/rfa_1.dot',
            output: '66572'
        },
        {
            param1: 'graphs/pizza.dot',
            param2: 'rfa/rfa_1.dot',
            output: '56195'
        },
        {
            param1: 'graphs/skos.dot',
            param2: 'rfa/rfa_2.dot',
            output: '1'
        },
        {
            param1: 'graphs/generations.dot',
            param2: 'rfa/rfa_2.dot',
            output: '0'
        },
        {
            param1: 'graphs/travel.dot',
            param2: 'rfa/rfa_2.dot',
            output: '63'
        },
        {
            param1: 'graphs/univ-bench.dot',
            param2: 'rfa/rfa_2.dot',
            output: '81'
        },
        {
            param1: 'graphs/atom-primitive.dot',
            param2: 'rfa/rfa_2.dot',
            output: '122'
        },
        {
            param1: 'graphs/biomedical-mesure-primitive.dot',
            param2: 'rfa/rfa_2.dot',
            output: '2871'
        },
        {
            param1: 'graphs/foaf.dot',
            param2: 'rfa/rfa_2.dot',
            output: '10'
        },
        {
            param1: 'graphs/people_pets.dot',
            param2: 'rfa/rfa_2.dot',
            output: '37'
        },
        {
            param1: 'graphs/funding.dot',
            param2: 'rfa/rfa_2.dot',
            output: '1158'
        },
        {
            param1: 'graphs/wine.dot',
            param2: 'rfa/rfa_2.dot',
            output: '133'
        },
        {
            param1: 'graphs/pizza.dot',
            param2: 'rfa/rfa_2.dot',
            output: '1262'
        }
    ];



    let syncExec = (command) => {
        let sync = new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        stdout: stdout,
                        stderr: stderr
                    });
                }
            });
        });
        return sync;
    }

    let matrixTest = async () => {

        console.log(`[${new Date()}]: Matrix testing start...`);
        matrix.forEach(async (test) => {
            let res = await syncExec(`nodejs 1_matrix_method/index.js ${test.param2} ${test.param1} DEBUG`);
            let out = res.stdout.replace(/[\r\n]/g, "");
            let ans = test.output;
            let status;
            if (out === ans) {
                status = '[OK]';
            }
            else {
                status = '[FAIL]';
            }
            console.log(`[${new Date()}]: test(grammar: '${test.param2}'; graph: '${test.param1}') out: ${out}; ans: ${ans}; status: ${status}`);
        });
    }

    let gllTest = async () => {

        console.log(`[${new Date()}]: GLL testing start...`);

        gllAndGlr.forEach(async (test) => {
            let res = await syncExec(`nodejs 2_gll/index.js ${test.param2} ${test.param1} DEBUG`);
            let out = res.stdout.replace(/[\r\n]/g, "");
            let ans = test.output;
            let status;
            if (out === ans) {
                status = '[OK]';
            }
            else {
                status = '[FAIL]';
            }
            console.log(`[${new Date()}]: test(rfa: '${test.param2}'; graph: '${test.param1}') out: ${out}; ans: ${ans}; status: ${status}`);
        });
    }

    let glrTest = async () => {

        console.log(`[${new Date()}]: GLR testing start...`);

        gllAndGlr.forEach(async (test) => {
            let res = await syncExec(`nodejs 3_bottom_up/index.js ${test.param2} ${test.param1} DEBUG`);
            let out = res.stdout.replace(/[\r\n]/g, "");
            let ans = test.output;
            let status;
            if (out === ans) {
                status = '[OK]';
            }
            else {
                status = '[FAIL]';
            }
            console.log(`[${new Date()}]: test(rfa: '${test.param2}'; graph: '${test.param1}') out: ${out}; ans: ${ans}; status: ${status}`);
        });
    }

    if (process.argv.length < 3) {
        throw new Error("Invalid arguments number! Usage: nodejs test.js [gll|glr|matrix]");
    }
    else if (process.argv[2] === 'gll') {
        gllTest();
    }
    else if (process.argv[2] === 'glr') {
        glrTest();
    }
    else if (process.argv[2] === 'matrix') {
        matrixTest();
    }
    else {
        throw new Error("Invalid arguments number! Usage: nodejs test.js [gll|glr|matrix]");
    }
}
catch (e) {
    console.log(e.message);
}