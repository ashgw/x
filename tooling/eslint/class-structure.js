// class-structure.js
/** @typedef {import('eslint').Rule.RuleModule} RuleModule */
/**
 * Helper predicates
 */
function isMethodLike(n) {
  if (n.type === "MethodDefinition") {
    return n.kind === "method" || n.kind === "get" || n.kind === "set";
  }
  if (n.type === "PropertyDefinition") {
    const v = n.value;
    return (
      v &&
      (v.type === "FunctionExpression" || v.type === "ArrowFunctionExpression")
    );
  }
  return false;
}

function isConstructor(n) {
  return n.type === "MethodDefinition" && n.kind === "constructor";
}

function getName(n) {
  if (n.key?.type === "Identifier") return n.key.name;
  if (n.key?.type === "PrivateIdentifier") return `#${n.key.name}`;
  if (n.key?.type === "Literal" && typeof n.key.value === "string")
    return String(n.key.value);
  return "<computed>";
}

function getAccess(n) {
  // typescript-eslint parser adds `accessibility`
  if (n.accessibility) return n.accessibility; // 'public' | 'protected' | 'private'
  const name = getName(n);
  if (name.startsWith("#")) return "private";
  return undefined;
}

function orderOf(n) {
  if (n.type === "MethodDefinition" && (n.kind === "get" || n.kind === "set"))
    return 0; // accessors first
  const a = getAccess(n);
  if (a === "public") return 1;
  if (a === "protected") return 2;
  if (a === "private") return 3;
  return 4; // unknown or missing goes last for ordering checks
}

/** @type {RuleModule} */
const classStructureRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce class member ordering and explicit visibility",
    },
    messages: {
      order:
        "Class members must be ordered: getters/setters → public → protected → private.",
      visibility: "Method must explicitly declare public/protected/private.",
      privateNaming:
        "Private methods must use #private or an _underscore prefix.",
      classMustHaveMethods:
        "Classes must declare at least one method or accessor.",
    },
    schema: [],
  },
  create(context) {
    return {
      ClassBody(node) {
        const members = node.body
          .filter(isMethodLike)
          .filter((n) => !isConstructor(n));

        // Require at least one method or accessor
        if (members.length === 0) {
          context.report({ node, messageId: "classMustHaveMethods" });
          return;
        }

        // Visibility and naming checks
        for (const m of members) {
          const kind = m.type === "MethodDefinition" ? m.kind : "method";
          if (kind === "method") {
            if (!getAccess(m)) {
              // accessors can be omitted, but plain methods must be explicit
              context.report({ node: m, messageId: "visibility" });
            }
          }
          if (getAccess(m) === "private") {
            const name = getName(m);
            const isHash = name.startsWith("#");
            const isUnderscore = name.startsWith("_");
            if (!isHash && !isUnderscore) {
              context.report({ node: m, messageId: "privateNaming" });
            }
          }
        }

        // Ordering check
        let maxSeen = -1;
        for (const m of members) {
          const cur = orderOf(m);
          if (cur < maxSeen) {
            context.report({ node: m, messageId: "order" });
          } else {
            maxSeen = cur;
          }
        }
      },
    };
  },
};

export default {
  rules: {
    // usage: "class-structure/enforce"
    enforce: classStructureRule,
  },
};
