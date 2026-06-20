import prisma from "../src/config/prisma.js";



async function main() {

console.log("Seeding customers...");

await prisma.customer.createMany({
    data: [
    {
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    },
    {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    },
    {
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "9876543212",
    },
    {
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "9876543213",
    },
    {
    name: "David Brown",
    email: "david@example.com",
    phone: "9876543214",
    },
    {
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "9876543215",
    },
    {
    name: "Robert Miller",
    email: "robert@example.com",
    phone: "9876543216",
    },
    {
    name: "Olivia Taylor",
    email: "olivia@example.com",
    phone: "9876543217",
    },
    {
    name: "Daniel Anderson",
    email: "daniel@example.com",
    phone: "9876543218",
    },
    {
    name: "Sophia Thomas",
    email: "sophia@example.com",
    phone: "9876543219",
    },
    ],
    skipDuplicates: true,
    });

console.log("Seeding products...");

await prisma.product.createMany({
  data: [
    {
      name: "MacBook Pro",
      description: "16-inch Apple laptop",
      category: "Electronics",
      price: 2499.99,
      stockQuantity: 10,
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB gaming keyboard",
      category: "Electronics",
      price: 129.99,
      stockQuantity: 25,
    },
    {
      name: "Wireless Mouse",
      description: "Bluetooth mouse",
      category: "Electronics",
      price: 49.99,
      stockQuantity: 50,
    },
    {
      name: "Monitor",
      description: "27 inch IPS display",
      category: "Electronics",
      price: 299.99,
      stockQuantity: 0,
    },
    {
      name: "T-Shirt",
      description: "Cotton t-shirt",
      category: "Clothing",
      price: 19.99,
      stockQuantity: 100,
    },
    {
      name: "Jeans",
      description: "Blue denim jeans",
      category: "Clothing",
      price: 49.99,
      stockQuantity: 40,
    },
    {
      name: "Hoodie",
      description: "Winter hoodie",
      category: "Clothing",
      price: 59.99,
      stockQuantity: 15,
    },
    {
      name: "Jacket",
      description: "Leather jacket",
      category: "Clothing",
      price: 99.99,
      stockQuantity: 0,
    },
    {
      name: "Clean Code",
      description: "Software craftsmanship book",
      category: "Books",
      price: 39.99,
      stockQuantity: 30,
    },
    {
      name: "Node.js Design Patterns",
      description: "Backend development book",
      category: "Books",
      price: 49.99,
      stockQuantity: 20,
    },
  ],
});

console.log("Seed completed successfully");
}

main()
.catch((error) => {
console.error(error);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});
