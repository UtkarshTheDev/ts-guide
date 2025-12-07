/**
 * TypeScript Union Types and Any Type - Beginner Guide
 *
 * This file explains Union types and Any type with simple examples
 */

// ===========================
// UNION TYPES
// ===========================

/**
 * Union Types allow a variable to hold one of several types
 * Syntax: type1 | type2
 */

// Basic Union: number OR string
let weight: number | string = "1kg";
weight = 75; // Can assign number
weight = "80kg"; // Can assign string
// weight = true; // Error! boolean is not allowed

// Another example
let userId: string | number = "user123";
userId = 42; // Valid
userId = "admin"; // Valid

/**
 * Literal Union Types
 * Restrict variable to specific literal values only
 */

// API status can only be one of these three values
let apiRequestStatus: "pending" | "success" | "error" = "pending";
apiRequestStatus = "success";
apiRequestStatus = "error";
// apiRequestStatus = "loading"; // Error! Not in the union

// Movie seat selection - only A1, A2, or A3 allowed
let movieSeat: "A1" | "A2" | "A3" = "A1";
movieSeat = "A2";
movieSeat = "A3";
// movieSeat = "B1"; // Error! Not allowed

// Movie selection - specific movie names only
let movie: "Inception" | "Interstellar" | "The Dark Knight" = "Inception";
movie = "Interstellar";
// movie = "Avatar"; // Error! Not in the union

// Numeric literal union
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 1;
diceRoll = 6;
// diceRoll = 7; // Error! Dice only goes to 6

/**
 * Union with undefined/null
 * Useful when value might not exist
 */
let userName: string | undefined = undefined;
userName = "John";
userName = undefined; // Can be undefined again

let score: number | null = null;
score = 100;
score = null; // Can reset to null

// ===========================
// ANY TYPE
// ===========================

/**
 * The 'any' type turns off TypeScript type checking
 * Variable can be ANY type - no restrictions!
 *
 * WARNING: Use carefully! You lose type safety
 */

let anything: any = 42;
anything = "hello"; // Can change to string
anything = true; // Can change to boolean
anything = { name: "John" }; // Can change to object
anything = [1, 2, 3]; // Can change to array

// Any allows calling any method (even if it doesn't exist!)
// This won't show error but will crash at runtime
// anything.someRandomMethod();

/**
 * When to use 'any':
 * - When you don't know the type yet
 * - When migrating JavaScript code to TypeScript
 * - When working with dynamic data
 *
 * Better to avoid 'any' when possible and use specific types
 */

// Example: JSON parsing returns 'any' by default
let data: any = JSON.parse('{"name": "Alice", "age": 25}');
console.log(data.name); // Works but no type safety

// Array of any - can contain anything
let mixedStuff: any[] = [1, "hello", true, { x: 10 }];
mixedStuff.push(new Date());
mixedStuff.push("anything goes!");

// ===========================
// PRACTICAL EXAMPLES
// ===========================

console.log("=== Union Types Demo ===");

// Example 1: Processing orders
const orders = ["order1", "order2", "order3"];
let currentOrder: string | undefined = orders[0];

for (let order of orders) {
  console.log(`Processing: ${order}`);
  if (order === "order2") {
    currentOrder = "Nothing";
    break;
  }
  currentOrder = order;
}

console.log(`Current order: ${currentOrder}`);

// Example 2: Function with union parameter
function printId(id: string | number) {
  console.log("Your ID is: " + id);
}

printId(101); // Works with number
printId("ABC123"); // Works with string

// Example 3: Function with union return type
function getResponse(success: boolean): string | number {
  if (success) {
    return "Success!";
  } else {
    return 404;
  }
}

console.log(getResponse(true)); // Returns string
console.log(getResponse(false)); // Returns number

// Example 4: Using typeof to check union types
function formatValue(value: string | number) {
  if (typeof value === "string") {
    console.log("String:", value.toUpperCase());
  } else {
    console.log("Number:", value.toFixed(2));
  }
}

formatValue("hello");
formatValue(42.5);

// Example 5: Theme selection
let theme: "light" | "dark" | "auto" = "light";
theme = "dark";
theme = "auto";

console.log(`Current theme: ${theme}`);

/**
 * Key Takeaways:
 *
 * 1. Union Types (|) let you combine multiple types
 * 2. Literal unions restrict to specific values
 * 3. Any type disables type checking (use carefully!)
 * 4. Union types are safer than any
 * 5. Use typeof to check which type you have in a union
 */
