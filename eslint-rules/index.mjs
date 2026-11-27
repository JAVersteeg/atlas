// Local ESLint rules for CLAUDE.md conventions that no stock rule covers. Registered in
// eslint.config.mjs as the `atlas` plugin.

const SUPABASE_CLIENT = 'supabase';
// `supabase.auth.*` is left out on purpose: a failed signOut has nothing to report.
const QUERY_ENTRIES = new Set(['from', 'rpc', 'functions', 'storage']);

/** Whether `node` is a call chain that starts on the app's Supabase client, e.g. `supabase.from(…)…`. */
function isSupabaseQuery(node) {
  let current = node;
  let entry = null;
  while (current) {
    if (current.type === 'CallExpression') {
      current = current.callee;
    } else if (current.type === 'ChainExpression') {
      current = current.expression;
    } else if (current.type === 'MemberExpression') {
      const { object, property } = current;
      if (object.type === 'Identifier' && object.name === SUPABASE_CLIENT && !current.computed) {
        entry = property.name;
      }
      current = object;
    } else {
      break;
    }
  }
  return entry !== null && QUERY_ENTRIES.has(entry);
}

function isPromiseAllOf(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'Promise' &&
    node.callee.property.name === 'all' &&
    node.arguments[0]?.type === 'ArrayExpression'
  );
}

function bindsError(pattern) {
  return pattern.properties.some(
    (property) =>
      property.type === 'RestElement' ||
      (property.type === 'Property' &&
        property.key.type === 'Identifier' &&
        property.key.name === 'error'),
  );
}

const supabaseErrorHandled = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A Supabase query result must have its `error` read: a failed query otherwise looks like an empty one.',
    },
    schema: [],
    messages: {
      ignored:
        'The result of this Supabase call is thrown away, so a failure goes unnoticed. Destructure `error` and handle it.',
      missingError:
        'This Supabase result is destructured without `error`, so a failed query reads as an empty result. Destructure `error` too.',
    },
  },
  create(context) {
    function checkPattern(pattern) {
      if (pattern.type === 'ObjectPattern' && !bindsError(pattern)) {
        context.report({ node: pattern, messageId: 'missingError' });
      }
    }

    return {
      VariableDeclarator(node) {
        if (node.init?.type !== 'AwaitExpression') return;
        const awaited = node.init.argument;

        if (isSupabaseQuery(awaited)) {
          checkPattern(node.id);
        } else if (isPromiseAllOf(awaited) && node.id.type === 'ArrayPattern') {
          awaited.arguments[0].elements.forEach((element, index) => {
            if (element && isSupabaseQuery(element) && node.id.elements[index]) {
              checkPattern(node.id.elements[index]);
            }
          });
        }
      },
      ExpressionStatement(node) {
        if (
          node.expression.type === 'AwaitExpression' &&
          isSupabaseQuery(node.expression.argument)
        ) {
          context.report({ node, messageId: 'ignored' });
        }
      },
    };
  },
};

// Colours live in src/theme/palette.ts, read through Tailwind classes or the `palette` object.
// palette.ts itself is exempt in eslint.config.mjs.
const HEX_COLOUR = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6})\b/;

const noHardcodedHex = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Colours come from src/theme/palette.ts.',
    },
    schema: [],
    messages: {
      hex: 'Hard-coded hex colour. Use a Tailwind colour class, or `palette` from @/theme/palette for props that cannot read a class.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && HEX_COLOUR.test(node.value)) {
          context.report({ node, messageId: 'hex' });
        }
      },
      TemplateElement(node) {
        if (HEX_COLOUR.test(node.value.raw)) context.report({ node, messageId: 'hex' });
      },
    };
  },
};

export default {
  meta: { name: 'eslint-plugin-atlas' },
  rules: {
    'supabase-error-handled': supabaseErrorHandled,
    'no-hardcoded-hex': noHardcodedHex,
  },
};
