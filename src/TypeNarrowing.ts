/**
 * ========================================================================
 * TYPESCRIPT TYPE NARROWING - COMPREHENSIVE GUIDE
 * ========================================================================
 *
 * Type Narrowing is the process of refining a variable's type from a more
 * general type to a more specific type within a conditional block.
 *
 * TypeScript uses control flow analysis to narrow types based on:
 * - typeof checks (for primitives)
 * - truthiness checks
 * - equality checks
 * - instanceof checks (for class instances)
 * - in operator checks (for property existence)
 * - Type predicates (custom type guards)
 * - Discriminated unions (tagged unions)
 *
 * ========================================================================
 */

// ========================================================================
// 1. TYPEOF TYPE GUARDS
// ========================================================================
/**
 * The `typeof` operator is used to narrow types for JavaScript primitives:
 * - "string"
 * - "number"
 * - "boolean"
 * - "undefined"
 * - "object" (includes arrays, null, and objects)
 * - "function"
 * - "symbol"
 * - "bigint"
 *
 * Note: typeof null === "object" (JavaScript quirk)
 */

function getDataType(data: string | boolean | number | object) {
  // Within this if block, TypeScript narrows `data` to type `string`
  if (typeof data === "string") {
    // TypeScript knows data is a string here
    // We can use string-specific methods like .toUpperCase(), .slice(), etc.
    return `Data Type of ${data} is string`;
  }

  // TypeScript eliminates `string` from possible types
  // data is now: boolean | number | object
  if (typeof data === "boolean") {
    // TypeScript narrows data to `boolean` here
    return `Data Type of ${data} is boolean`;
  }

  // data is now: number | object
  if (typeof data === "number") {
    // TypeScript narrows data to `number` here
    // We can use number-specific methods like .toFixed(), .toPrecision(), etc.
    return `Data Type of ${data} is number`;
  }

  // TypeScript eliminates all other types through control flow analysis
  // data is now narrowed to `object` (the only remaining type)
  return `Data Type of ${data} is object`;
}

// Example usage:
// getDataType("hello") → narrows to string
// getDataType(42) → narrows to number
// getDataType(true) → narrows to boolean
// getDataType({}) → narrows to object

// ========================================================================
// 2. TRUTHINESS NARROWING
// ========================================================================
/**
 * Truthiness narrowing uses JavaScript's concept of truthy/falsy values.
 *
 * Falsy values in JavaScript:
 * - false
 * - 0, -0, 0n (BigInt zero)
 * - "" (empty string)
 * - null
 * - undefined
 * - NaN
 *
 * All other values are truthy.
 *
 * This is particularly useful for narrowing out `null` and `undefined`.
 */

function getData(data?: object) {
  // The `?` makes data optional, so its type is: object | undefined

  // Truthiness check: if data exists (is not undefined, null, etc.)
  if (data) {
    // TypeScript narrows data to `object` (removes undefined)
    // We know data is defined here
    return `Data: ${data}`;
  }

  // TypeScript narrows data to `undefined` here
  return "Data is not provided";
}

// Example usage:
// getData({ name: "John" }) → data is truthy, returns "Data: [object Object]"
// getData() → data is undefined (falsy), returns "Data is not provided"
// getData(undefined) → same as above

// ========================================================================
// 3. INSTANCEOF TYPE GUARDS
// ========================================================================
/**
 * The `instanceof` operator checks if an object is an instance of a
 * particular class or constructor function.
 *
 * Syntax: object instanceof Constructor
 *
 * This is useful for narrowing down union types of class instances.
 * Works with the prototype chain (checks if Constructor.prototype
 * exists in object's prototype chain).
 */

class Cache {
  data() {
    return "Will Return Data from Cache";
  }
}

class Database {
  data() {
    return "Will Return Data from DB";
  }
}

function getRealData(data: Cache | Database) {
  // Check if data is an instance of the Cache class
  if (data instanceof Cache) {
    // TypeScript narrows data to `Cache` type
    // We can safely call Cache-specific methods
    return data.data();
  }

  // TypeScript narrows data to `Database` (the only remaining type)
  // Even without an explicit else, TypeScript knows it must be Database
  return data.data();
}

// Example usage:
// getRealData(new Cache()) → returns "Will Return Data from Cache"
// getRealData(new Database()) → returns "Will Return Data from DB"

/**
 * Note: instanceof doesn't work with:
 * - Type aliases
 * - Interfaces
 * - Primitive types
 *
 * It only works with classes and constructor functions that exist at runtime.
 */

// ========================================================================
// 4. TYPE PREDICATES (CUSTOM TYPE GUARDS)
// ========================================================================
/**
 * Type predicates allow you to create custom type guard functions.
 *
 * Syntax: function isSomething(param: any): param is SpecificType { ... }
 *
 * The return type `param is SpecificType` is a type predicate that tells
 * TypeScript: "if this function returns true, then param is SpecificType"
 *
 * This is extremely powerful for:
 * - Validating objects at runtime
 * - Creating reusable type guards
 * - Narrowing complex types
 * - Handling data from external sources (APIs, user input, etc.)
 */

type UserOrder = {
  id: string;
  type: string;
  price: number;
  quantity: number;
  delivery: string;
};

/**
 * Custom type guard function using a type predicate
 *
 * @param obj - Any value to check
 * @returns true if obj matches UserOrder structure, false otherwise
 *
 * The `obj is UserOrder` tells TypeScript that if this function returns true,
 * TypeScript should treat `obj` as type `UserOrder` in the calling code.
 */
function order(obj: any): obj is UserOrder {
  // Runtime validation: check all required properties and their types
  return (
    typeof obj === "object" && // Must be an object
    obj !== null && // Must not be null (typeof null === "object")
    typeof obj.type === "string" && // type property must be a string
    typeof obj.id === "string" && // Note: id is string in type definition
    typeof obj.delivery === "string" && // delivery must be a string
    typeof obj.price === "number" && // Should add this for completeness
    typeof obj.quantity === "number" // Should add this for completeness
  );
}

function orderDelivery(item: UserOrder | string) {
  // Call our custom type guard
  if (order(item)) {
    // TypeScript narrows item to `UserOrder` here
    // We can safely access UserOrder properties
    return `Delivering ${item.id} of type: ${item.type} with Delivery ${item.delivery}`;
  }

  // TypeScript narrows item to `string` (the only remaining type)
  // item.id would be an error here - TypeScript knows item is just a string
  return `Cannot deliver: ${item}`;
}

// Example usage:
// const validOrder = { id: "123", type: "express", price: 100, quantity: 1, delivery: "fast" };
// orderDelivery(validOrder) → passes type guard, returns delivery info
// orderDelivery("invalid") → fails type guard, returns error message

// ========================================================================
// 5. DISCRIMINATED UNIONS (TAGGED UNIONS)
// ========================================================================
/**
 * Discriminated unions use a common literal property (discriminant/tag)
 * to distinguish between types in a union.
 *
 * Components:
 * 1. A common property (the discriminant) - here it's `type`
 * 2. Literal types for the discriminant - "Tech", "Medical", "Cloth"
 * 3. Union of types that share the discriminant property
 *
 * Benefits:
 * - Type-safe exhaustiveness checking
 * - Automatic narrowing based on the discriminant
 * - Better IDE autocomplete
 * - Prevents runtime errors
 *
 * This pattern is also known as "tagged unions" or "sum types"
 */

// Each type has a unique literal value for the `type` property
type TechProduct = {
  type: "Tech"; // Discriminant: literal type "Tech"
  handlingFee: number;
  warranty?: number; // Tech products might have warranty
};

type MedProduct = {
  type: "Medical"; // Discriminant: literal type "Medical"
  handlingFee: number;
  prescription?: boolean; // Medical products might need prescription
};

type ClothProduct = {
  type: "Cloth"; // Discriminant: literal type "Cloth"
  handlingFee: number;
  size?: string; // Cloth products might have size
};

// Union type: can be any of the three product types
type Product = TechProduct | MedProduct | ClothProduct;

/**
 * Switch statements work perfectly with discriminated unions
 * TypeScript narrows the type in each case block based on the discriminant
 */
function orderProduct(order: Product) {
  // TypeScript analyzes the discriminant property `type`
  switch (order.type) {
    case "Tech":
      // TypeScript narrows order to `TechProduct` here
      // We can access TechProduct-specific properties like warranty
      return `Tech Product with handling fee: ${order.handlingFee}`;

    case "Medical":
      // TypeScript narrows order to `MedProduct` here
      // We can access MedProduct-specific properties like prescription
      return `Medical Product with handling fee: ${order.handlingFee}`;

    case "Cloth":
      // TypeScript narrows order to `ClothProduct` here
      // We can access ClothProduct-specific properties like size
      return `Cloth Product with handling fee: ${order.handlingFee}`;

    // TypeScript ensures exhaustiveness: if we add a new product type
    // and forget to handle it here, TypeScript will show an error
    default:
      // This line ensures exhaustive checking
      const _exhaustiveCheck: never = order;
      return _exhaustiveCheck;
  }
}

// Example usage:
// orderProduct({ type: "Tech", handlingFee: 50 }) → narrows to TechProduct
// orderProduct({ type: "Medical", handlingFee: 30 }) → narrows to MedProduct
// orderProduct({ type: "Cloth", handlingFee: 10 }) → narrows to ClothProduct

// ========================================================================
// 6. WORKING WITH UNKNOWN TYPE
// ========================================================================
/**
 * The `unknown` type is a type-safe counterpart to `any`.
 *
 * Key differences from `any`:
 * - `any`: Opts out of type checking (can do anything)
 * - `unknown`: Forces you to narrow before using (type-safe)
 *
 * Use `unknown` when:
 * - Receiving data from external sources (APIs, user input)
 * - You don't know the type ahead of time
 * - You want type safety without knowing the exact type
 *
 * You MUST narrow `unknown` before using it (unlike `any`).
 */

/**
 * Example: Checking if an unknown value is a string
 *
 * Here's the corrected version.
 */
function isString(str: unknown): str is string {
  // Type guard: narrow unknown to string
  // We use typeof to check at runtime
  return typeof str === "string";
}

/**
 * Safe JSON parsing with unknown
 */
function safeJsonParse(json: string): unknown {
  try {
    // JSON.parse returns 'any', but we treat it as unknown for safety
    const result: unknown = JSON.parse(json);
    return result;
  } catch (error) {
    return null;
  }
}

/**
 * Using unknown with type narrowing
 */
function processUnknownData(data: unknown) {
  // Must narrow before using
  if (typeof data === "string") {
    // Narrowed to string
    return data.toUpperCase();
  }

  if (typeof data === "number") {
    // Narrowed to number
    return data.toFixed(2);
  }

  if (Array.isArray(data)) {
    // Narrowed to array
    return `Array with ${data.length} items`;
  }

  if (data && typeof data === "object") {
    // Narrowed to object (not null, not array)
    return Object.keys(data).length;
  }

  return "Unknown type";
}

// ========================================================================
// 7. ADDITIONAL TYPE NARROWING TECHNIQUES
// ========================================================================

/**
 * 7.1 EQUALITY NARROWING
 * Using === or !== to narrow types
 */
function compareValues(x: string | number, y: string | boolean) {
  if (x === y) {
    // TypeScript narrows both x and y to `string`
    // because that's the only overlapping type
    x.toUpperCase();
    y.toLowerCase();
  }
}

/**
 * 7.2 IN OPERATOR NARROWING
 * Check if a property exists in an object
 */
type Fish = { swim: () => void; name: string };
type Bird = { fly: () => void; name: string };

function move(animal: Fish | Bird) {
  // Check if 'swim' property exists
  if ("swim" in animal) {
    // Narrowed to Fish
    animal.swim();
  } else {
    // Narrowed to Bird
    animal.fly();
  }
}

/**
 * 7.3 ASSIGNMENT NARROWING
 * TypeScript narrows type based on assignment
 */
function assignmentNarrowing() {
  let value: string | number;

  value = "hello";
  // TypeScript narrows value to string after assignment
  value.toUpperCase(); // OK

  value = 42;
  // TypeScript narrows value to number after assignment
  value.toFixed(2); // OK
}

/**
 * 7.4 CONTROL FLOW ANALYSIS
 * TypeScript tracks types through all code paths
 */
function controlFlowExample(value: string | number | null) {
  if (value === null) {
    return; // Exit early
  }

  // TypeScript knows value is not null here: string | number

  if (typeof value === "string") {
    value.toUpperCase(); // value is string
    return;
  }

  // TypeScript knows value must be number here
  // (not null, not string, so must be number)
  value.toFixed(2);
}

// ========================================================================
// 8. COMMON PITFALLS AND BEST PRACTICES
// ========================================================================

/**
 * PITFALL 1: Forgetting null check with typeof
 * typeof null === "object" in JavaScript!
 */
function badNullCheck(value: string | null) {
  if (typeof value === "object") {
    // ❌ BAD: This doesn't narrow out null!
    // value.length; // Error: value might be null
  }

  // ✅ GOOD: Always check for null explicitly
  if (value !== null) {
    value.length; // OK: value is string
  }
}

/**
 * PITFALL 2: Incorrect type predicate implementation
 */
// ❌ BAD: Type predicate doesn't match actual check
function badTypePredicate(value: any): value is string {
  return typeof value === "number"; // Returns true for numbers, but claims string!
}

// ✅ GOOD: Type predicate matches actual check
function goodTypePredicate(value: any): value is string {
  return typeof value === "string";
}

/**
 * BEST PRACTICE: Use type predicates for complex validations
 */
interface User {
  name: string;
  email: string;
  age: number;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    typeof (obj as any).name === "string" &&
    "email" in obj &&
    typeof (obj as any).email === "string" &&
    "age" in obj &&
    typeof (obj as any).age === "number"
  );
}

/**
 * BEST PRACTICE: Use discriminated unions for related types
 * Instead of optional properties, use discriminated unions
 */
// ❌ BAD: Hard to know which properties are available
type BadShape = {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
};

// ✅ GOOD: Clear which properties exist for each kind
type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type GoodShape = Circle | Square;

function getArea(shape: GoodShape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript knows radius exists
      return Math.PI * shape.radius ** 2;
    case "square":
      // TypeScript knows sideLength exists
      return shape.sideLength ** 2;
  }
}

// ========================================================================
// SUMMARY
// ========================================================================
/**
 * Type Narrowing Techniques Summary:
 *
 * 1. typeof - For primitive types (string, number, boolean, etc.)
 * 2. Truthiness - For narrowing out null/undefined
 * 3. instanceof - For class instances
 * 4. Type Predicates - Custom type guards (param is Type)
 * 5. Discriminated Unions - Tagged unions with literal types
 * 6. Equality (===) - For comparing values
 * 7. in operator - For checking property existence
 * 8. Control Flow - TypeScript tracks types through code paths
 *
 * When to use each:
 * - Primitives → typeof
 * - Classes → instanceof
 * - Complex objects → Type predicates
 * - Related types → Discriminated unions
 * - Unknown data → unknown + narrowing
 * - Optional values → Truthiness or explicit null checks
 *
 * Remember: Type narrowing makes your code:
 * - More type-safe
 * - Easier to refactor
 * - Self-documenting
 * - Less prone to runtime errors
 */

// ========================================================================
// EXPORT EXAMPLES FOR TESTING
// ========================================================================
export {
  getDataType,
  getData,
  getRealData,
  order,
  orderDelivery,
  orderProduct,
  isString,
  processUnknownData,
  move,
  getArea,
  isUser,
  type UserOrder,
  type Product,
  type GoodShape,
};
