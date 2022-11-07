const path = require("path");
const polka = require("polka");
const safeEval = require("safe-eval");
const query = require("./query");
const { json, text } = require("body-parser");
const logger = require("simple-express-logger");
const DatabaseWrapper = require("database.wrapper");
const { ENTITIES, PORT=80, DEBUG=false, PFOLDER="persistancefs" } = process.env;

const dbw = new DatabaseWrapper;

const defaults = ENTITIES.split(",").reduce((acc, cur) => ({ ...acc, [cur]: [] }), {});

dbw.setConfig([PFOLDER, "data.json"].join("/"), defaults);

const sendErr = (err, res) => {
  res.statusCode=401;
  res.end(err.message);
}

const modelPath = "/:entity";
const singleModelPath = "/:entity/:id";

const dbMiddleware = (req, res) => {
  if (!ENTITIES.split(",").includes(req.params.entity)) {
    res.statusCode=404;
    res.end();
  };

  DEBUG && console.log("DEBUG -> ");
  DEBUG && console.log("req.method -> ", req.method);
  DEBUG && console.log("req.params -> ", req.params);
  DEBUG && console.log("req.search -> ", req.search);
  DEBUG && console.log("req.body -> ", req.body);

  dbCrud(req.method, req.params, req.search, req.body)
    .then(data => writeResponse(res, data))
    .catch(err => sendErr(err, res));
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
      if (!id) return Promise.reject({ message: "an id is required"});
      return dbw.remove(entity, { id });
    case "GET":
      if (id) {
        return dbw.one(entity, { id });
      } else if (search) {
        let predicate;
        try {
          predicate = query.buildPredicate(search.substr(1));
        } catch (e) {
          console.log(e);
          return Promise.reject({ message: "error building predicate" });
        }
        if (typeof predicate !== "function") return Promise.reject({ message: "wrong predicate" });
        return dbw.filter(entity, predicate);

      } else {
        return dbw.read(entity);
      }
    case "PUT":
      if (!id) return dbw.setPath(entity, data);
      else return dbw.update(entity, { id }, data);
    case "PATCH":
      if (!id) return Promise.reject({ message: "an id is required"});
      return dbw.compute(entity, { id }, safeEval(data));
  }
}

polka()
  .use(logger())
  .get("/", (req, res) => {
    res.end("Coredb API | alpha");
  })
  .get(modelPath, dbMiddleware)
  .get(singleModelPath, dbMiddleware)
  .delete(singleModelPath, dbMiddleware)
  .use(text())
  .patch(modelPath, dbMiddleware)
  .use(json())
  .post(modelPath, dbMiddleware)
  .put(modelPath, dbMiddleware)
  .put(singleModelPath, dbMiddleware)
  .listen(PORT, err => {
    if (err) throw err;
  });
