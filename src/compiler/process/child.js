import Compiler from '../index';
import TestRunProxy from './test-run-proxy';


console.log('\n', process.argv, '\n');

const compiler = new Compiler(JSON.parse(process.argv[1]));

let tests = null;

process.on('message', data => {
   switch (data.name) {
       case 'getTests':
           compiler.getTests().then(result => { tests = result; process.send(result) });
           return;
       case 'runTest':
           Promise.resolve(tests[data.idx].fn(new TestRunProxy(data.testRunId))).then(() => process.send({})).catch(error => process.send({ error }));
           return;
   }
});
