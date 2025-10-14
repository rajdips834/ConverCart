import React, { useMemo, useState } from "react";

const initialValue = `price > 5000
category = Smartphones
stock_status = instock`;

const allowedFields = new Set([
  "price",
  "category",
  "stock_status",
  "brand",
  "id",
  "stock_quantity",
  "on_sale",
  "created_at",
  "tag",
  "title",
]);
const operators = ["!=", ">=", "<=", "=", ">", "<"];

function validateLine(line, index) {
  if (!line.trim()) return null;

  const m = line.match(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:(!=|>=|<=|=|>|<))\s*(.+?)\s*$/
  );
  if (!m) {
    return {
      line: index + 1,
      message:
        "Expected: field operator value (e.g., price > 5000, category = Smartphones).",
      snippet: line,
    };
  }

  const [, field, op, rawValue] = m;
  console.log(field, "field");
  if (!allowedFields.has(field)) {
    return {
      line: index + 1,
      message: `Unknown field "${field}". Allowed: "price",
  "category",
  "stock_status",
  "brand",
  "id",
  "stock_quantity",
  "on_sale",
  "created_at",
  "tag",
  "title"`,
      snippet: line,
    };
  }

  if (!operators.includes(op)) {
    return {
      line: index + 1,
      message: `Unsupported operator "${op}". Use one of =, !=, >, <, >=, <=.`,
      snippet: line,
    };
  }

  if (field === "price") {
    const num = Number(rawValue);
    if (!Number.isFinite(num)) {
      return {
        line: index + 1,
        message: 'Price must be a number, e.g., "price >= 1000".',
        snippet: line,
      };
    }
  } else {
    if (!rawValue.trim()) {
      return {
        line: index + 1,
        message: `Value cannot be empty for "${field}".`,
        snippet: line,
      };
    }
    if (field === "stock_status") {
      const v = rawValue.trim().toLowerCase();
      const allowed = new Set(["instock", "outofstock", "backorder"]);
      if (!allowed.has(v)) {
        return {
          line: index + 1,
          message: `Invalid stock_status "${rawValue}". Try instock, outofstock, or backorder.`,
          snippet: line,
        };
      }
    }
    if (
      ["category", "stock_status", "brand", "on_sale", "tag"].includes(field) &&
      [">", "<", ">=", "<="].includes(op)
    ) {
      return {
        line: index + 1,
        message: `Operator "${op}" is not supported for "${field}". Use = or !=.`,
        snippet: line,
      };
    }
  }

  return null;
}

export default function FilterEditor({ onEval }) {
  const [value, setValue] = useState(initialValue);
  const [issues, setIssues] = useState(null);

  const lines = useMemo(() => value.split(/\r?\n/), [value]);

  const onValidateClick = () => {
    const found = [];
    lines.forEach((line, idx) => {
      const issue = validateLine(line, idx);
      if (issue) found.push(issue);
    });
    setIssues(found);
  };

  const onResetClick = () => {
    setValue(initialValue);
    setIssues(null);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow border p-8 mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Define Filter Conditions
      </h2>

      <div className="mb-2 text-gray-800 font-medium">
        Enter filter rules (one per line):
      </div>

      <textarea
        className="w-full min-h-[160px] max-h-[240px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 font-mono transition"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`price > 5000\ncategory = Smartphones\nstock_status = instock`}
      />

      <div className="mt-2 text-gray-500 text-sm">
        Examples:{" "}
        <span className="italic">
          price &gt; 5000, category = Smartphones, stock_status = instock
        </span>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg shadow transition"
          onClick={() => onEval(value.replace(/(\r\n|\r|\n)/g, ","))}
          disabled={issues && issues.length > 0}
        >
          &#9654; Evaluate Filter
        </button>
        <button
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg shadow transition"
          onClick={onValidateClick}
        >
          Validate Filter
        </button>
        <button
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg shadow transition"
          onClick={onResetClick}
        >
          &#8635; Reset
        </button>
      </div>

      {issues && (
        <div className="mt-6">
          {issues.length === 0 ? (
            <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              All rules are valid.
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((iss) => (
                <div
                  key={`${iss.line}-${iss.message}`}
                  className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="font-semibold">Line {iss.line}:</div>
                  <div className="mt-1">{iss.message}</div>
                  <div className="mt-1 text-sm text-red-900/80">
                    “{iss.snippet || "(empty)"}”
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-7 bg-gray-50 border rounded-lg py-3 px-4 flex items-center gap-4">
        <div className="font-semibold text-gray-600">Supported operators:</div>
        <div className="space-x-2 text-base">
          <span className="inline-block rounded px-2 py-1 bg-gray-100 border text-gray-900">
            =
          </span>
          <span className="inline-block rounded px-2 py-1 bg-gray-100 border text-gray-900">
            !=
          </span>
          <span className="inline-block rounded px-2 py-1 bg-gray-100 border text-gray-900">
            &gt;=
          </span>
          <span className="inline-block rounded px-2 py-1 bg-gray-100 border text-gray-900">
            &lt;=
          </span>
          <span className="inline-block rounded px-2 py-1 bg-gray-100 border text-gray-900">
            &gt;
          </span>
          <span className="inline-block rounded px-2 py-1 bg-gray-100 border text-gray-900">
            &lt;
          </span>
        </div>
      </div>
    </div>
  );
}
