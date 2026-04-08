/**
 * Canonical JSON serialization for deterministic hashing.
 *
 * Rules (subset of RFC 8785 / JCS sufficient for our types):
 * 1. Object keys sorted lexicographically (Unicode code point order)
 * 2. No whitespace between tokens
 * 3. Strings escaped per JSON spec
 * 4. Numbers serialized as JSON numbers (no leading zeros, no trailing zeros after decimal)
 * 5. null, true, false serialized literally
 * 6. undefined values and undefined object properties are omitted
 * 7. Arrays preserve insertion order
 *
 * This is the ONLY function that should be used to serialize certificate bodies
 * before hashing. Using JSON.stringify() directly would produce non-deterministic
 * output (key ordering varies by engine and insertion order).
 */
export function canonicalize(value: unknown): string {
  return serializeValue(value);
}

function serializeValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'null';

  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number':
      return serializeNumber(value);
    case 'string':
      return serializeString(value);
    case 'bigint':
      // BigInts are serialized as quoted decimal strings
      return serializeString(value.toString());
    case 'object':
      if (Array.isArray(value)) return serializeArray(value);
      return serializeObject(value as Record<string, unknown>);
    default:
      throw new Error(`Cannot canonicalize value of type ${typeof value}`);
  }
}

function serializeNumber(n: number): string {
  if (!Number.isFinite(n)) {
    throw new Error(`Cannot canonicalize non-finite number: ${n}`);
  }
  // JSON number serialization: no leading zeros, use exponential for very large/small
  // Object.is handles -0
  if (Object.is(n, -0)) return '0';
  return JSON.stringify(n);
}

function serializeString(s: string): string {
  // JSON.stringify handles proper escaping of special characters
  return JSON.stringify(s);
}

function serializeArray(arr: unknown[]): string {
  const elements = arr.map((el) => serializeValue(el));
  return `[${elements.join(',')}]`;
}

function serializeObject(obj: Record<string, unknown>): string {
  // Sort keys lexicographically by Unicode code point
  const keys = Object.keys(obj).sort();
  const pairs: string[] = [];

  for (const key of keys) {
    const val = obj[key];
    // Skip undefined values (omit from output)
    if (val === undefined) continue;
    pairs.push(`${serializeString(key)}:${serializeValue(val)}`);
  }

  return `{${pairs.join(',')}}`;
}
