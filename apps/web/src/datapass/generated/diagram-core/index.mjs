var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../../node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value2) => {
    if (typeof value2 === "bigint") {
      return value2.toString();
    }
    return value2;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data2) => {
  const t = typeof data2;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data2) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data2)) {
        return ZodParsedType.array;
      }
      if (data2 === null) {
        return ZodParsedType.null;
      }
      if (data2.then && typeof data2.then === "function" && data2.catch && typeof data2.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data2 instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data2 instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data2 instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../../node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value2) {
    if (!(value2 instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value2}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../../node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../../node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../../node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data: data2, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data: data2, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value2 = await pair.value;
      syncPairs.push({
        key,
        value: value2
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value: value2 } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value2.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value2.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value2.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value2.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value2) => ({ status: "dirty", value: value2 });
var OK = (value2) => ({ status: "valid", value: value2 });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// ../../node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../../node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value2, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value2;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data2, params) {
    const result = this.safeParse(data2, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data2, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: data2,
      parsedType: getParsedType(data2)
    };
    const result = this._parseSync({ data: data2, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data2) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: data2,
      parsedType: getParsedType(data2)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data: data2, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data: data2, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data2, params) {
    const result = await this.safeParseAsync(data2, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data2, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: data2,
      parsedType: getParsedType(data2)
    };
    const maybeAsyncResult = this._parse({ data: data2, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data2) => {
          if (!data2) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data2) => this["~validate"](data2)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header2] = jwt.split(".");
    if (!header2)
      return false;
    const base64 = header2.replace(/-/g, "+").replace(/_/g, "/").padEnd(header2.length + (4 - header2.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data2) => regex.test(data2), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value2, options) {
    return this._addCheck({
      kind: "includes",
      value: value2,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value2, message) {
    return this._addCheck({
      kind: "startsWith",
      value: value2,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value2, message) {
    return this._addCheck({
      kind: "endsWith",
      value: value2,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value2, message) {
    return this.setLimit("min", value2, true, errorUtil.toString(message));
  }
  gt(value2, message) {
    return this.setLimit("min", value2, false, errorUtil.toString(message));
  }
  lte(value2, message) {
    return this.setLimit("max", value2, true, errorUtil.toString(message));
  }
  lt(value2, message) {
    return this.setLimit("max", value2, false, errorUtil.toString(message));
  }
  setLimit(kind, value2, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value: value2,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value2, message) {
    return this._addCheck({
      kind: "multipleOf",
      value: value2,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value2, message) {
    return this.setLimit("min", value2, true, errorUtil.toString(message));
  }
  gt(value2, message) {
    return this.setLimit("min", value2, false, errorUtil.toString(message));
  }
  lte(value2, message) {
    return this.setLimit("max", value2, true, errorUtil.toString(message));
  }
  lt(value2, message) {
    return this.setLimit("max", value2, false, errorUtil.toString(message));
  }
  setLimit(kind, value2, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value: value2,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value2, message) {
    return this._addCheck({
      kind: "multipleOf",
      value: value2,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value2 = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value2, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value2 = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value2, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value2 = await pair.value;
          syncPairs.push({
            key,
            value: value2,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value2 of discriminatorValues) {
        if (optionsMap.has(value2)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value2)}`);
        }
        optionsMap.set(value2, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value2], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value2, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value2 = await pair.value;
          if (key.status === "aborted" || value2.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value2.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value2.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value2 = pair.value;
        if (key.status === "aborted" || value2.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value2.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value2.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value2, params) => {
  return new ZodLiteral({
    value: value2,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data2) => {
      return this._def.type.parseAsync(data2, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base2 = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base2))
          return INVALID;
        const result = effect.transform(base2.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base2) => {
          if (!isValid(base2))
            return INVALID;
          return Promise.resolve(effect.transform(base2.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data2 = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data2 = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data: data2,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data2 = ctx.data;
    return this._def.type._parse({
      data: data2,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data2) => {
      if (isValid(data2)) {
        data2.value = Object.freeze(data2.value);
      }
      return data2;
    };
    return isAsync(result) ? result.then((data2) => freeze(data2)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data2) {
  const p = typeof params === "function" ? params(data2) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data2, ctx) => {
      const r = check(data2);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data2);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data2);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data2) => data2 instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// ../../src/experience/kpi.ts
var MODEL_METRICS = ["tables", "facts", "dimensions", "relationships", "active", "inactive", "measures", "columns"];
var TABLE_METRICS = ["rows"];
var KPI_METRICS = [...MODEL_METRICS, ...TABLE_METRICS];
function countsOf(source) {
  if (source?.type === "model") {
    const active = source.relationships.filter((r) => r.active).length;
    return {
      tables: source.tables.length,
      facts: source.tables.filter((t) => t.kind === "fact").length,
      dimensions: source.tables.filter((t) => t.kind === "dimension").length,
      relationships: source.relationships.length,
      active,
      inactive: source.relationships.length - active,
      measures: source.measures.length,
      columns: source.tables.reduce((n, t) => n + t.columns.length, 0)
    };
  }
  if (source?.type === "table") return { rows: source.rows.length };
  return null;
}
var metricFits = (source, metric) => countsOf(source)?.[metric] !== void 0;

// ../../src/experience/model.ts
var id = external_exports.string().regex(/^[a-z][a-z0-9_.-]{0,119}$/);
var label = external_exports.string().min(1).max(200);
var ids = external_exports.array(id).max(1e3).default([]);
var visibility = external_exports.enum(["public", "private"]).default("private");
var scalar = external_exports.union([external_exports.string().max(4e3), external_exports.number().finite(), external_exports.boolean(), external_exports.null()]);
var base = {
  id,
  title: label,
  entityId: id,
  sourceIds: ids,
  visibility,
  provenance: external_exports.enum(["source-derived", "synthetic", "reconstruction", "author"]).default("author"),
  approval: external_exports.enum(["draft", "approved"]).default("draft")
};
var itemSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({ ...base, type: external_exports.literal("note"), text: external_exports.string().max(5e4) }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("code"), language: label, code: external_exports.string().max(5e4), file: external_exports.string().max(1e3).optional() }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("table"), columns: external_exports.array(label).min(1).max(30), rows: external_exports.array(external_exports.array(scalar).max(30)).max(500), statusColumn: label.optional() }).strict(),
  external_exports.object({
    ...base,
    type: external_exports.literal("kpi"),
    value: external_exports.string().max(120),
    unit: external_exports.string().max(60).default(""),
    note: external_exports.string().max(1e3).default(""),
    // Report tile extras: a displayed comparison, never a computed or measured claim.
    delta: external_exports.string().max(40).optional(),
    trend: external_exports.enum(["up", "down", "flat"]).optional(),
    tone: external_exports.enum(["good", "bad", "neutral"]).optional(),
    comparison: external_exports.string().max(120).optional(),
    // Count from another item (model or table) instead of showing the typed value; see kpi.ts.
    derive: external_exports.object({ itemId: id, metric: external_exports.enum(KPI_METRICS) }).strict().optional()
  }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("chart"), chartType: external_exports.enum(["bar", "line", "hbar", "stacked", "donut", "scatter"]), dataItemId: id, labelColumn: label, valueColumns: external_exports.array(label).min(1).max(6), unit: external_exports.string().max(80).default("") }).strict(),
  external_exports.object({
    ...base,
    type: external_exports.literal("gantt"),
    tasks: external_exports.array(external_exports.object({ id: id.optional(), label, start: external_exports.string().date(), end: external_exports.string().date(), progress: external_exports.number().min(0).max(100).default(0), group: external_exports.string().max(60).optional(), dependsOn: external_exports.array(id).max(10).optional() }).strict()).min(1).max(80),
    milestones: external_exports.array(external_exports.object({ label: external_exports.string().min(1).max(80), date: external_exports.string().date() }).strict()).max(20).default([])
  }).strict(),
  // Report-screen furniture. All display-only: a filter panel shows a stated view, it does not query anything.
  external_exports.object({ ...base, type: external_exports.literal("filters"), fields: external_exports.array(external_exports.object({ label: external_exports.string().min(1).max(60), value: external_exports.string().max(120) }).strict()).min(1).max(12) }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("callouts"), entries: external_exports.array(external_exports.object({ title: external_exports.string().min(1).max(120), text: external_exports.string().max(600), tone: external_exports.enum(["good", "bad", "neutral", "info"]).default("info") }).strict()).min(1).max(8) }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("steps"), steps: external_exports.array(external_exports.object({ title: external_exports.string().min(1).max(60), caption: external_exports.string().max(200).default("") }).strict()).min(2).max(8) }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("tabs"), itemIds: external_exports.array(id).min(2).max(6) }).strict(),
  // Displayed equation as plain text (no TeX engine, nothing evaluated) plus a symbol legend.
  // Semantic model (star schema): tables, relationships "Table.Column" -> "Table.Column", and measure names. Display only.
  external_exports.object({
    ...base,
    type: external_exports.literal("model"),
    tables: external_exports.array(external_exports.object({
      name: external_exports.string().min(1).max(80).regex(/^[^.]+$/, "Table names cannot contain a dot"),
      kind: external_exports.enum(["fact", "dimension", "bridge", "other"]).default("dimension"),
      columns: external_exports.array(external_exports.object({ name: external_exports.string().min(1).max(80), type: external_exports.string().max(30).default(""), key: external_exports.enum(["pk", "fk"]).optional() }).strict()).max(60).default([]),
      col: external_exports.number().int().min(0).max(11).optional(),
      row: external_exports.number().int().min(0).max(8).optional()
    }).strict()).min(1).max(40),
    relationships: external_exports.array(external_exports.object({ from: external_exports.string().min(3).max(161), to: external_exports.string().min(3).max(161), cardinality: external_exports.enum(["*:1", "1:1", "*:*"]).default("*:1"), active: external_exports.boolean().default(true) }).strict()).max(120).default([]),
    measures: external_exports.array(external_exports.object({ name: external_exports.string().min(1).max(120), table: external_exports.string().max(80).optional(), format: external_exports.string().max(40).optional() }).strict()).max(100).default([])
  }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("formula"), expression: external_exports.string().min(1).max(300), symbols: external_exports.array(external_exports.object({ symbol: external_exports.string().min(1).max(24), meaning: external_exports.string().max(160) }).strict()).max(12).default([]) }).strict(),
  external_exports.object({ ...base, type: external_exports.literal("image"), data: external_exports.string().max(28e5).regex(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/), caption: external_exports.string().max(1e3), rights: external_exports.string().max(1e3) }).strict()
]);
var packSchema = external_exports.object({
  format: external_exports.literal("diagramcloud.experience"),
  schemaVersion: external_exports.literal(1),
  id,
  title: label,
  revision: external_exports.number().int().nonnegative().default(0),
  rootId: id,
  sources: external_exports.array(external_exports.object({ id, title: label, kind: external_exports.enum(["repository", "pdf", "manual", "manifest", "codewiki"]), locator: external_exports.string().max(2e3), revision: external_exports.string().max(120).optional(), page: external_exports.number().int().positive().optional(), visibility }).strict()).max(1e3),
  entities: external_exports.array(external_exports.object({ id, label, type: external_exports.enum(["organization", "project", "workstream", "subsystem", "task", "component", "resource", "repository"]), summary: external_exports.string().max(2e3).default(""), children: ids, workspaceIds: ids, sourceIds: ids, visibility, assertion: external_exports.enum(["declared", "inferred", "illustrative", "verified-in-source"]).default("declared") }).strict()).min(1).max(1e3),
  relations: external_exports.array(external_exports.object({ id, source: id, target: id, kind: external_exports.enum(["uses", "calls", "reads", "writes", "produces", "validates", "documents"]), assertion: external_exports.enum(["declared", "inferred", "illustrative", "verified-in-source"]).default("declared"), sourceIds: ids, visibility }).strict()).max(2e3),
  items: external_exports.array(itemSchema).max(1500),
  workspaces: external_exports.array(external_exports.object({
    id,
    title: label,
    entityId: id,
    description: external_exports.string().max(3e3).default(""),
    visibility,
    placements: external_exports.array(external_exports.object({ id, itemId: id, x: external_exports.number().int().min(0).max(11), y: external_exports.number().int().min(0).max(200), w: external_exports.number().int().min(1).max(12), h: external_exports.number().int().min(1).max(12) }).strict()).max(100),
    // Optional report-screen frame: left context rail (like a portfolio slide) and accent colour.
    context: external_exports.array(external_exports.object({ heading: external_exports.string().min(1).max(60), lines: external_exports.array(external_exports.string().max(160)).max(10) }).strict()).max(6).default([]),
    accent: external_exports.enum(["blue", "teal", "orange", "violet"]).default("blue")
  }).strict()).max(200)
}).strict();
var MAX_PACK_BYTES = 12 * 1024 * 1024;
function validatePack(input) {
  const p = packSchema.parse(input), errors = [];
  const index = (rows, kind) => {
    const set = /* @__PURE__ */ new Set();
    for (const row of rows) {
      if (set.has(row.id)) errors.push(`Duplicate ${kind}: ${row.id}`);
      set.add(row.id);
    }
    return set;
  };
  const entities = index(p.entities, "entity"), items = index(p.items, "item"), spaces = index(p.workspaces, "workspace"), sources = index(p.sources, "source");
  index(p.relations, "relation");
  const check = (value2, set, context) => {
    if (!set.has(value2)) errors.push(`${context}: unknown reference ${value2}`);
  };
  check(p.rootId, entities, "Root");
  for (const e of p.entities) {
    e.children.forEach((x) => check(x, entities, e.id));
    e.workspaceIds.forEach((x) => check(x, spaces, e.id));
    e.sourceIds.forEach((x) => check(x, sources, e.id));
    if (new Set(e.children).size !== e.children.length) errors.push(`Duplicate child in ${e.id}`);
  }
  for (const r of p.relations) {
    check(r.source, entities, r.id);
    check(r.target, entities, r.id);
    r.sourceIds.forEach((x) => check(x, sources, r.id));
  }
  for (const i of p.items) {
    check(i.entityId, entities, i.id);
    i.sourceIds.forEach((x) => check(x, sources, i.id));
    if (i.type === "table") {
      if (new Set(i.columns).size !== i.columns.length) errors.push(`Duplicate column in ${i.id}`);
      if (i.rows.some((r) => r.length !== i.columns.length)) errors.push(`Row width mismatch in ${i.id}`);
    }
    if (i.type === "chart") {
      const t = p.items.find((x) => x.id === i.dataItemId);
      if (t?.type !== "table") errors.push(`${i.id}: chart requires a table`);
      else {
        for (const c of [i.labelColumn, ...i.valueColumns]) if (!t.columns.includes(c)) errors.push(`${i.id}: unknown column ${c}`);
        for (const c of i.valueColumns) {
          const n = t.columns.indexOf(c);
          if (t.rows.some((r) => typeof r[n] !== "number")) errors.push(`${i.id}: numeric series required for ${c}`);
        }
      }
    }
    if (i.type === "chart" && i.chartType === "scatter" && i.valueColumns.length < 2) errors.push(`${i.id}: scatter needs x and y value columns`);
    if (i.type === "chart" && i.chartType === "donut" && i.valueColumns.length !== 1) errors.push(`${i.id}: donut needs exactly one value column`);
    if (i.type === "chart" && i.chartType === "hbar" && i.valueColumns.length > 2) errors.push(`${i.id}: hbar takes one value column, or two for low/high range bars`);
    if (i.type === "table" && i.statusColumn && !i.columns.includes(i.statusColumn)) errors.push(`${i.id}: unknown status column ${i.statusColumn}`);
    if (i.type === "gantt") {
      if (i.tasks.some((t) => t.end < t.start)) errors.push(`${i.id}: Gantt end precedes start`);
      const taskIds = new Set(i.tasks.flatMap((t) => t.id ? [t.id] : []));
      if (taskIds.size !== i.tasks.filter((t) => t.id).length) errors.push(`${i.id}: duplicate Gantt task id`);
      for (const t of i.tasks) for (const d of t.dependsOn ?? []) if (!taskIds.has(d) || d === t.id) errors.push(`${i.id}: invalid dependency ${d}`);
    }
    if (i.type === "kpi" && i.derive) {
      const src = p.items.find((x) => x.id === i.derive.itemId);
      if (!src || src.id === i.id) errors.push(`${i.id}: counts from unknown item ${i.derive.itemId}`);
      else if (!metricFits(src, i.derive.metric)) errors.push(`${i.id}: ${src.type} ${src.id} cannot provide ${i.derive.metric}`);
    }
    if (i.type === "model") {
      const tables = /* @__PURE__ */ new Map();
      for (const t of i.tables) {
        if (tables.has(t.name)) errors.push(`${i.id}: duplicate table ${t.name}`);
        const cols = /* @__PURE__ */ new Set();
        for (const c of t.columns) {
          if (cols.has(c.name)) errors.push(`${i.id}: duplicate column ${t.name}.${c.name}`);
          cols.add(c.name);
        }
        tables.set(t.name, cols);
      }
      const ref = (r) => {
        const dot = r.indexOf("."), t = r.slice(0, dot), c = r.slice(dot + 1);
        if (dot < 1 || !tables.get(t)?.has(c)) errors.push(`${i.id}: unknown column ${r}`);
        return t;
      };
      for (const r of i.relationships) if (ref(r.from) === ref(r.to)) errors.push(`${i.id}: relationship ${r.from} -> ${r.to} stays inside one table`);
      for (const m of i.measures) if (m.table && !tables.has(m.table)) errors.push(`${i.id}: measure ${m.name} names unknown table ${m.table}`);
      if (i.tables.some((t) => t.col === void 0 !== (t.row === void 0))) errors.push(`${i.id}: a table position needs both col and row`);
    }
    if (i.type === "tabs") {
      if (new Set(i.itemIds).size !== i.itemIds.length) errors.push(`${i.id}: duplicate tab`);
      for (const t of i.itemIds) {
        const target = p.items.find((x) => x.id === t);
        if (!target) errors.push(`${i.id}: unknown tab item ${t}`);
        else if (target.type === "tabs") errors.push(`${i.id}: tabs cannot contain tabs`);
      }
    }
  }
  for (const w of p.workspaces) {
    check(w.entityId, entities, w.id);
    index(w.placements, `placement in ${w.id}`);
    for (const s of w.placements) {
      check(s.itemId, items, w.id);
      if (s.x + s.w > 12) errors.push(`${w.id}: panel outside 12-column grid`);
    }
    for (let a = 0; a < w.placements.length; a++) for (let b = a + 1; b < w.placements.length; b++) {
      const x = w.placements[a], y = w.placements[b];
      if (x.x < y.x + y.w && x.x + x.w > y.x && x.y < y.y + y.h && x.y + x.h > y.y) errors.push(`${w.id}: overlapping panels ${x.id}/${y.id}`);
    }
  }
  const done = /* @__PURE__ */ new Set(), active = /* @__PURE__ */ new Set(), byId = new Map(p.entities.map((e) => [e.id, e]));
  function visit(e) {
    if (active.has(e)) {
      errors.push(`Navigation cycle at ${e}`);
      return;
    }
    if (done.has(e)) return;
    active.add(e);
    byId.get(e)?.children.forEach(visit);
    active.delete(e);
    done.add(e);
  }
  p.entities.forEach((e) => visit(e.id));
  if (errors.length) throw new Error(errors.slice(0, 20).join("\n"));
  return p;
}
function publicPack(input) {
  const p = structuredClone(input), sourceIds = new Set(p.sources.filter((s) => s.visibility === "public").map((s) => s.id));
  const candidates = new Map(p.entities.filter((e) => e.visibility === "public" && e.sourceIds.every((s) => sourceIds.has(s))).map((e) => [e.id, e]));
  if (!candidates.has(p.rootId)) throw new Error("Root is private or cites a private source");
  const seen = /* @__PURE__ */ new Set();
  function walk(id4) {
    const e = candidates.get(id4);
    if (!e || seen.has(id4)) return;
    seen.add(id4);
    e.children.forEach(walk);
  }
  walk(p.rootId);
  p.entities = p.entities.filter((e) => seen.has(e.id));
  p.items = p.items.filter((i) => i.visibility === "public" && i.approval === "approved" && seen.has(i.entityId) && i.sourceIds.every((s) => sourceIds.has(s)));
  let allowed = new Set(p.items.map((i) => i.id));
  p.items = p.items.filter((i) => (i.type !== "chart" || allowed.has(i.dataItemId)) && (i.type !== "kpi" || !i.derive || allowed.has(i.derive.itemId)));
  allowed = new Set(p.items.map((i) => i.id));
  p.items = p.items.flatMap((i) => {
    if (i.type !== "tabs") return [i];
    const kept = i.itemIds.filter((t) => allowed.has(t));
    return kept.length >= 2 ? [{ ...i, itemIds: kept }] : [];
  });
  allowed = new Set(p.items.map((i) => i.id));
  p.workspaces = p.workspaces.filter((w) => w.visibility === "public" && seen.has(w.entityId)).map((w) => ({ ...w, placements: w.placements.filter((s) => allowed.has(s.itemId)) }));
  const reachableSpaces = new Set(p.entities.flatMap((e) => e.workspaceIds));
  p.workspaces = p.workspaces.filter((w) => reachableSpaces.has(w.id));
  const used = new Set(p.workspaces.flatMap((w) => w.placements.map((s) => s.itemId)));
  p.items.filter((i) => used.has(i.id)).forEach((i) => {
    if (i.type === "tabs") i.itemIds.forEach((t) => used.add(t));
  });
  p.items.filter((i) => used.has(i.id)).forEach((i) => {
    if (i.type === "chart") used.add(i.dataItemId);
    if (i.type === "kpi" && i.derive) used.add(i.derive.itemId);
  });
  p.items = p.items.filter((i) => used.has(i.id));
  const keptSpaces = new Set(p.workspaces.map((w) => w.id));
  p.entities = p.entities.map((e) => ({ ...e, children: e.children.filter((c) => seen.has(c)), workspaceIds: e.workspaceIds.filter((w) => keptSpaces.has(w)) }));
  p.relations = p.relations.filter((r) => r.visibility === "public" && seen.has(r.source) && seen.has(r.target) && r.sourceIds.every((s) => sourceIds.has(s)));
  const usedSources = /* @__PURE__ */ new Set([...p.entities.flatMap((e) => e.sourceIds), ...p.items.flatMap((i) => i.sourceIds), ...p.relations.flatMap((r) => r.sourceIds)]);
  p.sources = p.sources.filter((s) => usedSources.has(s.id) && sourceIds.has(s.id));
  return validatePack(p);
}

// ../../src/core/secrets.ts
var SECRET_VALUES = [
  /mongodb(?:\+srv)?:\/\/[^\s"'`]+/i,
  /\b(?:postgres(?:ql)?|mysql|redis|amqp):\/\/[^\s"'`]+/i,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{16,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  /\b(?:password|passwd|pwd|secret|token|api[_-]?key|client[_-]?secret)\s*[:=]\s*[^\s,;"'`]+/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/
];
var SECRET_KEY = /passw(?:or)?d|passphrase|pwd|secret|token|api_?key|private_?key|recovery_?(?:code|key)|connection_?string|dotenv|env_?contents?/i;
var SAFE_KEY_SUFFIX = /(?:_ref|Ref|_id|Id|_name|Name|_label|Label|_present|Present|_missing|Missing|_expected|Expected|_exists|Exists|_at|At|_count|Count|_status|Status)$/;
var DOTENV_LINE = /^\s*(?:export\s+)?[A-Z][A-Z0-9_]*\s*=/gm;
function secretInText(value2) {
  if (SECRET_VALUES.some((p) => p.test(value2))) return "credential-like value";
  if ((value2.match(DOTENV_LINE) ?? []).length >= 2) return "looks like .env contents";
  return null;
}
function secretFindings(value2, path = "", out = []) {
  if (typeof value2 === "string") {
    const reason = secretInText(value2);
    if (reason) out.push(`${path || "(root)"}: ${reason}`);
  } else if (Array.isArray(value2)) value2.forEach((v, i) => secretFindings(v, `${path}[${i}]`, out));
  else if (value2 && typeof value2 === "object") for (const [key, nested] of Object.entries(value2)) {
    const at = path ? `${path}.${key}` : key;
    if (SECRET_KEY.test(key) && !SAFE_KEY_SUFFIX.test(key)) out.push(`${at}: secret-like field name`);
    secretFindings(nested, at, out);
  }
  return out;
}
function isOpenUri(value2) {
  try {
    const u = new URL(value2);
    return ["https:", "http:", "vscode:"].includes(u.protocol) && !u.username && !u.password;
  } catch {
    return false;
  }
}

// ../../src/core/model.ts
var MAX_DOCUMENT_BYTES = 12 * 1024 * 1024;
var id2 = external_exports.string().regex(/^[a-z][a-z0-9_.-]{0,79}$/, "Use a stable lowercase ID");
var text = external_exports.string().max(5e4);
var short = external_exports.string().min(1).max(160);
var visibility2 = external_exports.enum(["public", "private"]).default("public");
var refs = external_exports.array(id2).max(1e3).default([]);
var point = external_exports.object({ x: external_exports.number().finite().min(-1e5).max(1e5), y: external_exports.number().finite().min(-1e5).max(1e5) }).strict();
var sourceSchema = external_exports.object({ id: id2, title: short, location: text.default(""), url: external_exports.string().url().refine((s) => /^https?:\/\//i.test(s), "Only HTTP(S) source links").optional(), visibility: visibility2 }).strict();
var remoteAssetSchema = external_exports.object({ provider: external_exports.literal("google-drive"), fileId: external_exports.string().regex(/^[A-Za-z0-9_-]{1,256}$/, "Invalid Google Drive file ID"), fileName: short, mimeType: external_exports.enum(["image/png", "image/jpeg", "image/webp"]), webViewLink: external_exports.string().url().refine((s) => /^https:\/\//i.test(s), "Drive links must use HTTPS").optional(), modifiedTime: external_exports.string().datetime({ offset: true }).optional(), size: external_exports.string().regex(/^\d+$/).optional(), savedAt: external_exports.string().datetime({ offset: true }) }).strict();
var assetSchema = external_exports.object({ id: id2, name: short, data: external_exports.string().max(3 * 1024 * 1024).regex(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, "Embedded PNG, JPEG or WebP only"), rights: external_exports.string().max(1e3), visibility: visibility2, remote: remoteAssetSchema.optional() }).strict();
var PROVENANCES = ["source-derived", "synthetic", "reference", "author"];
var baseBlock = {
  id: id2,
  title: short,
  visibility: visibility2,
  sourceIds: refs,
  provenance: external_exports.enum(PROVENANCES).default("author"),
  /** Optional step when the block is part of an explained transformation (input → logic → output); display only. */
  transform: external_exports.enum(["input", "logic", "output", "mapping", "rules"]).optional()
};
var blockSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({ ...baseBlock, type: external_exports.literal("text"), text }).strict(),
  external_exports.object({ ...baseBlock, type: external_exports.literal("code"), language: external_exports.enum(["sql", "python", "dax", "json", "text"]).default("text"), code: text }).strict(),
  external_exports.object({ ...baseBlock, type: external_exports.literal("table"), columns: external_exports.array(short).min(1).max(20), rows: external_exports.array(external_exports.array(external_exports.union([external_exports.string().max(2e3), external_exports.number().finite(), external_exports.boolean(), external_exports.null()])).max(20)).max(500) }).strict(),
  external_exports.object({ ...baseBlock, type: external_exports.literal("image"), assetId: id2, caption: text.default("") }).strict(),
  external_exports.object({ ...baseBlock, type: external_exports.literal("metrics"), items: external_exports.array(external_exports.object({ label: short, value: external_exports.string().max(80), note: external_exports.string().max(500).default("") }).strict()).max(12) }).strict()
]);
var BASES = ["planned", "static-source", "unknown"];
var basis = external_exports.enum(BASES).optional();
var PERSPECTIVES = ["system", "code", "data", "cloud", "git", "cicd", "agents", "decisions", "evidence"];
var nodeSchema = external_exports.object({ id: id2, label: short, kind: external_exports.enum(["source", "process", "storage", "model", "report", "app", "control", "physics", "function", "table"]).default("process"), provider: external_exports.string().max(80).default("Generic"), icon: external_exports.string().max(80).default("generic"), summary: external_exports.string().max(500).default(""), role: external_exports.string().max(1e3).default(""), status: external_exports.enum(["idle", "running", "complete", "warning", "failed"]).default("idle"), childViewId: id2.optional(), experienceWorkspaceId: id2.optional(), blockIds: refs, sourceIds: refs, tags: external_exports.array(external_exports.string().max(80)).max(20).default([]), basis, visibility: visibility2 }).strict();
var quantitySchema = external_exports.object({ value: external_exports.number().finite().min(0).max(1e15), unit: external_exports.string().min(1).max(24), provenance: external_exports.enum(PROVENANCES), note: external_exports.string().max(200).optional() }).strict();
var edgeSchema = external_exports.object({ id: id2, source: id2, target: id2, label: external_exports.string().max(160).default(""), kind: external_exports.enum(["batch", "stream", "query", "control", "dependency"]).default("batch"), speed: external_exports.enum(["slow", "medium", "fast"]).default("medium"), basis, quantity: quantitySchema.optional(), visibility: visibility2 }).strict();
var DESIGN_TYPES = ["auto", "architecture", "layers", "exploded", "tree", "swimlane", "sequence", "timeline", "chart", "deployment", "matrix", "treemap", "hub", "heatmap", "line", "context", "status", "lineage", "radial", "atlas", "sankey"];
var DESIGN_THEMES = ["light", "dark", "editorial"];
var designSchema = external_exports.object({ type: external_exports.enum(DESIGN_TYPES).default("auto"), focal: external_exports.array(id2).max(2).default([]), theme: external_exports.enum(DESIGN_THEMES).optional(), caption: external_exports.string().max(300).optional() }).strict();
var viewSchema = external_exports.object({ id: id2, title: short, description: external_exports.string().max(2e3).default(""), nodeIds: refs, edgeIds: refs, positions: external_exports.record(id2, point).default({}), perspective: external_exports.enum(PERSPECTIVES).optional(), design: designSchema.optional(), visibility: visibility2 }).strict();
var instant = external_exports.string().datetime({ offset: true, message: "Use an ISO 8601 timestamp with a time zone, e.g. 2026-09-25T10:00:00Z" });
var openUri = external_exports.string().max(2e3).refine(isOpenUri, "Only http(s) or vscode links without embedded credentials");
var OBSERVATION_CLAIMS = ["observed", "verified", "partial", "not-observed"];
var observationSchema = external_exports.object({ id: id2, nodeId: id2, sourceApp: external_exports.string().regex(/^[a-z][a-z0-9_-]{0,39}$/, "Source app is a lowercase Galaxy/app name such as datapass_vscode or datapass-vscode"), authority: short, observedAt: instant, sourceRevision: external_exports.string().min(1).max(120), claim: external_exports.enum(OBSERVATION_CLAIMS), summary: external_exports.string().min(1).max(500), link: openUri.optional(), blockIds: refs, caveat: external_exports.string().max(1e3).default(""), visibility: external_exports.enum(["public", "private"]).default("private"), reviewedAt: instant.optional(), shareable: external_exports.boolean().default(false) }).strict();
var portfolioSchema = external_exports.object({ projectRef: external_exports.string().regex(/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,119}$/, "Use a stable project reference such as a DATAPASSCONTROL entity_id").optional(), openUri: openUri.optional(), lastReviewedAt: instant.optional(), indexVisibility: external_exports.enum(["private", "shareable"]).default("private") }).strict();
var stepSchema = external_exports.object({ title: short, viewId: id2, nodeId: id2.optional(), narration: external_exports.string().max(2e3), highlightEdgeIds: refs, observationIds: external_exports.array(id2).max(20).optional() }).strict();
var sha = external_exports.string().regex(/^[0-9a-f]{7,64}$/, "A revision is a hexadecimal commit ID (7 to 64 characters)");
var locator = external_exports.string().min(1).max(500).refine((s) => !/^[a-z][a-z0-9+.-]*:\/\/[^/]*@/i.test(s) && !/[?&](token|access_token|private_token|sig)=/i.test(s), "A repository locator never carries credentials");
var REPOSITORY_HOSTS = ["github", "gitlab", "azure-devops", "bitbucket", "local", "other"];
var SCAN_STATUSES = ["scanned", "not-scanned", "failed", "missing"];
var snapshotRepositorySchema = external_exports.object({
  id: id2,
  title: short,
  host: external_exports.enum(REPOSITORY_HOSTS),
  locator,
  revision: sha.optional(),
  ref: external_exports.string().max(200).optional(),
  scanStatus: external_exports.enum(SCAN_STATUSES),
  authority: external_exports.enum(["git", "manifest", "lens", "brain", "author"]),
  scannedAt: instant.optional(),
  nodeId: id2.optional(),
  note: external_exports.string().max(500).optional(),
  visibility: external_exports.enum(["public", "private"]).optional()
}).strict();
var externalRefSchema = external_exports.object({ id: id2, sourceApp: external_exports.string().regex(/^[a-z][a-z0-9_-]{0,39}$/), kind: short, ref: external_exports.string().min(1).max(500), observedAt: instant.optional(), basis: external_exports.enum(["planned", "static-source", "observed"]), note: external_exports.string().max(500).optional() }).strict();
var snapshotSchema = external_exports.object({ id: id2, capturedAt: instant, label: external_exports.string().max(160).optional(), repositories: external_exports.array(snapshotRepositorySchema).max(60), runtimeRefs: external_exports.array(externalRefSchema).max(200).default([]), contextRefs: external_exports.array(externalRefSchema).max(200).default([]) }).strict();
var atlasSchema = external_exports.object({ snapshots: external_exports.array(snapshotSchema).min(1).max(20), activeSnapshotId: id2 }).strict();
var documentSchema = external_exports.object({ schemaVersion: external_exports.literal(1), id: id2, revision: external_exports.number().int().nonnegative().default(0), title: short, summary: external_exports.string().max(3e3).default(""), author: external_exports.string().max(160).default(""), category: external_exports.enum(["Portfolio", "Reference", "Blank"]).default("Blank"), tags: external_exports.array(external_exports.string().max(80)).max(30).default([]), rootViewId: id2, provenance: external_exports.string().max(3e3).default(""), privateNotes: external_exports.string().max(1e4).optional(), nodes: external_exports.array(nodeSchema).max(500), edges: external_exports.array(edgeSchema).max(1500), views: external_exports.array(viewSchema).min(1).max(80), blocks: external_exports.array(blockSchema).max(1500).default([]), assets: external_exports.array(assetSchema).max(30).default([]), sources: external_exports.array(sourceSchema).max(200).default([]), story: external_exports.array(stepSchema).max(100).default([]), observations: external_exports.array(observationSchema).max(500).default([]), portfolio: portfolioSchema.optional(), experience: packSchema.optional(), atlas: atlasSchema.optional() }).strict();
function validateDocument(input) {
  const d = documentSchema.parse(input), errors = [];
  if (d.experience) validatePack(d.experience);
  for (const node of d.nodes) if (node.experienceWorkspaceId && !d.experience?.workspaces.some((w) => w.id === node.experienceWorkspaceId)) errors.push(`${node.id}: unknown experience workspace ${node.experienceWorkspaceId}`);
  function ids2(items, kind) {
    const seen = /* @__PURE__ */ new Set();
    for (const i of items) {
      if (seen.has(i.id)) errors.push(`Duplicate ${kind} ID: ${i.id}`);
      seen.add(i.id);
    }
    return seen;
  }
  const nodes = ids2(d.nodes, "node"), edges = ids2(d.edges, "edge"), views = ids2(d.views, "view"), blocks = ids2(d.blocks, "block"), assets = ids2(d.assets, "asset"), sources = ids2(d.sources, "source"), observations = ids2(d.observations, "observation");
  function check(ref, set, label2) {
    if (!set.has(ref)) errors.push(`${label2}: unknown reference ${ref}`);
  }
  check(d.rootViewId, views, "rootViewId");
  if (d.views.find((v) => v.id === d.rootViewId)?.visibility === "private") errors.push("Root view must be public");
  for (const n of d.nodes) {
    n.blockIds.forEach((r) => check(r, blocks, n.id));
    n.sourceIds.forEach((r) => check(r, sources, n.id));
    if (n.childViewId) check(n.childViewId, views, n.id);
  }
  for (const e of d.edges) {
    check(e.source, nodes, e.id);
    check(e.target, nodes, e.id);
  }
  for (const b of d.blocks) {
    b.sourceIds.forEach((r) => check(r, sources, b.id));
    if (b.type === "image") check(b.assetId, assets, b.id);
    if (b.type === "table" && b.rows.some((r) => r.length !== b.columns.length)) errors.push(`${b.id}: each row must match the column count`);
  }
  for (const v of d.views) {
    v.nodeIds.forEach((r) => check(r, nodes, v.id));
    v.edgeIds.forEach((r) => check(r, edges, v.id));
    if (new Set(v.nodeIds).size !== v.nodeIds.length || new Set(v.edgeIds).size !== v.edgeIds.length) errors.push(`${v.id}: duplicate view membership`);
    for (const key of Object.keys(v.positions)) if (!v.nodeIds.includes(key)) errors.push(`${v.id}: position for non-member ${key}`);
    for (const f2 of v.design?.focal ?? []) if (!v.nodeIds.includes(f2)) errors.push(`${v.id}: focal component ${f2} is not in this view`);
    for (const e of d.edges.filter((e2) => v.edgeIds.includes(e2.id))) if (!v.nodeIds.includes(e.source) || !v.nodeIds.includes(e.target)) errors.push(`${v.id}: edge ${e.id} has an endpoint outside this view`);
  }
  d.observations.forEach((o, i) => {
    check(o.nodeId, nodes, o.id);
    o.blockIds.forEach((r) => check(r, blocks, o.id));
    for (const f2 of secretFindings(o, `observations[${i}]`)) errors.push(`Refused ${f2}. Remove credentials and .env values; reference them by name only.`);
    for (const b of d.blocks.filter((b2) => o.blockIds.includes(b2.id) && b2.provenance === "synthetic")) errors.push(`${o.id}: synthetic block ${b.id} cannot back an observation; synthetic figures are never measured results`);
    if (o.shareable && !(o.reviewedAt && o.visibility === "public")) errors.push(`${o.id}: only a reviewed, public observation can be marked shareable`);
  });
  if (d.portfolio) for (const f2 of secretFindings(d.portfolio, "portfolio")) errors.push(`Refused ${f2}`);
  if (d.atlas) {
    const snaps = ids2(d.atlas.snapshots, "snapshot");
    check(d.atlas.activeSnapshotId, snaps, "atlas");
    for (const s of d.atlas.snapshots) {
      ids2(s.repositories, `repository in ${s.id}`);
      for (const r of s.repositories) {
        if (r.nodeId) check(r.nodeId, nodes, `${s.id}/${r.id}`);
        if (r.scanStatus === "scanned" && !r.scannedAt) errors.push(`${s.id}/${r.id}: a scanned repository records when it was scanned`);
      }
      for (const f2 of secretFindings(s, `atlas.${s.id}`)) errors.push(`Refused ${f2}`);
    }
  }
  for (const s of d.story) {
    check(s.viewId, views, "story");
    for (const r of s.observationIds ?? []) {
      const o = d.observations.find((o2) => o2.id === r);
      if (!o) check(r, observations, "story");
      else if (!o.reviewedAt) errors.push(`Story cites observation ${r} before it is reviewed`);
      else if (!d.views.find((v) => v.id === s.viewId)?.nodeIds.includes(o.nodeId)) errors.push(`Story observation ${r} is about a component outside ${s.viewId}`);
    }
    if (s.nodeId && !d.views.find((v) => v.id === s.viewId)?.nodeIds.includes(s.nodeId)) errors.push(`Story node ${s.nodeId} not in ${s.viewId}`);
    s.highlightEdgeIds.forEach((r) => {
      if (!d.views.find((v) => v.id === s.viewId)?.edgeIds.includes(r)) errors.push(`Story edge ${r} not in ${s.viewId}`);
    });
  }
  const done = /* @__PURE__ */ new Set(), visiting = /* @__PURE__ */ new Set();
  function visit(viewId) {
    if (visiting.has(viewId)) {
      errors.push(`Recursive drilldown cycle at ${viewId}`);
      return;
    }
    if (done.has(viewId)) return;
    visiting.add(viewId);
    const v = d.views.find((v2) => v2.id === viewId);
    for (const n of d.nodes.filter((n2) => v?.nodeIds.includes(n2.id))) if (n.childViewId) visit(n.childViewId);
    visiting.delete(viewId);
    done.add(viewId);
  }
  d.views.forEach((v) => visit(v.id));
  if (errors.length) throw new Error(errors.slice(0, 20).join("\n"));
  return d;
}
function clone(value2) {
  return structuredClone(value2);
}

// ../../src/core/operations.ts
function positionFor(view, nodeId) {
  const i = Math.max(0, view.nodeIds.indexOf(nodeId));
  return view.positions[nodeId] ?? { x: i % 3 * 290, y: Math.floor(i / 3) * 170 };
}
function publicDocument(input) {
  const d = clone(input);
  delete d.privateNotes;
  delete d.portfolio;
  if (d.experience) {
    try {
      d.experience = publicPack(d.experience);
    } catch {
      delete d.experience;
    }
  }
  for (const node of d.nodes) if (node.experienceWorkspaceId && !d.experience?.workspaces.some((w) => w.id === node.experienceWorkspaceId)) delete node.experienceWorkspaceId;
  const publicViews = new Set(d.views.filter((v) => v.visibility === "public").map((v) => v.id)), keptViews = /* @__PURE__ */ new Set(), keptNodes = /* @__PURE__ */ new Set();
  function walk(viewId) {
    if (keptViews.has(viewId) || !publicViews.has(viewId)) return;
    keptViews.add(viewId);
    const v = d.views.find((v2) => v2.id === viewId);
    for (const n of d.nodes.filter((n2) => n2.visibility === "public" && v.nodeIds.includes(n2.id))) {
      keptNodes.add(n.id);
      if (n.childViewId) walk(n.childViewId);
    }
  }
  walk(d.rootViewId);
  d.nodes = d.nodes.filter((n) => keptNodes.has(n.id));
  for (const n of d.nodes) if (n.childViewId && !keptViews.has(n.childViewId)) delete n.childViewId;
  d.views = d.views.filter((v) => keptViews.has(v.id));
  const membership = new Set(d.views.flatMap((v) => v.edgeIds));
  d.edges = d.edges.filter((e) => e.visibility === "public" && keptNodes.has(e.source) && keptNodes.has(e.target) && membership.has(e.id));
  const edges = new Set(d.edges.map((e) => e.id));
  for (const v of d.views) {
    v.nodeIds = v.nodeIds.filter((id4) => keptNodes.has(id4));
    v.edgeIds = v.edgeIds.filter((id4) => edges.has(id4));
    v.positions = Object.fromEntries(Object.entries(v.positions).filter(([id4]) => v.nodeIds.includes(id4)));
    if (v.design) v.design = { ...v.design, focal: v.design.focal.filter((id4) => v.nodeIds.includes(id4)) };
  }
  const blockRefs = new Set(d.nodes.flatMap((n) => n.blockIds)), publicAssets = new Set(d.assets.filter((a) => a.visibility === "public").map((a) => a.id));
  d.blocks = d.blocks.filter((b) => b.visibility === "public" && blockRefs.has(b.id) && (b.type !== "image" || publicAssets.has(b.assetId)));
  const blocks = new Set(d.blocks.map((b) => b.id));
  d.nodes.forEach((n) => n.blockIds = n.blockIds.filter((id4) => blocks.has(id4)));
  const assetRefs = new Set(d.blocks.flatMap((b) => b.type === "image" ? [b.assetId] : []));
  d.assets = d.assets.filter((a) => assetRefs.has(a.id));
  d.assets.forEach((asset) => {
    delete asset.remote;
  });
  const sourceRefs = /* @__PURE__ */ new Set([...d.nodes.flatMap((n) => n.sourceIds), ...d.blocks.flatMap((b) => b.sourceIds)]);
  d.sources = d.sources.filter((s) => s.visibility === "public" && sourceRefs.has(s.id));
  const sources = new Set(d.sources.map((s) => s.id));
  [...d.nodes, ...d.blocks].forEach((item) => item.sourceIds = item.sourceIds.filter((id4) => sources.has(id4)));
  d.observations = d.observations.filter((o) => o.visibility === "public" && !!o.reviewedAt && keptNodes.has(o.nodeId)).map((o) => ({ ...o, blockIds: o.blockIds.filter((id4) => blocks.has(id4)) }));
  const observations = new Set(d.observations.map((o) => o.id));
  if (d.atlas) {
    const active = d.atlas.snapshots.find((s) => s.id === d.atlas.activeSnapshotId);
    const repositories = active.repositories.filter((r) => r.nodeId ? keptNodes.has(r.nodeId) : r.visibility === "public");
    if (repositories.length) d.atlas = { snapshots: [{ ...active, repositories, runtimeRefs: [], contextRefs: [] }], activeSnapshotId: active.id };
    else delete d.atlas;
  }
  d.story = d.story.filter((s) => keptViews.has(s.viewId) && (!s.nodeId || keptNodes.has(s.nodeId))).map((s) => ({ ...s, highlightEdgeIds: s.highlightEdgeIds.filter((id4) => edges.has(id4)), ...s.observationIds ? { observationIds: s.observationIds.filter((id4) => observations.has(id4)) } : {} }));
  return validateDocument(d);
}

// ../../src/core/patch.ts
var PATCH_FORMAT = "diagramcloud.patch";
var MAX_PATCH_OPS = 500;
var pointer = external_exports.string().max(512).regex(/^(\/[^/]*)+$/, "Paths are JSON Pointers such as /nodes/@checks/label (the whole document cannot be replaced by a patch)");
var operationSchema = external_exports.discriminatedUnion("op", [
  external_exports.object({ op: external_exports.literal("add"), path: pointer, value: external_exports.unknown() }).strict(),
  external_exports.object({ op: external_exports.literal("remove"), path: pointer }).strict(),
  external_exports.object({ op: external_exports.literal("replace"), path: pointer, value: external_exports.unknown() }).strict(),
  external_exports.object({ op: external_exports.literal("move"), from: pointer, path: pointer }).strict(),
  external_exports.object({ op: external_exports.literal("copy"), from: pointer, path: pointer }).strict(),
  external_exports.object({ op: external_exports.literal("test"), path: pointer, value: external_exports.unknown() }).strict()
]);
var patchSchema = external_exports.object({
  format: external_exports.literal(PATCH_FORMAT),
  version: external_exports.literal(1),
  target: external_exports.enum(["project", "experience"]),
  targetId: external_exports.string().min(1).max(120),
  baseRevision: external_exports.number().int().nonnegative(),
  summary: external_exports.string().max(500).default(""),
  operations: external_exports.array(operationSchema).min(1).max(MAX_PATCH_OPS)
}).strict();

// ../../src/core/realization.ts
var MEANING = {
  designed: { label: "Planned / designed", help: "Architecture intent. The status colour is an illustrative design state, not a deployment or business result." },
  observed: { label: "Observed / verified", help: "A dated snapshot from another app at a named revision. It states what that source saw then, nothing more." },
  presented: { label: "Presented", help: "Reviewed by the author and selected for the story or public portfolio. Presenting does not change who owns the fact." }
};
var CLAIM_LABEL = { observed: "Observed", verified: "Verified", partial: "Partly observed", "not-observed": "Not observed" };
var day = (iso) => iso.slice(0, 10);
var isPresented = (o) => o.visibility === "public" && !!o.reviewedAt;
function observationsFor(doc, nodeId) {
  return doc.observations.filter((o) => o.nodeId === nodeId).sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt));
}
function realizationOf(doc, nodeId) {
  const list = observationsFor(doc, nodeId), latest = list[0], presented = list.some(isPresented);
  if (!latest) return { state: "designed", count: 0, presented: false, text: "Designed", title: `${MEANING.designed.label}: ${MEANING.designed.help}` };
  return {
    state: latest.claim,
    latest,
    count: list.length,
    presented,
    text: `${CLAIM_LABEL[latest.claim]} \xB7 ${day(latest.observedAt)}`,
    title: `${CLAIM_LABEL[latest.claim]} by ${latest.sourceApp} (authority: ${latest.authority}) at revision ${latest.sourceRevision}, ${latest.observedAt}.${latest.reviewedAt ? "" : " Not reviewed yet."}${latest.caveat ? ` Caveat: ${latest.caveat}` : ""}`
  };
}
var CLAIM_BADGE = {
  observed: { text: "Observed", fill: "E8F0FE", stroke: "2563EB", ink: "1D4ED8" },
  verified: { text: "Verified", fill: "E0E7FF", stroke: "3730A3", ink: "312E81" },
  partial: { text: "Partial", fill: "FEF3C7", stroke: "B45309", ink: "92400E" },
  "not-observed": { text: "Not observed", fill: "F1F5F9", stroke: "64748B", ink: "475569" }
};
function presentedObservation(doc, nodeId) {
  return observationsFor(doc, nodeId).find(isPresented);
}

// ../../src/core/viewspec.ts
var CONFIDENCES = ["confirmed", "inferred", "possible"];
var perspectiveOf = (v) => v.perspective ?? "system";
function pathTo(doc, viewId) {
  const parent = /* @__PURE__ */ new Map(), queue = [doc.rootViewId], seen = new Set(queue);
  while (queue.length) {
    const id4 = queue.shift(), v = doc.views.find((v2) => v2.id === id4);
    if (!v) continue;
    for (const n of doc.nodes) if (v.nodeIds.includes(n.id) && n.childViewId && !seen.has(n.childViewId)) {
      seen.add(n.childViewId);
      parent.set(n.childViewId, { viewId: id4, nodeId: n.id });
      queue.push(n.childViewId);
    }
  }
  if (!seen.has(viewId)) return [];
  const out = [];
  let cur = viewId;
  while (cur) {
    const p = parent.get(cur);
    out.unshift({ viewId: cur, title: doc.views.find((v) => v.id === cur)?.title ?? cur, ...p ? { via: p.nodeId } : {} });
    cur = p?.viewId;
  }
  return out;
}
function repositoryOf(doc, id4) {
  const snap = doc.atlas?.snapshots.find((s) => s.id === doc.atlas.activeSnapshotId);
  return snap?.repositories.find((r) => id4.startsWith(`${r.id}.`) || r.nodeId === id4);
}
function viewSpec(input, viewId, options = {}) {
  const audience = options.audience ?? "public", doc = audience === "public" ? publicDocument(input) : input;
  const view = doc.views.find((v) => v.id === viewId);
  if (!view) throw new Error(audience === "public" && input.views.some((v) => v.id === viewId) ? `View ${viewId} is not public.` : `Unknown view ${viewId}.`);
  const nodes = doc.nodes.filter((n) => view.nodeIds.includes(n.id)), ids2 = new Set(nodes.map((n) => n.id));
  const edges = doc.edges.filter((e) => view.edgeIds.includes(e.id) && ids2.has(e.source) && ids2.has(e.target));
  const confidence = (tags) => tags.find((t) => CONFIDENCES.includes(t));
  const edgeConfidence = (label2) => /\(inferred\)$/.test(label2) ? "inferred" : /\(possible\)$/.test(label2) ? "possible" : void 0;
  const groupOf = (id4) => repositoryOf(doc, id4)?.id;
  const specNodes = nodes.map((n) => {
    const obs = presentedObservation(doc, n.id), conf = confidence(n.tags), g = groupOf(n.id);
    return {
      id: n.id,
      label: n.label,
      kind: n.kind,
      provider: n.provider,
      summary: n.summary,
      basis: n.basis ?? "unspecified",
      ...conf ? { confidence: conf } : {},
      designStatus: n.status,
      ...n.childViewId ? { opens: n.childViewId } : {},
      evidenceRefs: n.blockIds,
      sourceRefs: n.sourceIds,
      ...obs ? { observation: { claim: CLAIM_LABEL[obs.claim], sourceApp: obs.sourceApp, observedAt: obs.observedAt, sourceRevision: obs.sourceRevision } } : {},
      position: view.positions[n.id] ?? { x: 0, y: 0 },
      ...g ? { group: g } : {}
    };
  });
  const specEdges = edges.map((e) => {
    const c = edgeConfidence(e.label);
    return { id: e.id, from: e.source, to: e.target, label: e.label, kind: e.kind, basis: e.basis ?? "unspecified", ...c ? { confidence: c } : {}, ...e.quantity ? { quantity: { ...e.quantity } } : {} };
  });
  const groups = [...new Set(specNodes.map((n) => n.group).filter((g) => !!g))].map((g) => ({ id: g, title: repositoryOf(doc, `${g}.x`)?.title ?? g, members: specNodes.filter((n) => n.group === g).map((n) => n.id) }));
  const omissions = [];
  if (audience === "public") {
    const full = input.views.find((v) => v.id === viewId);
    if (full) {
      const hidden = full.nodeIds.length - view.nodeIds.length, hiddenEdges = full.edgeIds.length - view.edgeIds.length;
      if (hidden > 0) omissions.push(`${hidden} private or unreachable component(s) removed.`);
      if (hiddenEdges > 0) omissions.push(`${hiddenEdges} private connection(s) removed.`);
    }
  }
  if (specNodes.some((n) => n.basis === "unknown")) omissions.push("Some components are declared but nothing was read for them (basis unknown).");
  const snap = doc.atlas?.snapshots.find((s) => s.id === doc.atlas.activeSnapshotId);
  const uniq = (xs) => [...new Set(xs.filter((x) => !!x))].sort();
  return {
    format: "diagramcloud.viewspec",
    version: 1,
    projectId: doc.id,
    projectRevision: doc.revision,
    projectTitle: doc.title,
    viewId,
    title: view.title,
    purpose: view.description,
    audience,
    perspective: perspectiveOf(view),
    path: pathTo(doc, viewId),
    children: specNodes.filter((n) => n.opens).map((n) => ({ nodeId: n.id, viewId: n.opens, title: doc.views.find((v) => v.id === n.opens)?.title ?? n.opens })),
    ...snap ? { snapshot: { id: snap.id, capturedAt: snap.capturedAt, repositories: snap.repositories.map((r) => ({ id: r.id, title: r.title, ...r.revision ? { revision: r.revision } : {}, ...r.ref ? { ref: r.ref } : {}, scanStatus: r.scanStatus })) } } : {},
    nodes: specNodes,
    edges: specEdges,
    groups,
    legend: { kinds: uniq(specNodes.map((n) => n.kind)), edgeKinds: uniq(specEdges.map((e) => e.kind)), bases: uniq([...specNodes.map((n) => n.basis), ...specEdges.map((e) => e.basis)]), confidences: uniq([...specNodes.map((n) => n.confidence), ...specEdges.map((e) => e.confidence)]) },
    omissions,
    publication: { policy: audience === "public" ? "publicDocument" : "authoring", generatedAt: (options.now ?? /* @__PURE__ */ new Date()).toISOString() }
  };
}
var PERSPECTIVE_LABEL = { system: "System", code: "Code", data: "Data", cloud: "Cloud", git: "Git", cicd: "CI/CD", agents: "Agents", decisions: "Decisions", evidence: "Evidence" };

// ../../src/core/layout.ts
var LAYOUT_NODE_WIDTH = 220;
var LAYOUT_NODE_HEIGHT = 160;
var LAYOUT_COLUMN = LAYOUT_NODE_WIDTH + 120;
var LAYOUT_ROW = 180;
var LAYOUT_BAND_GAP = 70;
var LAYOUT_MAX_COLUMNS = 6;
var LAYOUT_WRAP_GAP = 120;
function flowRanks(nodes, edges) {
  const order = [...nodes].sort((a, b) => a.position.x - b.position.x || a.position.y - b.position.y || a.id.localeCompare(b.id)), ids2 = new Set(order.map((n) => n.id));
  const inner = edges.filter((e) => ids2.has(e.from) && ids2.has(e.to) && e.from !== e.to), indeg = new Map(order.map((n) => [n.id, 0])), rank = /* @__PURE__ */ new Map(), done = /* @__PURE__ */ new Set();
  for (const e of inner) indeg.set(e.to, indeg.get(e.to) + 1);
  while (done.size < order.length) {
    let next = order.find((n) => !done.has(n.id) && indeg.get(n.id) === 0);
    if (!next) next = order.filter((n) => !done.has(n.id)).sort((a, b) => indeg.get(a.id) - indeg.get(b.id))[0];
    done.add(next.id);
    rank.set(next.id, Math.max(0, ...inner.filter((e) => e.to === next.id && done.has(e.from) && e.from !== next.id).map((e) => (rank.get(e.from) ?? 0) + 1)));
    for (const e of inner) if (e.from === next.id && !done.has(e.to)) indeg.set(e.to, indeg.get(e.to) - 1);
  }
  return rank;
}
var cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
function layeredLayout(doc, viewId, options = {}) {
  const maxColumns = options.maxColumns ?? LAYOUT_MAX_COLUMNS;
  if (!(maxColumns >= 1)) throw new Error("maxColumns must be at least 1.");
  const view = doc.views.find((v) => v.id === viewId);
  if (!view) throw new Error(`Unknown view ${viewId}.`);
  const known = new Set(doc.nodes.map((n) => n.id)), ids2 = view.nodeIds.filter((id4) => known.has(id4)), inView = new Set(ids2), index = new Map(ids2.map((id4, i) => [id4, i]));
  const edges = doc.edges.filter((e) => view.edgeIds.includes(e.id) && inView.has(e.source) && inView.has(e.target) && e.source !== e.target).map((e) => ({ from: e.source, to: e.target }));
  const linked = new Set(edges.flatMap((e) => [e.from, e.to])), main = ids2.filter((id4) => linked.has(id4)), loose = ids2.filter((id4) => !linked.has(id4));
  const group = new Map(ids2.map((id4) => [id4, repositoryOf(doc, id4)?.id ?? ""]));
  const ranks = flowRanks(main.map((id4) => ({ id: id4, position: { x: index.get(id4), y: 0 } })), edges);
  const depth = main.length ? Math.max(...main.map((id4) => ranks.get(id4))) + 1 : 0;
  const columns = Array.from({ length: depth }, () => []);
  for (const id4 of main) columns[ranks.get(id4)].push(id4);
  const neighbours = new Map(main.map((id4) => [id4, []]));
  for (const e of edges) {
    neighbours.get(e.from).push(e.to);
    neighbours.get(e.to).push(e.from);
  }
  const slot = /* @__PURE__ */ new Map();
  const place = (col) => col.forEach((id4, i) => slot.set(id4, i - (col.length - 1) / 2));
  const arrange = (col, key) => {
    const bc = new Map(col.map((id4) => [id4, key(id4)])), blocks = /* @__PURE__ */ new Map();
    for (const id4 of col) {
      const k = group.get(id4) ? `g:${group.get(id4)}` : `n:${id4}`;
      if (!blocks.has(k)) blocks.set(k, []);
      blocks.get(k).push(id4);
    }
    const mean = (b) => b.reduce((s, id4) => s + bc.get(id4), 0) / b.length;
    return [...blocks.entries()].sort((a, b) => mean(a[1]) - mean(b[1]) || cmp(a[0], b[0])).flatMap(([, b]) => b.sort((x, y) => bc.get(x) - bc.get(y) || cmp(x, y)));
  };
  columns.forEach((col, r) => {
    columns[r] = arrange(col, (id4) => index.get(id4));
    place(columns[r]);
  });
  const barycentre = (id4, side) => {
    const ns = neighbours.get(id4).filter(side);
    return ns.length ? ns.reduce((s, n) => s + slot.get(n), 0) / ns.length : slot.get(id4);
  };
  for (let pass = 0; pass < 4; pass++) {
    const forward = pass % 2 === 0, order = forward ? columns.map((_, r) => r) : columns.map((_, r) => columns.length - 1 - r);
    for (const r of order) {
      const side = (n) => forward ? ranks.get(n) < r : ranks.get(n) > r;
      columns[r] = arrange(columns[r], (id4) => barycentre(id4, side));
      place(columns[r]);
    }
  }
  const flow = (width) => {
    const out2 = {}, bands = depth <= width ? Math.min(depth, 1) : Math.ceil(depth / width);
    let top = 0;
    for (let b = 0; b < bands; b++) {
      const cols = columns.slice(b * width, (b + 1) * width), tallest = Math.max(0, ...cols.map((c) => c.length));
      cols.forEach((col, k) => col.forEach((id4, i) => {
        out2[id4] = { x: k * LAYOUT_COLUMN, y: top + Math.round((i + (tallest - col.length) / 2) * LAYOUT_ROW) };
      }));
      top += tallest * LAYOUT_ROW + (b < bands - 1 ? LAYOUT_WRAP_GAP : 0);
    }
    return { out: out2, height: top, width: Math.min(depth, width) };
  };
  let placed = flow(Infinity);
  if (depth > maxColumns) {
    const wrapped = flow(maxColumns);
    if (layoutCrossings(edges, wrapped.out) <= layoutCrossings(edges, placed.out)) placed = wrapped;
  }
  const out = placed.out;
  if (loose.length) {
    const sorted = [...loose].sort((a, b) => cmp(group.get(a), group.get(b)) || index.get(a) - index.get(b));
    const perRow = Math.max(placed.width, Math.ceil(Math.sqrt(sorted.length)), 3), top = placed.height ? placed.height + LAYOUT_BAND_GAP : 0;
    sorted.forEach((id4, i) => {
      out[id4] = { x: i % perRow * LAYOUT_COLUMN, y: top + Math.floor(i / perRow) * LAYOUT_ROW };
    });
  }
  return out;
}
function layoutCrossings(edges, positions) {
  const c = (id4) => ({ x: positions[id4].x + LAYOUT_NODE_WIDTH / 2, y: positions[id4].y + LAYOUT_NODE_HEIGHT / 2 });
  const seg = edges.filter((e) => positions[e.from] && positions[e.to] && e.from !== e.to).map((e) => ({ a: c(e.from), b: c(e.to), from: e.from, to: e.to }));
  const o = (a, b, q) => Math.sign((b.x - a.x) * (q.y - a.y) - (b.y - a.y) * (q.x - a.x));
  let n = 0;
  for (let i = 0; i < seg.length; i++) for (let j = i + 1; j < seg.length; j++) {
    const s = seg[i], t = seg[j];
    if ((/* @__PURE__ */ new Set([s.from, s.to, t.from, t.to])).size < 4) continue;
    if (o(s.a, s.b, t.a) * o(s.a, s.b, t.b) < 0 && o(t.a, t.b, s.a) * o(t.a, t.b, s.b) < 0) n++;
  }
  return n;
}

// ../../src/core/icons.ts
function fabricIcon(id4, upstream, label2, represents, blob) {
  const path = `node_modules/@fabric-msft/svg-icons/svg/${upstream}_48_item.svg`;
  return {
    id: id4,
    label: label2,
    origin: "vendor",
    alt: `${label2} icon`,
    file: `icons/${id4}.svg`,
    vendor: "Microsoft",
    represents,
    source: {
      repository: "FabricTools/fabric-icons",
      path,
      commit: "e206270f367dc440b5bf6bc94f0f6267b922d596",
      blob,
      packageName: "@fabric-msft/svg-icons",
      packageVersion: "8.2.0",
      url: `https://github.com/FabricTools/fabric-icons/blob/e206270f367dc440b5bf6bc94f0f6267b922d596/${path}`
    },
    terms: { name: "Microsoft Fabric icons usage terms", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/icons" },
    rules: [`Use only to represent ${represents}, labelled as such.`, "Do not crop, flip, rotate, recolour or distort the artwork.", "Do not use it as a logo for DiagramCloud or any other product.", "Not covered by the DiagramCloud MIT licence, nor by the source repository's licence."]
  };
}
var ICON_REGISTRY = [
  {
    id: "generic",
    label: "Generic component symbol",
    origin: "original",
    alt: "",
    rules: ["Original DiagramCloud line symbols chosen by component kind. Not a vendor logo."]
  },
  {
    id: "fabric-lakehouse",
    label: "Microsoft Fabric Lakehouse",
    origin: "vendor",
    alt: "Microsoft Fabric Lakehouse icon",
    file: "icons/fabric-lakehouse.svg",
    vendor: "Microsoft",
    represents: "a Microsoft Fabric Lakehouse item",
    source: {
      repository: "FabricTools/fabric-icons",
      path: "node_modules/@fabric-msft/svg-icons/svg/lakehouse_48_item.svg",
      commit: "e206270f367dc440b5bf6bc94f0f6267b922d596",
      blob: "a06e893bb2ecafcc6a563a607e7b4c2064b7a7d9",
      packageName: "@fabric-msft/svg-icons",
      packageVersion: "8.2.0",
      url: "https://github.com/FabricTools/fabric-icons/blob/e206270f367dc440b5bf6bc94f0f6267b922d596/node_modules/@fabric-msft/svg-icons/svg/lakehouse_48_item.svg"
    },
    terms: { name: "Microsoft Fabric icons usage terms", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/icons" },
    rules: ["Use only to represent the Microsoft Fabric Lakehouse item it depicts, labelled as such.", "Do not crop, flip, rotate, recolour or distort the artwork.", "Do not use it as a logo for DiagramCloud or any other product.", "Not covered by the DiagramCloud MIT licence, nor by the source repository's licence."]
  },
  {
    id: "fabric-pipeline",
    label: "Microsoft Fabric Pipeline",
    origin: "vendor",
    alt: "Microsoft Fabric Pipeline icon",
    file: "icons/fabric-pipeline.svg",
    vendor: "Microsoft",
    represents: "a Microsoft Fabric Data Factory pipeline item",
    source: {
      repository: "FabricTools/fabric-icons",
      path: "node_modules/@fabric-msft/svg-icons/svg/pipeline_48_item.svg",
      commit: "e206270f367dc440b5bf6bc94f0f6267b922d596",
      blob: "fb8b9c4db4b97a4346f56c6fb7ed1228550419db",
      packageName: "@fabric-msft/svg-icons",
      packageVersion: "8.2.0",
      url: "https://github.com/FabricTools/fabric-icons/blob/e206270f367dc440b5bf6bc94f0f6267b922d596/node_modules/@fabric-msft/svg-icons/svg/pipeline_48_item.svg"
    },
    terms: { name: "Microsoft Fabric icons usage terms", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/icons" },
    rules: ["Use only to represent the Microsoft Fabric pipeline item it depicts, labelled as such.", "Do not crop, flip, rotate, recolour or distort the artwork.", "Do not use it as a logo for DiagramCloud or any other product.", "Not covered by the DiagramCloud MIT licence, nor by the source repository's licence."]
  },
  fabricIcon("fabric-data-warehouse", "data_warehouse", "Microsoft Fabric Warehouse", "a Microsoft Fabric Warehouse item", "624222e8fad1dfb1285aab130884645895d22aad"),
  fabricIcon("fabric-notebook", "notebook", "Microsoft Fabric Notebook", "a Microsoft Fabric Notebook item", "f329876b4e02ccabd1b2cdc01d26102f008c47c0"),
  fabricIcon("fabric-semantic-model", "semantic_model", "Microsoft Fabric Semantic model", "a Microsoft Fabric / Power BI semantic model item", "8fe5fc93fe7d6f536629b5e5ba0d5f314a7bc516"),
  fabricIcon("fabric-sql-database", "sql_database", "Microsoft Fabric SQL database", "a Microsoft Fabric SQL database item", "04e1ead5f1239138b4c19dcb89423597012afb3a"),
  fabricIcon("fabric-eventstream", "eventstream", "Microsoft Fabric Eventstream", "a Microsoft Fabric Real-Time Intelligence Eventstream item", "bfe104a0ec081b3c3f7db5bbab56959d18632905"),
  fabricIcon("fabric-kql-database", "kql_database", "Microsoft Fabric KQL database", "a Microsoft Fabric Real-Time Intelligence KQL database item (inside an Eventhouse)", "894da8130df7afc8f5fa977be04721ae1945a3cd")
];
var BY_ID = new Map(ICON_REGISTRY.map((e) => [e.id, e]));
var GENERIC_ICON = BY_ID.get("generic");
function iconFor(id4) {
  return id4 && BY_ID.get(id4) || GENERIC_ICON;
}

// ../../src/export/measure.ts
var REGULAR = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584];
var BOLD = [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584];
var SPECIAL = { "\u2026": 1e3, "\u2014": 1e3, "\u2013": 556, "\u2192": 1e3, "\u2190": 1e3, "\u21B3": 1e3, "\xB7": 278, "\u2022": 350, "\u201C": 333, "\u201D": 333, "\u2018": 222, "\u2019": 222, "\u20AC": 556, "\xA3": 556, "\xB0": 400, "\xD7": 584, "\xB1": 584, "\xB5": 556, "\xE9": 556, "\xE8": 556, "\xE0": 556, "\xE7": 500, "\xFC": 556, "\xF6": 556, "\xE4": 556, "\xF1": 556 };
function advance(ch, bold) {
  const c = ch.codePointAt(0);
  if (c >= 32 && c <= 126) return (bold ? BOLD : REGULAR)[c - 32];
  if (SPECIAL[ch] !== void 0) return SPECIAL[ch];
  if (c >= 11904) return 1e3;
  return bold ? 611 : 556;
}
function textWidth(text3, size, bold = false) {
  let units = 0;
  for (const ch of text3) units += advance(ch, bold);
  return units * size / 1e3;
}
function measureLines(text3, width, style, maxLines = Infinity) {
  const fits = (s) => textWidth(s, style.size, style.bold) <= width;
  const words = text3.replace(/\s+/g, " ").trim().split(" ").filter(Boolean), lines2 = [];
  let line = "";
  const push = (l) => {
    lines2.push(l);
  };
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (fits(candidate)) {
      line = candidate;
      continue;
    }
    if (line) push(line);
    if (fits(word)) {
      line = word;
      continue;
    }
    let part = "";
    for (const piece of word.split(/(?<=[/-])/)) {
      if (fits(part + piece)) {
        part += piece;
        continue;
      }
      if (part) push(part);
      if (fits(piece)) {
        part = piece;
        continue;
      }
      part = "";
      for (const ch of piece) {
        if (fits(part + ch)) part += ch;
        else {
          push(part);
          part = ch;
        }
      }
    }
    line = part;
  }
  if (line) push(line);
  if (lines2.length <= maxLines) return { lines: lines2, truncated: false };
  const kept = lines2.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last && !fits(`${last}\u2026`)) last = last.slice(0, -1);
  kept[maxLines - 1] = `${last.trimEnd()}\u2026`;
  return { lines: kept, truncated: true };
}

// ../../src/export/scene.ts
var NODE_WIDTH = 220;
var NODE_HEIGHT = 100;
var ROUTE_CLEARANCE = 38;
var wOf = (p) => p.w ?? NODE_WIDTH;
var hOf = (p) => p.h ?? NODE_HEIGHT;
function sceneBounds(points, padding = 30) {
  const x = Math.min(0, ...points.map((p) => p.x)) - padding;
  const y = Math.min(0, ...points.map((p) => p.y)) - padding;
  return {
    x,
    y,
    width: Math.max(300, ...points.map((p) => p.x + NODE_WIDTH)) - x + padding,
    height: Math.max(150, ...points.map((p) => p.y + NODE_HEIGHT)) - y + padding
  };
}
function orthogonalRoute(source, target, clearance = ROUTE_CLEARANCE) {
  const sw = wOf(source), sh = hOf(source), tw = wOf(target), th = hOf(target);
  const s = { left: source.x, right: source.x + sw, top: source.y, bottom: source.y + sh, cx: source.x + sw / 2, cy: source.y + sh / 2 };
  const t = { left: target.x, right: target.x + tw, top: target.y, bottom: target.y + th, cx: target.x + tw / 2, cy: target.y + th / 2 };
  if (t.left >= s.right + clearance / 2) {
    const mid = (s.right + t.left) / 2;
    return [{ x: s.right, y: s.cy }, { x: mid, y: s.cy }, { x: mid, y: t.cy }, { x: t.left, y: t.cy }];
  }
  if (s.left >= t.right + clearance / 2) {
    const mid = (t.right + s.left) / 2;
    return [{ x: s.left, y: s.cy }, { x: mid, y: s.cy }, { x: mid, y: t.cy }, { x: t.right, y: t.cy }];
  }
  if (t.top >= s.bottom + clearance / 2) {
    const mid = (s.bottom + t.top) / 2;
    return [{ x: s.cx, y: s.bottom }, { x: s.cx, y: mid }, { x: t.cx, y: mid }, { x: t.cx, y: t.top }];
  }
  if (s.top >= t.bottom + clearance / 2) {
    const mid = (t.bottom + s.top) / 2;
    return [{ x: s.cx, y: s.top }, { x: s.cx, y: mid }, { x: t.cx, y: mid }, { x: t.cx, y: t.bottom }];
  }
  const lane = Math.max(s.bottom, t.bottom) + clearance;
  return [{ x: s.cx, y: s.bottom }, { x: s.cx, y: lane }, { x: t.cx, y: lane }, { x: t.cx, y: t.bottom }];
}
function routeLabel(points) {
  let best = { length: -1, point: points[0] ?? { x: 0, y: 0 } };
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], length = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    if (length > best.length) best = { length, point: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
  }
  return best.point;
}
var NODE_PAD = 16;
var ICON_SIZE = 22;
var EDGE_LABEL_WIDTH = 150;
var BADGE_SIZE = 9;
var INK = "16263d";
var MUTED = "52647a";
var LINK = "2563eb";
var EDGE = "45556d";
function text2(value2, x, y, width, size, lineHeight, color, maxLines, bold = false, anchor = "start") {
  const m = measureLines(value2, width, { size, bold }, maxLines);
  return { lines: m.lines, x, y, size, lineHeight, bold, color, width, anchor, truncated: m.truncated };
}
function buildScene(d, view) {
  const nodes = d.nodes.filter((n) => view.nodeIds.includes(n.id)).map((n) => {
    const p = positionFor(view, n.id), x = p.x, y = p.y, w = NODE_WIDTH, h = NODE_HEIGHT, inner = w - 2 * NODE_PAD, entry = iconFor(n.icon);
    const icon = entry.origin === "vendor" ? { entry, x: x + w - NODE_PAD - ICON_SIZE + 6, y: y + 10, size: ICON_SIZE } : void 0;
    const provider = text2(n.provider.toUpperCase(), x + NODE_PAD, y + 22, inner - (icon ? ICON_SIZE + 4 : 0), 10, 12.5, MUTED, 1);
    const label2 = text2(n.label, x + NODE_PAD, y + 44, inner, 14, 17, INK, 2, true);
    const summaryTop = label2.y + label2.lineHeight * (label2.lines.length - 1) + 16;
    const summary = text2(n.summary, x + NODE_PAD, summaryTop, inner, 10, 12.5, MUTED, label2.lines.length > 1 ? 1 : 2);
    const obs = presentedObservation(d, n.id), style = obs ? CLAIM_BADGE[obs.claim] : void 0, bw = style ? Math.ceil(textWidth(style.text, BADGE_SIZE, true)) + 10 : 0;
    const realization = obs && style ? {
      claim: obs.claim,
      x: x + w - NODE_PAD - bw,
      y: y + h - 11 - BADGE_SIZE - 1,
      w: bw,
      h: BADGE_SIZE + 5,
      fill: style.fill,
      stroke: style.stroke,
      text: text2(style.text, x + w - NODE_PAD - bw + 5, y + h - 11, bw, BADGE_SIZE, BADGE_SIZE + 2, style.ink, 1, true),
      title: realizationOf({ observations: [obs] }, n.id).title
    } : void 0;
    const footer = text2(n.childViewId ? "Open subdiagram" : n.blockIds.length ? `${n.blockIds.length} evidence block${n.blockIds.length === 1 ? "" : "s"}` : "Component", x + NODE_PAD, y + h - 11, inner - (bw ? bw + 6 : 0), 10, 12.5, LINK, 1);
    return { id: n.id, x, y, w, h, provider, label: label2, summary, footer, icon, ...realization ? { realization } : {}, ...n.childViewId ? { childViewId: n.childViewId } : {}, ...n.experienceWorkspaceId ? { experienceWorkspaceId: n.experienceWorkspaceId } : {} };
  });
  const boxes = nodes.map((n) => ({ x: n.x, y: n.y, w: n.w, h: n.h }));
  const shown = d.edges.filter((e) => view.edgeIds.includes(e.id));
  const routes = sceneRoutes(d, view).map((r) => r.points);
  const placed = [];
  const edges = shown.map((e, k) => ({ id: e.id, points: routes[k], dashed: e.kind === "control", ...e.label ? { label: clearOf(edgeLabel(e.label, routes[k], boxes), placed, boxes, routes) } : {} }));
  const vendorIcons = [...new Set(nodes.flatMap((n) => n.icon ? [n.icon.entry] : []))];
  const base2 = sceneBounds(view.nodeIds.map((id4) => positionFor(view, id4))), extra = edges.flatMap((e) => [...e.points, ...e.label ? [{ x: e.label.x, y: e.label.y - e.label.size }] : []]);
  const minX = Math.min(base2.x, ...extra.map((q) => q.x - 30)), minY = Math.min(base2.y, ...extra.map((q) => q.y - 30)), maxX = Math.max(base2.x + base2.width, ...extra.map((q) => q.x + 30)), maxY = Math.max(base2.y + base2.height, ...extra.map((q) => q.y + 30));
  return { bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY }, nodes, edges, vendorIcons };
}
function sceneRoutes(d, view, sizeOf = () => void 0) {
  const at = (id4) => {
    const p = positionFor(view, id4), z = sizeOf(id4);
    return { x: p.x, y: p.y, w: z?.w ?? NODE_WIDTH, h: z?.h ?? NODE_HEIGHT };
  };
  const boxes = d.nodes.filter((n) => view.nodeIds.includes(n.id)).map((n) => at(n.id));
  const shown = d.edges.filter((e) => view.edgeIds.includes(e.id));
  const routes = separateLanes(shown.map((e) => {
    const s = at(e.source), t = at(e.target);
    return simplifyRoute(routeAround(s, t, boxes.filter((b) => !(b.x === s.x && b.y === s.y) && !(b.x === t.x && b.y === t.y)), boxes));
  }));
  return shown.map((e, k) => ({ id: e.id, points: routes[k] }));
}
var inside = (p, b) => p.x > b.x + 1 && p.x < b.x + b.w - 1 && p.y > b.y + 1 && p.y < b.y + b.h - 1;
function edgeLabel(value2, points, boxes) {
  const runs = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], z = points[i];
    if (a.x === z.x && a.y === z.y) continue;
    const last = runs.at(-1);
    if (last && (last.a.y === last.z.y && a.y === z.y && last.z.y === a.y || last.a.x === last.z.x && a.x === z.x && last.z.x === a.x)) last.z = z;
    else runs.push({ a, z });
  }
  const segs = runs.map(({ a, z }) => ({ a, z, len: Math.abs(z.x - a.x) + Math.abs(z.y - a.y), mid: { x: (a.x + z.x) / 2, y: (a.y + z.y) / 2 } }));
  const free = segs.filter((g) => !boxes.some((b) => inside(g.mid, b))), pick = [...free.length ? free : segs].sort((p, q) => q.len - p.len)[0];
  if (!pick) {
    const at = routeLabel(points);
    return text2(value2, at.x, at.y - 8, EDGE_LABEL_WIDTH, 10, 12.5, EDGE, 1, false, "middle");
  }
  if (pick.a.y === pick.z.y) {
    const width = Math.max(24, Math.min(EDGE_LABEL_WIDTH, pick.len - 8)), t = text2(value2, pick.mid.x, 0, width, 10, 12.5, EDGE, 3, false, "middle");
    return { ...t, y: pick.mid.y - 6 - (t.lines.length - 1) * t.lineHeight };
  }
  const span = [Math.min(pick.a.y, pick.z.y) + 12, Math.max(pick.a.y, pick.z.y) - 4];
  const beside = (width, lines2) => {
    const r = { ...text2(value2, pick.mid.x + 6, pick.mid.y + 3, width, 10, 12.5, EDGE, lines2), span }, w = labelBox(r).w;
    return [r, { ...r, x: pick.mid.x - 6 - w + 2 }];
  };
  const [first, ...alts] = [...beside(EDGE_LABEL_WIDTH, 2), ...beside(56, 3)];
  return { ...first, alts };
}
function crosses(a, z, b) {
  if (a.y === z.y) return a.y > b.y && a.y < b.y + b.h && Math.max(a.x, z.x) > b.x && Math.min(a.x, z.x) < b.x + b.w;
  return a.x > b.x && a.x < b.x + b.w && Math.max(a.y, z.y) > b.y && Math.min(a.y, z.y) < b.y + b.h;
}
var crossings = (points, obstacles) => points.slice(1).reduce((n, z, i) => n + obstacles.filter((b) => crosses(points[i], z, b)).length, 0);
function routeAround(source, target, obstacles, all = obstacles) {
  const direct = orthogonalRoute(source, target);
  if (!crossings(direct, obstacles)) return direct;
  const SW = wOf(source), SH = hOf(source), TW = wOf(target), TH = hOf(target), sx = source.x + SW / 2, tx = target.x + TW / 2, sy = source.y + SH / 2, ty = target.y + TH / 2, lo = Math.min(sx, tx), hi = Math.max(sx, tx);
  const candidates = [direct];
  if (target.y >= source.y + SH) {
    const mid = (source.y + SH + target.y) / 2;
    candidates.push([{ x: sx, y: source.y + SH }, { x: sx, y: mid }, { x: tx, y: mid }, { x: tx, y: target.y }]);
  }
  if (source.y >= target.y + TH) {
    const mid = (target.y + TH + source.y) / 2;
    candidates.push([{ x: sx, y: source.y }, { x: sx, y: mid }, { x: tx, y: mid }, { x: tx, y: target.y + TH }]);
  }
  if (target.x >= source.x + SW) {
    const mid = (source.x + SW + target.x) / 2;
    candidates.push([{ x: source.x + SW, y: sy }, { x: mid, y: sy }, { x: mid, y: ty }, { x: target.x, y: ty }]);
  }
  if (source.x >= target.x + TW) {
    const mid = (target.x + TW + source.x) / 2;
    candidates.push([{ x: source.x, y: sy }, { x: mid, y: sy }, { x: mid, y: ty }, { x: target.x + TW, y: ty }]);
  }
  const inWay = obstacles.filter((b) => b.x < hi && b.x + b.w > lo);
  const top = Math.min(source.y, target.y, ...inWay.map((b) => b.y)) - ROUTE_CLEARANCE / 2, bottom = Math.max(source.y, target.y, ...inWay.map((b) => b.y + b.h)) + ROUTE_CLEARANCE / 2;
  const minY = Math.min(...all.map((b) => b.y)), maxY = Math.max(...all.map((b) => b.y + b.h)), between = (y) => y > minY && y < maxY;
  const under = [{ x: sx, y: source.y + SH }, { x: sx, y: bottom }, { x: tx, y: bottom }, { x: tx, y: target.y + TH }], over = [{ x: sx, y: source.y }, { x: sx, y: top }, { x: tx, y: top }, { x: tx, y: target.y }];
  candidates.push(...between(bottom) || !between(top) ? [under, over] : [over, under]);
  const best = candidates.map((r, k) => ({ r, k, n: crossings(r, obstacles) })).sort((p, q) => p.n - q.n || p.k - q.k)[0];
  return best.n ? channelRoute(source, target, all) ?? best.r : best.r;
}
var BEND = 100;
function channelRoute(source, target, all) {
  const c = ROUTE_CLEARANCE / 2, s = { x: source.x, y: source.y, w: wOf(source), h: hOf(source) }, t = { x: target.x, y: target.y, w: wOf(target), h: hOf(target) }, boxes = [...all, s, t];
  const lines2 = (edges, ends) => {
    const e = [...new Set(edges)].sort((p, q) => p - q);
    return [.../* @__PURE__ */ new Set([e[0] - c, ...e.slice(1).map((v, i) => (e[i] + v) / 2), e.at(-1) + c, ...ends])].sort((p, q) => p - q);
  };
  const xs = lines2(boxes.flatMap((b) => [b.x, b.x + b.w]), [s.x + s.w / 2, t.x + t.w / 2]), ys = lines2(boxes.flatMap((b) => [b.y, b.y + b.h]), [s.y + s.h / 2, t.y + t.h / 2]);
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]], free = (a, z) => !boxes.some((b) => crosses(a, z, b));
  const beyond = (v, from, step) => {
    if (!step) return v.indexOf(from);
    for (let k2 = step > 0 ? 0 : v.length - 1; k2 >= 0 && k2 < v.length; k2 += step) if (step * (v[k2] - from) > 0) return k2;
    return -1;
  };
  const sides = (b) => [[b.x + b.w / 2, b.y + b.h, 1], [b.x + b.w, b.y + b.h / 2, 0], [b.x + b.w / 2, b.y, 3], [b.x, b.y + b.h / 2, 2]].flatMap(([x, y, d]) => {
    const i = beyond(xs, x, DIRS[d][0]), j = beyond(ys, y, DIRS[d][1]), side = { x, y };
    return i < 0 || j < 0 || !free(side, { x: xs[i], y: ys[j] }) ? [] : [{ side, d, i, j, len: Math.abs(xs[i] - x) + Math.abs(ys[j] - y) }];
  });
  const key = (i, j, d) => (i * ys.length + j) * 4 + d, cost = /* @__PURE__ */ new Map(), prev = /* @__PURE__ */ new Map(), start = /* @__PURE__ */ new Map();
  const queue = [], push = (k2, c2) => {
    if (cost.has(k2) && cost.get(k2) <= c2) return false;
    cost.set(k2, c2);
    queue.push([c2, k2]);
    return true;
  };
  for (const g of sides(s)) {
    const k2 = key(g.i, g.j, g.d);
    if (push(k2, g.len)) start.set(k2, g.side);
  }
  const goals = sides(t);
  let end;
  while (queue.length) {
    let m = 0;
    for (let q = 1; q < queue.length; q++) if (queue[q][0] < queue[m][0]) m = q;
    const [here, k2] = queue.splice(m, 1)[0];
    if (here > cost.get(k2)) continue;
    if (end && here >= end.total) break;
    const d = k2 % 4, j = Math.floor(k2 / 4) % ys.length, i = Math.floor(k2 / 4 / ys.length);
    for (const g of goals) if (g.i === i && g.j === j) {
      const total = here + g.len + (d === (g.d + 2) % 4 ? 0 : BEND);
      if (!end || total < end.total) end = { k: k2, total, side: g.side };
    }
    DIRS.forEach(([dx, dy], nd) => {
      const ni = i + dx, nj = j + dy;
      if (nd === (d + 2) % 4 || ni < 0 || nj < 0 || ni >= xs.length || nj >= ys.length) return;
      const a = { x: xs[i], y: ys[j] }, z = { x: xs[ni], y: ys[nj] };
      if (!free(a, z)) return;
      const nk = key(ni, nj, nd);
      if (push(nk, here + Math.abs(z.x - a.x) + Math.abs(z.y - a.y) + (nd === d ? 0 : BEND))) {
        prev.set(nk, k2);
        start.delete(nk);
      }
    });
  }
  if (!end) return void 0;
  const path = [end.side];
  let k = end.k;
  for (; ; ) {
    path.unshift({ x: xs[Math.floor(k / 4 / ys.length)], y: ys[Math.floor(k / 4) % ys.length] });
    const p = prev.get(k);
    if (p === void 0) break;
    k = p;
  }
  return simplifyRoute([start.get(k), ...path]);
}
function simplifyRoute(points) {
  const out = [];
  for (const q of points) {
    const last = out.at(-1);
    if (last && last.x === q.x && last.y === q.y) continue;
    const prev = out.at(-2);
    if (prev && last && (prev.x === last.x && last.x === q.x || prev.y === last.y && last.y === q.y)) out[out.length - 1] = { ...q };
    else out.push({ ...q });
  }
  return out;
}
var LANE_GAP = 8;
function separateLanes(input) {
  const routes = input.map((r) => r.map((q) => ({ ...q })));
  for (const horizontal of [true, false]) {
    const segs = [];
    routes.forEach((pts, r) => pts.slice(1).forEach((z, i) => {
      const a = pts[i];
      if (horizontal ? a.y === z.y && a.x !== z.x : a.x === z.x && a.y !== z.y) segs.push({ r, i, at: horizontal ? a.y : a.x, lo: Math.min(horizontal ? a.x : a.y, horizontal ? z.x : z.y), hi: Math.max(horizontal ? a.x : a.y, horizontal ? z.x : z.y) });
    }));
    const byLine = /* @__PURE__ */ new Map();
    for (const g of segs) byLine.set(g.at, [...byLine.get(g.at) ?? [], g]);
    for (const line of byLine.values()) {
      line.sort((p, q) => p.lo - q.lo);
      let cluster = [], reach = -Infinity;
      const flush = () => {
        const rs = [...new Set(cluster.map((g) => g.r))].sort((p, q) => p - q);
        if (rs.length > 1) for (const g of cluster) {
          const offset = (rs.indexOf(g.r) - (rs.length - 1) / 2) * LANE_GAP, pts = routes[g.r];
          for (const k of [g.i, g.i + 1]) {
            if (horizontal) pts[k].y = g.at + offset;
            else pts[k].x = g.at + offset;
          }
        }
        cluster = [];
        reach = -Infinity;
      };
      for (const g of line) {
        if (cluster.length && g.lo >= reach - 4) flush();
        cluster.push(g);
        reach = Math.max(reach, g.hi);
      }
      flush();
    }
  }
  return routes;
}
function labelBox(t) {
  const w = Math.max(0, ...t.lines.map((l) => textWidth(l, t.size, t.bold))) + 4, top = t.y - t.size, h = t.size + (t.lines.length - 1) * t.lineHeight + 4;
  return { x: t.anchor === "middle" ? t.x - w / 2 : t.x - 2, y: top, w, h };
}
var overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
function clearOf(t, placed, boxes, lines2 = []) {
  const { alts, ...base2 } = t, sides = [base2, ...alts ?? []];
  const ks = [0, ...Array.from({ length: 40 }, (_, i) => i % 2 ? -(i + 1) / 2 : i / 2 + 1)];
  const tries = sides.flatMap((side) => ks.map((k) => ({ ...side, y: side.y + k * side.lineHeight })).filter((c, i) => side.span ? c.y >= side.span[0] && c.y <= side.span[1] : i < 7));
  const free = (c) => !placed.some((b) => overlaps(labelBox(c), b));
  const clear = (c) => free(c) && !boxes.some((b) => overlaps(labelBox(c), b)), offLines = (c) => {
    const b = labelBox(c);
    return !lines2.some((r) => r.slice(1).some((z, i) => crosses(r[i], z, b)));
  };
  const out = tries.find((c) => clear(c) && offLines(c)) ?? tries.find((c) => clear(c)) ?? tries.find((c) => free(c) && !boxes.some((b) => inside({ x: c.x, y: c.y }, b))) ?? base2;
  placed.push(labelBox(out));
  return out;
}

// ../../src/export/diagram.ts
var xml = (value2) => String(value2).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

// ../../src/export/design/kit.ts
var LIGHT = {
  paper: "#f5f5f5",
  paper2: "#ececec",
  ink: "#2d3142",
  inkStrong: "#111111",
  muted: "#4f5d75",
  soft: "#7a8399",
  rule: "rgba(45,49,66,0.12)",
  ruleSolid: "#bfc0c0",
  accent: "#eb6c36",
  accentTint: "rgba(235,108,54,0.08)",
  link: "#2e5aa8",
  backend: "#ffffff",
  store: "rgba(45,49,66,0.05)",
  external: "rgba(45,49,66,0.03)",
  externalStroke: "rgba(45,49,66,0.30)",
  optionalStroke: "rgba(45,49,66,0.20)",
  wash: "rgba(45,49,66,0.02)",
  faceLeft: "rgba(45,49,66,0.07)",
  faceRight: "rgba(45,49,66,0.15)",
  accentLeft: "rgba(235,108,54,0.20)",
  accentRight: "rgba(235,108,54,0.32)",
  series: ["#5e7a9b", "#7c8f6f", "#b8915a", "#9c6b50", "#6e6479"]
};
var DARK = {
  paper: "#2d3142",
  paper2: "#393e53",
  ink: "#f5f5f5",
  inkStrong: "#111111",
  muted: "#bfc0c0",
  soft: "#8e98ac",
  rule: "rgba(245,245,245,0.12)",
  ruleSolid: "rgba(191,192,192,0.25)",
  accent: "#f08a59",
  accentTint: "rgba(240,138,89,0.10)",
  link: "#6a95d8",
  backend: "#393e53",
  store: "rgba(245,245,245,0.06)",
  external: "rgba(245,245,245,0.04)",
  externalStroke: "rgba(245,245,245,0.30)",
  optionalStroke: "rgba(245,245,245,0.22)",
  wash: "rgba(245,245,245,0.03)",
  faceLeft: "rgba(0,0,0,0.18)",
  faceRight: "rgba(0,0,0,0.32)",
  accentLeft: "rgba(240,138,89,0.22)",
  accentRight: "rgba(240,138,89,0.34)",
  series: ["#82a0c0", "#9caf8f", "#d3ad7a", "#b88670", "#8d8298"]
};
var tokensFor = (theme) => theme === "dark" ? DARK : LIGHT;
var SANS = "Geist, Inter, 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
var MONO = "'Geist Mono', ui-monospace, 'SFMono-Regular', 'Cascadia Mono', Consolas, 'Liberation Mono', monospace";
var SERIF = "'Instrument Serif', 'Iowan Old Style', 'Palatino Linotype', Georgia, 'Times New Roman', serif";
var f = (n) => String(Math.round(n * 10) / 10);
var monoWidth = (s, size, tracking = 0) => [...s].length * size * (0.62 + tracking);
function clipMono(s, width, size, tracking = 0) {
  const max = Math.max(1, Math.floor(width / (size * (0.62 + tracking))));
  const chars = [...s];
  return chars.length <= max ? s : `${chars.slice(0, Math.max(1, max - 1)).join("")}\u2026`;
}
var sansLines = (s, width, size, max, bold = false) => measureLines(s, width / 1.08, { size, bold }, max).lines;
function txt(s, x, y, o) {
  return `<text x="${f(x)}" y="${f(y)}" font-size="${o.size}" fill="${o.fill}"${o.font ? ` font-family="${o.font}"` : ""}${o.weight ? ` font-weight="${o.weight}"` : ""}${o.anchor && o.anchor !== "start" ? ` text-anchor="${o.anchor}"` : ""}${o.tracking ? ` letter-spacing="${o.tracking}em"` : ""}${o.italic ? ' font-style="italic"' : ""}${o.extra ?? ""}>${xml(s)}</text>`;
}
function lines(ls, x, y, lh, o) {
  return ls.map((l, i) => txt(l, x, y + i * lh, o)).join("");
}
function elbowPath(pts, radius = 8) {
  if (pts.length < 2) return "";
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], p = pts[i], b = pts[i + 1], l1 = Math.hypot(p.x - a.x, p.y - a.y), l2 = Math.hypot(b.x - p.x, b.y - p.y), rr = Math.min(radius, l1 / 2, l2 / 2);
    if (rr < 0.5 || !l1 || !l2) {
      d += ` L ${f(p.x)} ${f(p.y)}`;
      continue;
    }
    const ux = (p.x - a.x) / l1, uy = (p.y - a.y) / l1, vx = (b.x - p.x) / l2, vy = (b.y - p.y) / l2;
    d += ` L ${f(p.x - ux * rr)} ${f(p.y - uy * rr)} Q ${f(p.x)} ${f(p.y)} ${f(p.x + vx * rr)} ${f(p.y + vy * rr)}`;
  }
  const z = pts[pts.length - 1];
  return `${d} L ${f(z.x)} ${f(z.y)}`;
}
function markers(prefix, t) {
  return ["arrow", "accent", "link"].map((k) => `<marker id="${prefix}-${k}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="${k === "accent" ? t.accent : k === "link" ? t.link : t.muted}"/></marker>`).join("");
}
function treatmentOf(kind, basis2, focal) {
  if (focal) return "focal";
  if (basis2 === "unknown") return "optional";
  if (kind === "storage" || kind === "table") return "store";
  if (kind === "source") return "external";
  if (kind === "control") return "input";
  return "backend";
}
var TREATMENT_LABEL = { focal: "Focal", backend: "Service", store: "Store", external: "Source / external", input: "Control", optional: "Declared, not read" };
function treatmentStyle(tr, t) {
  switch (tr) {
    case "focal":
      return { fill: t.accentTint, stroke: t.accent };
    case "store":
      return { fill: t.store, stroke: t.muted };
    case "external":
      return { fill: t.external, stroke: t.externalStroke };
    case "input":
      return { fill: t.store, stroke: t.soft };
    case "optional":
      return { fill: t.wash, stroke: t.optionalStroke, dash: "4,3" };
    default:
      return { fill: t.backend, stroke: t.ink };
  }
}
var KIND_TAG = { source: "SRC", process: "PROC", storage: "STORE", model: "MODEL", report: "RPT", app: "APP", control: "CTRL", physics: "PHYS", function: "FN", table: "TABLE" };
function nodeBox(n, t) {
  const s = treatmentStyle(n.treatment, t), cx = n.x + n.w / 2, tagW = Math.max(28, Math.ceil(monoWidth(n.tag, 7, 0.08) + 10));
  const name = sansLines(n.name, n.w - 20, 12, 2, true), sub = n.sub && !(name.length > 1 && n.h < 68) ? clipMono(n.sub, n.w - 16, 9) : "";
  const block = name.length * 15 + (sub ? 14 : 0) - 4, areaTop = n.y + 22, top = areaTop + Math.max(0, (n.y + n.h - 6 - areaTop - block) / 2) + 9;
  const tagStroke = n.treatment === "focal" ? t.accent : t.soft;
  return `<g ${n.attr ?? "data-node-id"}="${xml(n.id)}"${n.opens ? ' data-opens="true"' : ""}>${n.title ? `<title>${xml(n.title)}</title>` : ""}<rect x="${f(n.x)}" y="${f(n.y)}" width="${f(n.w)}" height="${f(n.h)}" rx="6" fill="${t.paper}"/><rect x="${f(n.x)}" y="${f(n.y)}" width="${f(n.w)}" height="${f(n.h)}" rx="6" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1"${s.dash ? ` stroke-dasharray="${s.dash}"` : ""}/><rect x="${f(n.x + 8)}" y="${f(n.y + 6)}" width="${tagW}" height="12" rx="2" fill="none" stroke="${tagStroke}" stroke-opacity="0.6" stroke-width="0.8"/>` + txt(n.tag, n.x + 8 + tagW / 2, n.y + 15, { size: 7, fill: tagStroke, font: MONO, anchor: "middle", tracking: 0.08 }) + (n.opens ? `<path d="M ${f(n.x + n.w - 16)} ${f(n.y + 8)} h 8 v 8" fill="none" stroke="${t.soft}" stroke-width="1"/><path d="M ${f(n.x + n.w - 8)} ${f(n.y + 8)} l -6 6" stroke="${t.soft}" stroke-width="1"/>` : "") + lines(name, cx, top, 15, { size: 12, fill: n.treatment === "focal" ? t.ink : t.ink, weight: 600, anchor: "middle" }) + (sub ? txt(sub, cx, top + (name.length - 1) * 15 + 15, { size: 9, fill: t.muted, font: MONO, anchor: "middle" }) : "") + "</g>";
}
var labelText = (s) => clipMono(s.toUpperCase().replace(/\s+/g, " ").trim(), 14 * 8 * 0.62 * 1.06 + 1, 8, 0.06);
function labelChip(s, cx, baseline, t, anchor = "middle") {
  const w = Math.ceil(monoWidth(s, 8, 0.06)) + 8, x = anchor === "middle" ? cx - w / 2 : cx - 4, box = { x, y: baseline - 9, w, h: 12 };
  return { box, svg: `<rect x="${f(box.x)}" y="${f(box.y)}" width="${w}" height="12" rx="2" fill="${t.paper}"/>${txt(s, anchor === "middle" ? cx : cx, baseline, { size: 8, fill: t.soft, font: MONO, anchor, tracking: 0.06 })}` };
}
function legendStrip(items, x, y, width, t) {
  if (!items.length) return { svg: "", height: 0 };
  const out = [`<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + width)}" y2="${f(y)}" stroke="${t.rule}" stroke-width="1"/>`, txt("LEGEND", x, y + 22, { size: 8, fill: t.soft, font: MONO, tracking: 0.14 })];
  let cx = x + 72, cy = y + 22;
  for (const it of items) {
    const label2 = it.label.toUpperCase(), w = 28 + monoWidth(label2, 8, 0.08) + 20;
    if (cx + w > x + width) {
      cx = x + 72;
      cy += 20;
    }
    if (it.kind === "swatch") out.push(`<rect x="${f(cx)}" y="${f(cy - 9)}" width="18" height="12" rx="2" fill="${it.fill}"/>`);
    else if (it.kind === "box") {
      const s = treatmentStyle(it.treatment, t);
      out.push(`<rect x="${f(cx)}" y="${f(cy - 9)}" width="18" height="12" rx="3" fill="${s.fill}" stroke="${s.stroke}"${s.dash ? ` stroke-dasharray="${s.dash}"` : ""}/>`);
    } else out.push(`<line x1="${f(cx)}" y1="${f(cy - 3)}" x2="${f(cx + 18)}" y2="${f(cy - 3)}" stroke="${t[it.stroke]}" stroke-width="1.2"${it.dashed ? ' stroke-dasharray="5,4"' : ""}/>`);
    out.push(txt(label2, cx + 26, cy, { size: 8, fill: t.muted, font: MONO, tracking: 0.08 }));
    cx += w;
  }
  return { svg: out.join(""), height: cy - y + 14 };
}
function header(eyebrow, title, purpose, x, y, width, t, editorial) {
  const size = editorial ? 34 : 26, ts = sansLines(title, width, size, 3), tl = Math.round(size * 1.15), extra = (ts.length - 1) * tl, ps = sansLines(purpose, width, 12, 2);
  return { height: 24 + size + extra + 8 + ps.length * 17 + (editorial ? 8 : 0), svg: txt(clipMono(eyebrow.toUpperCase(), width, 9, 0.14), x, y + 10, { size: 9, fill: editorial ? t.accent : t.soft, font: MONO, tracking: 0.14 }) + lines(ts, x, y + 18 + size, tl, { size, fill: t.ink, font: SERIF }) + lines(ps, x, y + 18 + size + extra + 22, 17, { size: 12, fill: t.muted }) };
}
function footerLine(parts, x, y, width, t) {
  return txt(clipMono(parts.filter(Boolean).join(" \xB7 "), width, 8, 0.04), x, y, { size: 8, fill: t.soft, font: MONO, tracking: 0.04 });
}
function svgDocument(o) {
  const w = Math.ceil(o.width), h = Math.ceil(o.height);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${o.slug}-title ${o.slug}-desc" data-style="design" data-design-type="${xml(o.type)}" data-theme="${o.theme}" data-view-id="${xml(o.viewId)}"><title id="${o.slug}-title">${xml(o.title)}</title><desc id="${o.slug}-desc">${xml(o.desc)}</desc><defs>${o.defs}</defs><rect width="100%" height="100%" fill="${o.t.paper}"/><g font-family="${SANS}">${o.body}</g></svg>`;
}
var overlaps2 = (a, b, pad = 0) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
var slugOf = (s) => `dd-${s.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40)}`;

// ../../src/export/design/context.ts
function designContext(input, viewId, type, options = {}) {
  const doc = publicDocument(input), id4 = doc.views.some((v) => v.id === viewId) ? viewId : doc.rootViewId, view = doc.views.find((v) => v.id === id4);
  const now = options.now ?? /* @__PURE__ */ new Date(), spec = viewSpec(input, id4, { now }), theme = options.theme ?? view.design?.theme ?? "light";
  let focal = new Set((view.design?.focal ?? []).filter((f2) => view.nodeIds.includes(f2))), focalReason = focal.size ? "hint" : "none";
  if (!focal.size) {
    const degree = new Map(spec.nodes.map((n) => [n.id, 0]));
    for (const e of spec.edges) {
      degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
      degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
    }
    const ranked = [...degree].sort((a, b) => b[1] - a[1]);
    if (ranked.length && ranked[0][1] >= 3 && (ranked.length < 2 || ranked[0][1] > ranked[1][1])) {
      focal = /* @__PURE__ */ new Set([ranked[0][0]]);
      focalReason = "auto";
    }
  }
  return { input, doc, view, spec, theme, t: tokensFor(theme), editorial: theme === "editorial", focal, focalReason, slug: slugOf(`${id4}-${type}`), now, purpose: view.design?.caption || spec.purpose || spec.projectTitle };
}
var eyebrowOf = (c, what) => `${c.spec.projectTitle} \xB7 ${PERSPECTIVE_LABEL[c.spec.perspective]} \xB7 ${what}`;
function vectorOf(spec, max = 3) {
  if (!spec.snapshot) return `revision ${spec.projectRevision}`;
  const reps = spec.snapshot.repositories, parts = reps.slice(0, max).map((r) => `${r.id}@${r.revision ? r.revision.slice(0, 8) : "unknown"}`);
  return parts.join(" ") + (reps.length > max ? ` +${reps.length - max}` : "");
}
function footerParts(c) {
  return [c.spec.projectId, `view ${c.spec.viewId}`, vectorOf(c.spec), c.now.toISOString().slice(0, 10), "public content only", ...c.spec.omissions.slice(0, 1)];
}

// ../../src/export/design/architecture.ts
var S = 0.8;
var M = 48;
function sideOf(p, b) {
  const on = (a, v) => Math.abs(a - v) < 1.5, inY = p.y > b.y - 1 && p.y < b.y + b.h + 1, inX = p.x > b.x - 1 && p.x < b.x + b.w + 1;
  if (on(p.x, b.x) && inY) return "l";
  if (on(p.x, b.x + b.w) && inY) return "r";
  if (on(p.y, b.y) && inX) return "t";
  if (on(p.y, b.y + b.h) && inX) return "b";
  return void 0;
}
function expand(r) {
  if (r.length !== 2) return r;
  const [a, b] = r;
  if (a.y === b.y) {
    const mx = (a.x + b.x) / 2;
    return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
  }
  if (a.x === b.x) {
    const my = (a.y + b.y) / 2;
    return [a, { x: a.x, y: my }, { x: b.x, y: my }, b];
  }
  return r;
}
function fanAttachPoints(routes, boxes) {
  const out = routes.map((r) => expand(r.map((p) => ({ ...p }))));
  const groups = /* @__PURE__ */ new Map();
  out.forEach((r, k) => {
    if (r.length < 3) return;
    for (const start of [true, false]) {
      const p = start ? r[0] : r[r.length - 1], q = start ? r[1] : r[r.length - 2], far = start ? r[r.length - 1] : r[0];
      for (const b of boxes) {
        const side = sideOf(p, b);
        if (!side) continue;
        const perpendicular = side === "l" || side === "r" ? p.y === q.y : p.x === q.x;
        if (!perpendicular) break;
        const key = `${b.id}:${side}`;
        groups.set(key, [...groups.get(key) ?? [], { k, start, side, box: b, order: side === "l" || side === "r" ? far.y : far.x }]);
        break;
      }
    }
  });
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    g.sort((a, b) => a.order - b.order || a.k - b.k).forEach((e, i) => {
      const r = out[e.k], p = e.start ? r[0] : r[r.length - 1], q = e.start ? r[1] : r[r.length - 2], n = g.length;
      if (e.side === "l" || e.side === "r") {
        const y = Math.round(e.box.y + e.box.h * (i + 1) / (n + 1));
        p.y = y;
        q.y = y;
      } else {
        const x = Math.round(e.box.x + e.box.w * (i + 1) / (n + 1));
        p.x = x;
        q.x = x;
      }
    });
  }
  return out;
}
function placeLabel(text3, r, boxes, placed, t) {
  const segs = r.slice(1).map((b, i) => ({ a: r[i], b, len: Math.abs(b.x - r[i].x) + Math.abs(b.y - r[i].y) })).sort((p, q) => q.len - p.len);
  for (const s of segs) {
    const horizontal = s.a.y === s.b.y, mid = { x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 };
    const chip = horizontal ? labelChip(text3, mid.x, mid.y - 9, t) : labelChip(text3, mid.x + 12, mid.y + 3, t, "start");
    if (horizontal && chip.box.w + 16 > s.len) continue;
    if (!horizontal && s.len < 28) continue;
    if (boxes.some((b) => overlaps2(chip.box, b, 2)) || placed.some((b) => overlaps2(chip.box, b, 4))) continue;
    return chip;
  }
  return void 0;
}
function summaryCards(c, x, y, width) {
  const { spec, t } = c, count = (b) => spec.nodes.filter((n) => n.basis === b).length;
  const cards = [
    ["Drilldown path", spec.path.map((p) => p.title).join(" \u203A ") || spec.title],
    ["Revisions", vectorOf(spec, 4)],
    ["Provenance", [[count("static-source"), "read from source"], [count("planned"), "planned"], [count("unknown"), "declared, not read"], [count("unspecified"), "basis not stated"]].filter(([n]) => n).map(([n, l]) => `${n} ${l}`).join(" \xB7 ") || "no components"]
  ];
  const gap = 16, w = (width - gap * 2) / 3, h = 92;
  return { height: h, svg: cards.map(([k, v], i) => {
    const cx = x + i * (w + gap);
    return `<rect x="${f(cx)}" y="${f(y)}" width="${f(w)}" height="${h}" rx="6" fill="${t.paper2}" stroke="${t.rule}"/>` + txt(k.toUpperCase(), cx + 14, y + 22, { size: 8, fill: t.accent, font: MONO, tracking: 0.14 }) + lines(sansLines(v, w - 28, 11, 4), cx + 14, y + 42, 15, { size: 11, fill: t.ink });
  }).join("") };
}
var SPREAD_GAP = 24;
function spreadPositions(view) {
  const ids2 = view.nodeIds, ps = ids2.map((id4) => ({ ...positionFor(view, id4) })), seen = /* @__PURE__ */ new Map();
  for (const p of ps) {
    const k = `${p.x},${p.y}`, n = seen.get(k) ?? 0;
    seen.set(k, n + 1);
    p.x += n * (NODE_WIDTH + SPREAD_GAP);
  }
  let s = 1;
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const dx = Math.abs(ps[i].x - ps[j].x), dy = Math.abs(ps[i].y - ps[j].y);
    if (dx >= NODE_WIDTH + SPREAD_GAP || dy >= NODE_HEIGHT + SPREAD_GAP) continue;
    s = Math.max(s, Math.min(dx ? (NODE_WIDTH + SPREAD_GAP) / dx : Infinity, dy ? (NODE_HEIGHT + SPREAD_GAP) / dy : Infinity));
  }
  if (s === 1 && ps.every((p, i) => p.x === positionFor(view, ids2[i]).x)) return view;
  const x0 = Math.min(...ps.map((p) => p.x)), y0 = Math.min(...ps.map((p) => p.y));
  return { ...view, positions: Object.fromEntries(ids2.map((id4, i) => [id4, { x: Math.round(x0 + (ps[i].x - x0) * s), y: Math.round(y0 + (ps[i].y - y0) * s) }])) };
}
function architectureSvg(input, viewId, options = {}, layout) {
  const c0 = designContext(input, viewId, "architecture", options), plan = layout?.(c0), c = plan ? { ...c0, slug: c0.slug.replace(/-architecture$/, `-${plan.type}`) } : c0;
  const { doc, spec, t } = c, view = spreadPositions(plan ? { ...c.view, positions: plan.positions } : c.view), scene = buildScene(doc, view), b = scene.bounds;
  const byId = new Map(spec.nodes.map((n) => [n.id, n])), edgeById = new Map(spec.edges.map((e) => [e.id, e]));
  const W0 = b.width * S, contentW = Math.max(W0, 640), hdr = header(eyebrowOf(c, plan?.label ?? "Architecture"), spec.title, c.purpose, M, M, contentW, t, c.editorial);
  const ox = M + (contentW - W0) / 2 - b.x * S, oy = M + hdr.height + 28 - b.y * S, X = (p) => ({ x: p.x * S + ox, y: p.y * S + oy });
  const boxes = scene.nodes.map((n) => ({ id: n.id, x: n.x * S + ox, y: n.y * S + oy, w: n.w * S, h: n.h * S }));
  const routes = fanAttachPoints(scene.edges.map((e) => e.points.map(X)), boxes);
  const zones = [], zoneBoxes = [];
  for (const lane of plan?.lanes ?? []) {
    const mem = boxes.filter((x) => lane.members.includes(x.id));
    if (!mem.length) continue;
    const y0 = Math.min(...mem.map((m) => m.y)) - 32, y1 = Math.max(...mem.map((m) => m.y + m.h)) + 16;
    zones.push(`<g data-lane="${xml(lane.id)}"><rect x="${f(M - 12)}" y="${f(y0)}" width="${f(contentW + 24)}" height="${f(y1 - y0)}" rx="6" fill="${t.wash}" stroke="${t.rule}" stroke-width="1"/>${txt(lane.title.toUpperCase().slice(0, 48), M, y0 + 16, { size: 8, fill: t.soft, font: MONO, tracking: 0.14 })}</g>`);
  }
  if (!plan?.lanes && spec.groups.length >= 2 && spec.groups.length <= 3) for (const g of spec.groups) {
    const mem = boxes.filter((x) => g.members.includes(x.id));
    if (!mem.length) continue;
    const z = { x: Math.min(...mem.map((m) => m.x)) - 20, y: Math.min(...mem.map((m) => m.y)) - 32, w: 0, h: 0 };
    z.w = Math.max(...mem.map((m) => m.x + m.w)) + 20 - z.x;
    z.h = Math.max(...mem.map((m) => m.y + m.h)) + 20 - z.y;
    if (boxes.some((x) => !g.members.includes(x.id) && overlaps2(x, z)) || zoneBoxes.some((o) => overlaps2(o, z, 8))) continue;
    zoneBoxes.push(z);
    const label2 = g.title.toUpperCase().slice(0, 40), lw = label2.length * 8 * 0.76 + 12;
    zones.push(`<g data-zone="${xml(g.id)}"><rect x="${f(z.x)}" y="${f(z.y)}" width="${f(z.w)}" height="${f(z.h)}" rx="8" fill="${t.wash}" stroke="${t.rule}" stroke-width="1"/><rect x="${f(z.x + 10)}" y="${f(z.y - 6)}" width="${f(lw)}" height="12" fill="${t.paper}"/>${txt(label2, z.x + 16, z.y + 3, { size: 8, fill: t.soft, font: MONO, tracking: 0.14 })}</g>`);
  }
  let accentEdges = 0;
  const used = /* @__PURE__ */ new Set();
  const arrows = scene.edges.map((e, k) => {
    const s = edgeById.get(e.id);
    if (!s) return "";
    const accent = c.focal.size > 1 && c.focal.has(s.from) && c.focal.has(s.to), link = !accent && s.kind === "query", dashed = s.kind === "control" || s.kind === "dependency" || s.basis === "unknown";
    if (accent) accentEdges++;
    used.add(accent ? "accent" : link ? "link" : "muted");
    if (dashed) used.add("dashed");
    return `<path data-edge-id="${xml(e.id)}" d="${elbowPath(routes[k])}" fill="none" stroke="${accent ? t.accent : link ? t.link : t.muted}" stroke-width="${accent ? 1.6 : 1.2}"${dashed ? ' stroke-dasharray="5,4"' : ""} marker-end="url(#${c.slug}-${accent ? "accent" : link ? "link" : "arrow"})"><title>${xml(`${byId.get(s.from)?.label ?? s.from} \u2192 ${byId.get(s.to)?.label ?? s.to}${s.label ? `: ${s.label}` : ""} (${s.kind})`)}</title></path>`;
  }).join("");
  const treatments = /* @__PURE__ */ new Set();
  const nodes = scene.nodes.map((n, i) => {
    const s = byId.get(n.id);
    if (!s) return "";
    const tr = treatmentOf(s.kind, s.basis ?? "unspecified", c.focal.has(s.id));
    treatments.add(tr);
    return nodeBox({
      ...boxes[i],
      id: s.id,
      name: s.label,
      sub: s.provider && s.provider !== "Generic" ? s.provider : s.summary,
      tag: KIND_TAG[s.kind],
      treatment: tr,
      opens: !!s.opens,
      title: `${s.label} \xB7 ${s.kind} \xB7 basis ${s.basis}${s.confidence ? ` \xB7 ${s.confidence}` : ""}${s.opens ? " \xB7 opens a detail view" : ""}`
    }, t);
  }).join("");
  const placed = [], labels = scene.edges.map((e, k) => {
    const s = edgeById.get(e.id);
    if (!s?.label) return "";
    const chip = placeLabel(labelText(s.label.replace(/\s*\((inferred|possible)\)$/, "")), routes[k], boxes, placed, t);
    if (!chip) return "";
    placed.push(chip.box);
    return chip.svg;
  }).join("");
  const areaBottom = Math.max(b.y + b.height, ...scene.nodes.map((n) => n.y + n.h)) * S + oy;
  const order = ["focal", "backend", "store", "external", "input", "optional"];
  const items = [
    ...order.filter((x) => treatments.has(x)).map((x) => ({ kind: "box", treatment: x, label: x === "focal" && c.focalReason === "auto" ? "Focal \xB7 most connected" : TREATMENT_LABEL[x] })),
    ...used.has("muted") ? [{ kind: "line", stroke: "muted", label: "Flow" }] : [],
    ...used.has("link") ? [{ kind: "line", stroke: "link", label: "Request / API" }] : [],
    ...accentEdges ? [{ kind: "line", stroke: "accent", label: "Focal path" }] : [],
    ...used.has("dashed") ? [{ kind: "line", stroke: "muted", dashed: true, label: "Control / dependency" }] : []
  ];
  const legend = legendStrip(items, M, areaBottom + 28, contentW, t);
  let y = areaBottom + 28 + legend.height + 12;
  const cards = c.editorial ? summaryCards(c, M, y + 8, contentW) : void 0;
  if (cards) y += cards.height + 24;
  const foot = footerLine(footerParts(c), M, y + 12, contentW, t), height = y + 12 + M - 12;
  return svgDocument({
    slug: c.slug,
    width: contentW + 2 * M,
    height,
    title: `${spec.title} \xB7 ${spec.projectTitle}`,
    desc: `${plan?.desc ?? "Architecture"} of the public view ${spec.viewId}: ${spec.nodes.length} components and ${spec.edges.length} connections.${spec.omissions.length ? ` ${spec.omissions.join(" ")}` : ""}`,
    t,
    theme: c.theme,
    type: plan?.type ?? "architecture",
    viewId: spec.viewId,
    defs: markers(c.slug, t),
    body: hdr.svg + zones.join("") + arrows + nodes + labels + legend.svg + (cards?.svg ?? "") + foot
  });
}

// ../../src/export/design/delta.ts
var sig = (n) => [n.label, n.kind, n.provider, n.summary, n.basis, n.designStatus].join("");
var edgeSig = (e) => [e.label, e.kind, e.basis].join("");
var MOVE = 8;
function compareView(beforeInput, afterInput, viewId, now = /* @__PURE__ */ new Date()) {
  if (beforeInput.id !== afterInput.id) throw new Error(`These are two different projects (${beforeInput.id}, ${afterInput.id}): compare two versions of the same project.`);
  const has = (d) => publicDocument(d).views.some((v) => v.id === viewId);
  if (!has(beforeInput) || !has(afterInput)) throw new Error(`View ${viewId} is not public in ${has(beforeInput) ? "the newer" : "the earlier"} version: pick a view both versions show.`);
  const before = viewSpec(beforeInput, viewId, { now }), after = viewSpec(afterInput, viewId, { now });
  const bn = new Map(before.nodes.map((n) => [n.id, n])), an = new Map(after.nodes.map((n) => [n.id, n])), be = new Map(before.edges.map((e) => [e.id, e])), ae = new Map(after.edges.map((e) => [e.id, e]));
  const components = /* @__PURE__ */ new Map(), relationships = /* @__PURE__ */ new Map(), ledger = [];
  const name = (id4) => an.get(id4)?.label ?? bn.get(id4)?.label ?? id4;
  for (const id4 of /* @__PURE__ */ new Set([...bn.keys(), ...an.keys()])) {
    const a = bn.get(id4), b = an.get(id4);
    if (!a) {
      components.set(id4, "added");
      ledger.push(`ADDED \xB7 ${b.label} (${b.kind})`);
      continue;
    }
    if (!b) {
      components.set(id4, "removed");
      ledger.push(`REMOVED \xB7 ${a.label}`);
      continue;
    }
    const changed = sig(a) !== sig(b), moved = Math.abs(a.position.x - b.position.x) > MOVE || Math.abs(a.position.y - b.position.y) > MOVE;
    components.set(id4, changed && moved ? "changed moved" : changed ? "changed" : moved ? "moved" : "unchanged");
    if (changed) {
      const what = a.label !== b.label ? `renamed from "${a.label}"` : a.kind !== b.kind ? `kind ${a.kind} \u2192 ${b.kind}` : a.provider !== b.provider ? `${a.provider || "no provider"} \u2192 ${b.provider || "no provider"}` : a.basis !== b.basis ? `basis ${a.basis} \u2192 ${b.basis}` : a.designStatus !== b.designStatus ? `status ${a.designStatus} \u2192 ${b.designStatus}` : "summary changed";
      ledger.push(`CHANGED \xB7 ${b.label}: ${what}`);
    }
    if (moved) ledger.push(`MOVED \xB7 ${b.label}`);
  }
  for (const id4 of /* @__PURE__ */ new Set([...be.keys(), ...ae.keys()])) {
    const a = be.get(id4), b = ae.get(id4);
    if (!a) {
      relationships.set(id4, "added");
      ledger.push(`ADDED LINK \xB7 ${name(b.from)} \u2192 ${name(b.to)}${b.label ? ` (${b.label})` : ""}`);
      continue;
    }
    if (!b) {
      relationships.set(id4, "removed");
      ledger.push(`REMOVED LINK \xB7 ${name(a.from)} \u2192 ${name(a.to)}`);
      continue;
    }
    const changed = edgeSig(a) !== edgeSig(b), rewired = a.from !== b.from || a.to !== b.to;
    relationships.set(id4, changed && rewired ? "changed rewired" : changed ? "changed" : rewired ? "rewired" : "unchanged");
    if (rewired) ledger.push(`REWIRED \xB7 ${name(a.from)} \u2192 ${name(a.to)} now ${name(b.from)} \u2192 ${name(b.to)}`);
    if (changed) ledger.push(`CHANGED LINK \xB7 ${name(b.from)} \u2192 ${name(b.to)}: ${a.label !== b.label ? `"${a.label}" \u2192 "${b.label}"` : a.kind !== b.kind ? `${a.kind} \u2192 ${b.kind}` : `basis ${a.basis} \u2192 ${b.basis}`}`);
  }
  return { viewId, before, after, components, relationships, ledger };
}

// ../../src/development/contracts.ts
var ATLAS_VERSION = "development-atlas/1";
var EVIDENCE_BASES = ["OBSERVED", "DERIVED", "DECLARED", "INFERRED", "UNKNOWN"];
var id3 = external_exports.string().regex(/^[a-z][a-z0-9_.-]{0,79}$/);
var value = external_exports.union([external_exports.string().max(2048), external_exports.number().finite(), external_exports.boolean(), external_exports.null()]);
var data = external_exports.record(external_exports.string().max(80), external_exports.union([value, external_exports.array(value).max(100)])).default({});
var entity = external_exports.object({ id: id3, label: external_exports.string().min(1).max(160), kind: external_exports.string().max(40), basis: external_exports.enum(EVIDENCE_BASES), evidenceIds: external_exports.array(id3).max(20), data }).strict();
var relation = external_exports.object({ id: id3, source: id3, target: id3, label: external_exports.string().max(160), basis: external_exports.enum(EVIDENCE_BASES), evidenceIds: external_exports.array(id3).max(20) }).strict();
var evidence = external_exports.object({ id: id3, authority: external_exports.string().max(160), basis: external_exports.enum(EVIDENCE_BASES), observedAt: external_exports.string().datetime({ offset: true }), summary: external_exports.string().max(500) }).strict();
var developmentAtlasSchema = external_exports.object({ version: external_exports.literal(ATLAS_VERSION), capturedAt: external_exports.string().datetime({ offset: true }), scope: external_exports.object({ project: external_exports.string().max(160), repo: external_exports.string().max(2048).optional(), worktree: external_exports.string().max(2048).optional(), revision: external_exports.string().max(120).optional() }).strict(), repositories: external_exports.array(entity).max(60), worktrees: external_exports.array(entity).max(100), branches: external_exports.array(entity).max(150), revisions: external_exports.array(entity).max(200), changes: external_exports.array(entity).max(100), files: external_exports.array(entity).max(200), reviews: external_exports.array(entity).max(100), ci: external_exports.array(entity).max(100), agents: external_exports.array(entity).max(100), components: external_exports.array(entity).max(100), relations: external_exports.array(relation).max(1500), evidence: external_exports.array(evidence).max(200) }).strict();
var ENTITY_COLLECTIONS = ["repositories", "worktrees", "branches", "revisions", "changes", "files", "reviews", "ci", "agents", "components"];
function atlasEntities(atlas) {
  return ENTITY_COLLECTIONS.flatMap((k) => atlas[k]);
}
function validateDevelopmentAtlas(input) {
  if (JSON.stringify(input).length > 2 * 1024 * 1024) throw Error("Atlas exceeds 2 MiB");
  const atlas = developmentAtlasSchema.parse(input), entities = atlasEntities(atlas);
  if (entities.length > 500) throw Error("Atlas exceeds 500 entities");
  const all = [...entities, ...atlas.relations, ...atlas.evidence].map((e) => e.id);
  if (new Set(all).size !== all.length) throw Error("Duplicate Atlas ID");
  const ids2 = new Set(entities.map((e) => e.id)), ev = new Set(atlas.evidence.map((e) => e.id));
  for (const r of atlas.relations) if (!ids2.has(r.source) || !ids2.has(r.target)) throw Error("Dangling Atlas relationship");
  for (const e of [...entities, ...atlas.relations]) if (e.evidenceIds.some((i) => !ev.has(i))) throw Error("Missing Atlas evidence");
  return atlas;
}

// ../../src/development/index.ts
var DEVELOPMENT_VIEWS = ["repository-blueprint", "active-work", "branch-merge", "agent-worktree", "review-impact", "evolution"];
var titles = { "repository-blueprint": "Repository blueprint", "active-work": "Active work", "branch-merge": "Branch / merge", "agent-worktree": "Agent / worktree", "review-impact": "Review / impact", "evolution": "Evolution" };
var kinds = { "repository-blueprint": ["repository", "worktree", "component", "file"], "active-work": ["repository", "worktree", "change", "file", "component"], "branch-merge": ["repository", "branch", "revision", "worktree", "review", "ci", "change"], "agent-worktree": ["repository", "worktree", "agent", "change"], "review-impact": ["repository", "change", "file", "review", "ci", "component"], "evolution": ["repository", "revision", "change"] };
function atlasToDiagramDocument(input) {
  const a = validateDevelopmentAtlas(input), entities = atlasEntities(a);
  const nodes = entities.map((e) => ({ id: e.id, label: e.label, kind: e.kind === "file" ? "source" : "process", provider: "Generic", summary: `${e.kind} \xB7 ${e.basis} \xB7 ${String(e.data.status ?? e.data.sha ?? e.data.branch ?? "")}`.slice(0, 500), tags: [e.basis], status: "idle" }));
  const edges = a.relations.map((r) => ({ id: r.id, source: r.source, target: r.target, label: `${r.basis} \xB7 ${r.label}`.slice(0, 160), kind: "dependency", basis: "unknown" }));
  const views = DEVELOPMENT_VIEWS.map((id4) => {
    let files = 0;
    const selected = entities.filter((e) => kinds[id4].includes(e.kind)).filter((e) => !["repository-blueprint", "active-work", "review-impact"].includes(id4) || !a.scope.worktree || e.kind === "repository" || e.kind === "review" || e.kind === "ci" || e.data.worktreePath === a.scope.worktree || e.data.path === a.scope.worktree).filter((e) => id4 !== "repository-blueprint" || e.kind !== "file" || e.data.blueprint === true).filter((e) => e.kind !== "file" || ++files <= 40);
    const ids2 = new Set(selected.map((e) => e.id));
    return { id: id4, title: titles[id4], description: `Runtime facts captured ${a.capturedAt}. File views show at most 40 files in the selected worktree; full facts stay in the Atlas inspector. Evidence bases remain in the Atlas; design status is not telemetry.`, nodeIds: selected.map((e) => e.id), edgeIds: edges.filter((e) => ids2.has(e.source) && ids2.has(e.target)).map((e) => e.id), positions: {}, perspective: id4 === "agent-worktree" ? "agents" : "git" };
  });
  const doc = validateDocument({ schemaVersion: 1, id: "development-atlas", title: a.scope.project, rootViewId: "active-work", provenance: "Runtime projection from development-atlas/1. No reviewed or published observations.", nodes, edges, views });
  for (const v of doc.views) v.positions = layeredLayout(doc, v.id, { maxColumns: 6 });
  return doc;
}
function buildDevelopmentView(input, view = "active-work") {
  const atlas = validateDevelopmentAtlas(input), document = { ...atlasToDiagramDocument(atlas), rootViewId: view }, v = document.views.find((v2) => v2.id === view);
  if (!v) throw Error("Unknown development view");
  return { atlas, document, viewSpec: viewSpec(document, view, { now: new Date(atlas.capturedAt) }), scene: buildScene(document, v) };
}
function renderDevelopmentSvg(input, view = "active-work", theme = "light") {
  const atlas = validateDevelopmentAtlas(input), document = { ...atlasToDiagramDocument(atlas), rootViewId: view };
  if (!DEVELOPMENT_VIEWS.includes(view)) throw Error("Unknown development view");
  return architectureSvg(document, view, { theme, now: new Date(atlas.capturedAt) }, (c) => ({ type: "development", label: "Development Atlas", positions: c.view.positions }));
}
function compareDevelopmentViews(before, after, view = "active-work") {
  return compareView({ ...atlasToDiagramDocument(before), rootViewId: view }, { ...atlasToDiagramDocument(after), rootViewId: view }, view, new Date(after.capturedAt));
}
export {
  ATLAS_VERSION,
  DEVELOPMENT_VIEWS,
  ENTITY_COLLECTIONS,
  EVIDENCE_BASES,
  atlasEntities,
  atlasToDiagramDocument,
  buildDevelopmentView,
  compareDevelopmentViews,
  developmentAtlasSchema,
  renderDevelopmentSvg,
  validateDevelopmentAtlas
};
