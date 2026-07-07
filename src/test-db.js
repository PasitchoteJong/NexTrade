// import { prisma } from './lib/prisma.js';

// prisma.$queryRaw`show table`.then(console.log)

// prisma.user.count().then(console)


import { prisma } from './lib/prisma.js'

async function main() {
  const tables = await prisma.$queryRaw`SHOW TABLES`
  console.log('Tables:', tables)

  const userCount = await prisma.user.count()
  console.log('Users:', userCount)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })