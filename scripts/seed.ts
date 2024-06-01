const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    // Check if categories already exist to avoid duplicates
    const existingCategories = await database.category.findMany();
    if (existingCategories.length === 0) {
      await database.category.createMany({
        data: [
          { name: "Computer Science" },
          { name: "Music" },
          { name: "Fitness" },
          { name: "Photography" },
          { name: "Accounting" },
          { name: "Engineering" },
          { name: "Filming" },
        ]
      });
      console.log("Categories seeded successfully.");
    } else {
      console.log("Categories already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding the database categories:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
