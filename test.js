const { exec }  = require('child_process');
const matrix    = require('./tests/1_matrix_method.json');
const gll       = require('./tests/2_gll.json');
const glr       = require('./tests/3_bottom_up.json');
try {

    let syncExec = (command) => {
        let sync = new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    reject(new Error(err));
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

        console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `Matrix method testing start...`);
        for (let i  = 0; i < matrix.length; ++i) {
            console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `Testing (grammar: '${matrix[i].param2}', graph: '${matrix[i].param1}')`);
            let res = await syncExec(`nodejs 1_matrix_method/index.js ${matrix[i].param2} ${matrix[i].param1} DEBUG`);
            let out = res.stdout.replace(/[\r\n]/g, "");
            let ans = matrix[i].output;
            let status;
            if (out === ans) {
                status = '[OK]';
                console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `out: ${out}, ans: ${ans}`, '\x1b[32m', `${status}`, '\x1b[0m');
            }
            else {
                status = '[FAIL]';
                console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `out: ${out}, ans: ${ans}`, '\x1b[31m', `${status}`, '\x1b[0m');
            }
            console.log('');
        };
        console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `Matrix method testing done!`);
    }


    const gllTest = async () => {

        console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `GLL testing start...`);
        for (let i  = 0; i < gll.length; ++i) {
            console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `Testing (rfa: '${gll[i].param2}', graph: '${gll[i].param1}')`);
            let res = await syncExec(`nodejs 2_gll/index.js ${gll[i].param2} ${gll[i].param1} DEBUG`);
            let out = res.stdout.replace(/[\r\n]/g, "");
            let ans = gll[i].output;
            let status;
            if (out === ans) {
                status = '[OK]';
                console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `out: ${out}, ans: ${ans}`, '\x1b[32m', `${status}`, '\x1b[0m');
            }
            else {
                status = '[FAIL]';
                console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `out: ${out}, ans: ${ans}`, '\x1b[31m', `${status}`, '\x1b[0m');
            }
            console.log('');
        };
        console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `GLL testing done!`);
    }

    let glrTest = async () => {

        console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `GLR testing start...`);
        for (let i  = 0; i < glr.length; ++i) {
            console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `Testing (rfa: '${glr[i].param2}', graph: '${glr[i].param1}')`);
            let res = await syncExec(`nodejs 3_bottom_up/index.js ${glr[i].param2} ${glr[i].param1} DEBUG`);
            let out = res.stdout.replace(/[\r\n]/g, "");
            let ans = glr[i].output;
            let status;
            if (out === ans) {
                status = '[OK]';
                console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `out: ${out}, ans: ${ans}`, '\x1b[32m', `${status}`, '\x1b[0m');
            }
            else {
                status = '[FAIL]';
                console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `out: ${out}, ans: ${ans}`, '\x1b[31m', `${status}`, '\x1b[0m');
            }
            console.log('');
        };
        console.log('\x1b[36m', `[${new Date()}]:`, '\x1b[0m', `GLR testing done!`);
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