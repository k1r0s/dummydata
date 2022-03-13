const query = require("./query");

let reports = [];

reports.push({ "name": "Sample prod 1", "start": 1646694000000, "end": 1646866800000 });
reports.push({ "name": "Sample prod 2", "start": 1646780400000, "end": 1647039600000 });
reports.push({ "name": "Sample prod 3", "start": 1646521200000, "end": 1646737200000 });

const predicate = query.buildPredicate("start,gt,1646715600000:end,lt,1656744400000");

const filtered = reports.filter(predicate);

console.log(filtered);
