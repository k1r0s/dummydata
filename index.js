const path = require("path");
const polka = require("polka");
const { json } = require('body-parser');
const logger = require('simple-express-logger');
const DatabaseWrapper = require('database.wrapper');
const { PORT=80, PFOLDER="persistancefs" } = process.env;

const dbw = new DatabaseWrapper;

dbw.setConfig([PFOLDER, "data.json"].join("/"), { persons: [] });

const parseSearch = str => !str ? undefined: str.slice(1).split("&").reduce((ac, se) => {
    const [key, value] = se.split("=");
    ac[key] = decodeURIComponent(value);
    return ac;
  }, {});

const modelPath = "/model/:entity";

const dbMiddleware = (req, res) => {
  dbCrud(req.method, req.params.entity, req.parsedSearch, req.body).then(data =>
    writeResponse(res, data));
}

const writeResponse = (res, data) => {
  switch(typeof data) {
    case "object":
      const jsonStr = JSON.stringify(data);
      res.write(jsonStr);
      break;
    case "string":
      res.write(data);
      break;
  }
  res.end();
}

const dbCrud = (method, entity, search, data) => {
  switch(method) {
    case "POST":
      return dbw.create(entity, data);
    case "DELETE":
      if(!search) return Promise.reject();
      return dbw.remove(entity, search);
    case "GET":
      if(search) {
        return dbw.filter(entity, search);
      } else {
        return dbw.read(entity);
      }
    case "PUT":
      return dbw.update(entity, search, data);
  }
}

polka()
  .use(logger())
  .get("/", (req, res) => {
    res.end("Coredb API | alpha");
  })
  .use((req, res, next) => {
    req.parsedSearch = parseSearch(req.search);
    next();
  })
  .get(modelPath, dbMiddleware)
  .delete(modelPath, dbMiddleware)
  .use(json())
  .post(modelPath, dbMiddleware)
  .put(modelPath, dbMiddleware)
  .listen(PORT, err => {
    if(err) throw err;
  });
