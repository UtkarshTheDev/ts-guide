function getDataType(data: string | boolean | number | object) {
  if (typeof data === "string") {
    return `Data Type of ${data} is string`;
  }
  if (typeof data === "boolean") {
    return `Data Type of ${data} is boolean`;
  }
  if (typeof data === "number") {
    return `Data Type of ${data} is number`;
  }
  return `Data Type of ${data} is object`;
}

function getData(data?: object) {
  if (data) {
    return `Data: ${data}`;
  }
  return "Data is not provided";
}

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
  if (data instanceof Cache) {
    return data.data();
  }
}

type UserOrder = {
  id: string;
  type: string;
  price: number;
  quantity: number;
  delivery: string;
};

function order(obj: any): obj is UserOrder {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.type === "string" &&
    typeof obj.id === "number" &&
    typeof obj.delivery === "string"
  );
}

function orderDelivery(item: UserOrder | string) {
  if (order(item)) {
    return `Delvering ${item.id} of type: ${item.type} with Delivery ${item.delivery}`;
  }
}

type TechProduct = {
  type: "Tech";
  handlingFee: number;
};

type MedProduct = {
  type: "Medical";
  handlingFee: number;
};

type ClothProduct = {
  type: "Cloth";
  handlingFee: number;
};

type Product = TechProduct | MedProduct | ClothProduct;

function orderProduct(order: Product) {
  switch (order.type) {
    case "Tech":
      return "Tech Product";
    case "Medical":
      return "Medical Product";
    case "Cloth":
      return "Cloth Product";
  }
}

// Unknown Usage
function isString(str: unknown): boolean {
  return isString(str);
}
