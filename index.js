const path = require("path");
const polka = require("polka");
const safeEval = require("safe-eval");
const { json, text } = require('body-parser');
const logger = require('simple-express-logger');
const DatabaseWrapper = require('database.wrapper');
const { PORT=80, PFOLDER="persistancefs" } = process.env;

const dbw = new DatabaseWrapper;

dbw.setConfig([PFOLDER, "data.json"].join("/"), {});

const parseSearch = str => !str ? undefined: str.slice(1).split("&").reduce((ac, se) => {
    const [key, value] = se.split("=");
    ac[key] = decodeURIComponent(value);
    return ac;
  }, {});

const modelPath = "/model/:entity";
const singleModelPath = "/model/:entity/:id";

const dbMiddleware = (req, res) => {
  dbCrud(req.method, req.params, req.parsedSearch, req.body).then(data =>
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

const dbCrud = (method, params, search, data) => {
  const { entity, id } = params;

  switch(method) {
    case "POST":
      return dbw.create(entity, data);
    case "DELETE":
      if(!id) return Promise.reject();
      return dbw.remove(entity, { id });
    case "GET":
      if(id) {
        return dbw.one(entity, { id });
      } else if(search) {
        return dbw.filter(entity, search);
      } else {
        return dbw.read(entity);
      }
    case "PUT":
      if(!id) return Promise.reject();
      return dbw.update(entity, { id }, data);
    case "PATCH":
      if(!id) return Promise.reject();
      return dbw.compute(entity, { id }, safeEval(data));
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
  .get(singleModelPath, dbMiddleware)
  .delete(singleModelPath, dbMiddleware)
  .use(text())
  .patch(modelPath, dbMiddleware)
  .use(json())
  .post(modelPath, dbMiddleware)
  .put(singleModelPath, dbMiddleware)
  .listen(PORT, err => {
    if(err) throw err;
  });
