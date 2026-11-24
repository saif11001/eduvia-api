const prisma = require("./lib/prisma.js");

async function main() {
    const count = await prisma.user.count();
    console.log("Users in database:", count);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());