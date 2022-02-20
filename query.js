const self = {};

self.buildPredicate = query => {
  const blocks = query.split(":");
  const body = blocks.map(self.buildStatement).join("&&");
  return new Function("sub", "return " + body);
};

self.buildStatement = expression => {
  const reg = /(.+),(.{0,2}),(.+)/
  const [match, prop, cmd, val] = reg.exec(expression);
  switch (cmd) {
    case "to":
      return `typeof(sub.${prop}) === '${val}'`;
    case "eq":
      return `String(sub.${prop}) === '${val}'`;
    case "gt":
      return `sub.${prop} > Number('${val}')`;
    case "lt":
      return `sub.${prop} < Number('${val}')`;
    case "sw":
      return `sub.${prop}.startsWith('${val}')`;
    case "ew":
      return `sub.${prop}.endsWith('${val}')`;
    case "in":
      return `sub.${prop}.includes('${val}')`;
  }
};

module.exports = self;
