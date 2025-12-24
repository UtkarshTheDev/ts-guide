/**
 * ---------------------------------------------------------------------
 * TYPESCRIPT ADVANCED TYPES & CONCEPTS GUIDE
 * ---------------------------------------------------------------------
 * This file serves as a reference for handling dynamic data, type casting,
 * error handling, and special types like 'unknown' and 'never'.
 */

// ==========================================
// 1. Type Assertion ('as' keyword)
// ==========================================
// Sometimes you know more about a value's type than TypeScript does.
// You can use 'as' to tell the compiler to treat a value as a specific type.

// Example: Asserting a known string hidden in an 'any' type
let response: any = "23";
// We know 'response' is a string, so we assert it to access string methods like .length
let numLength: number = (response as string).length;

// Example: Typing JSON.parse results
// JSON.parse returns 'any' by default. We can define a shape and assert it.
type Coffee = {
  name: string;
};

let coffeeString = '{"name":"Mocha"}';
// Dangerous! If the JSON doesn't match the type, TS won't catch it at runtime.
// Only use 'as' when you are certain of the structure.
let coffeeObject = JSON.parse(coffeeString) as Coffee;


// ==========================================
// 2. 'any' vs 'unknown'
// ==========================================
// Both types can hold any value, but they behave very differently.

// --- The 'any' type ---
// "I don't care about types."
// usage: Turns off type checking. Dangerous.
let value: any;

value = "chai";
value = [1, 2, 3];
value = 2.3;

// ⚠️ NO SAFETY: accessing properties on 'any' is allowed, even if they don't exist.
// This might crash at runtime but TS is silent.
// value.toUpperCase(); // Un-commenting this line will cause a runtime error because 'value' is a number (2.3) 

// --- The 'unknown' type ---
// "I don't know the type yet."
// usage: Safer alternative to 'any'. Forces you to check type before use.
let newValue: unknown;

// It can still accept any value...
newValue = "coffee";
newValue = [1, 2, 3];
newValue = 2.3;

// 🔒 SAFETY: You cannot access properties on 'unknown' directly.
// newValue.toUpperCase(); // Error: Object is of type 'unknown'.

// You MUST perform a type check (Type Narrowing) first:
if (typeof newValue === "string") {
    // TypeScript knows 'newValue' is a string inside this block.
    newValue.toUpperCase(); 
}

// You can also use assertions with unknown if you are sure:
const data: unknown = "mocha and code";
const strData: string = data as string;


// ==========================================
// 3. Error Handling in Try-Catch
// ==========================================
// In TypeScript, the 'error' in a catch block is type 'unknown' (or 'any' in older versions).

try {
    // Simulate risky code
} catch (error) {
    // We cannot access error.message directly because 'error' might be anything (string, object, null).
    
    // Best Practice: Check if it's an instance of Error
    if (error instanceof Error) {
        console.log(error.message);
    }
    console.log("Error", error);
}


// ==========================================
// 4. Literal Types & Control Flow
// ==========================================
// Restricting a variable to specific string/number values.

type Role = "admin" | "user";

function redirectionByRole(role: Role): void {
    if (role === "admin") {
        console.log("Redirecting to admin dashboard");
        return;
    }
    if (role === "user") {
        console.log("Redirecting to user dashboard");
        return;
    }
    
    // Here, TypeScript knows 'role' has been exhausted if we handled all cases.
    // If we add a new Role later (e.g. "manager"), TS might alert us depending on strictness settings.
    // The variable 'role' here is effectively 'never' if all options are covered.
    role; 
}


// ==========================================
// 5. The 'never' Type
// ==========================================
// Represents values that will NEVER occur.
// Used for:
// 1. Functions that throw errors/infinite loops (never return).
// 2. Exhaustiveness checking in switch/if-else chains.

function neverReturn(): never {
    while (true) {
        // console.log("I run forever");
    }
    // Code here is unreachable
}