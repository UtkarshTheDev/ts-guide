/**
 * ---------------------------------------------------------------------
 * TYPESCRIPT INTERFACES & OBJECT TYPES GUIDE
 * ---------------------------------------------------------------------
 * This file serves as a reference for defining data shapes, using interfaces
 * vs type aliases, class implementation, and property modifiers.
 */

// ==========================================
// 1. Defining Object Shapes (Type Aliases)
// ==========================================
// A 'type' alias allows you to define the shape of an object.
// This is the blueprint for what an object should look like.

type MochaOrder = {
  type: string;
  strong: boolean;
  stevia: number;
};

function makeMocha(order: MochaOrder) {
  console.log("Making mocha...", order);
}

function serveMocha(order: MochaOrder) {
  console.log("Serving mocha...", order);
}


// ==========================================
// 2. Interfaces & Implementing Classes
// ==========================================
// Interfaces are primarily used to define the contract for an object or a class.
// Unlike 'type', interfaces can be merged and are better for defining public APIs.

// Defining a contract for a Coffee Recipe
interface CofeeRecipe {
  coffee: string;
  milk: boolean;
}

// Classes can 'implement' an interface to ensure they adhere to the contract.
// This enforces that 'CappucinoCoffee' MUST have 'coffee' and 'milk' properties.
class CappucinoCoffee implements CofeeRecipe {
  coffee = "Bru";
  milk = true;
}

// Example 2: Interface for sizes
interface CupSize {
  size: "small" | "large";
}

class coffee implements CupSize {
  // We must match the type exactly (or a subset if compatible)
  size: "small" | "large" = "large";
}

// Example 3: Handling API Responses
// Interfaces are standard for typing JSON responses from servers.
interface Response {
  ok: true | false; // or simply 'boolean'
}

class myRes implements Response {
  ok: boolean = true;
}


// ==========================================
// 3. Literal Types & Unions
// ==========================================
// Instead of general strings like string, you can specify EXACT values.
// A Union (|) allows a value to be one of several types/literals.

// This String can ONLY be one of these three values.
type CoffeeType = "mocha" | "cappucino" | "frappe";

function orderCoffee(t: CoffeeType) {
  console.log(`Ordering a ${t}`);
}
// orderCoffee("latte"); // Error: "latte" is not assignable to CoffeeType


// ==========================================
// 4. Intersection Types (Combining Types)
// ==========================================
// Intersection (&) allows you to combine multiple types into one.
// The resulting object must satisfy ALL combined types.

type SimpleCoffee = { 
  coffeeType: string 
};

type Extra = { 
  choclate: boolean 
};

// Merging the two types into one
type ChoclateCoffee = SimpleCoffee & Extra;

const cup: ChoclateCoffee = {
  coffeeType: "Nescafee",
  choclate: true,
};


// ==========================================
// 5. Property Modifiers: Optional & Readonly
// ==========================================

// --- Optional Properties (?) ---
// Properties marked with '?' are not required.

type User = {
  username: string;
  bio?: string; // Optional: user might not have a bio
};

const u1: User = { username: "Tommy" }; // Valid, no bio
const u2: User = { username: "Shommy", bio: "Hi i am tommy's friend" }; // Valid


// --- Readonly Properties ---
// Properties marked 'readonly' cannot be changed after creation.

type AppData = {
  readonly name: string;
  version: string;
};

const ChessTicks: AppData = {
  name: "ChessTicks",
  version: "2.1",
};

// ChessTicks.name = "NewName"; // ❌ Error: Cannot assign to 'name' because it is a read-only property.
ChessTicks.version = "2.2"; // ✅ Allowed because it's not readonly.

const TicksChess: AppData = {
  name: "TicksChess",
  version: "2.32",
};
