const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'api_test@test.ru' },
    include: { profile: true }
  })

  if (!user) {
    console.log('❌ Пользователь api_test@test.ru НЕ найден')
    return
  }

  console.log('✅ Пользователь найден:')
  console.log(JSON.stringify({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isBlocked: user.isBlocked,
    hasPasswordHash: !!user.passwordHash,
    profile: user.profile
  }, null, 2))
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
