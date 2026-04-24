const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'api_test@test.ru'
  const password = 'Test123!'
  const firstName = 'API'
  const lastName = 'Test'
  const nickname = 'api_test'

  // Проверка существования
  const existing = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })

  if (existing) {
    console.log('✅ Пользователь уже существует')
    console.log(JSON.stringify({
      id: existing.id,
      email: existing.email,
      profile: existing.profile
    }, null, 2))
    return
  }

  // Хэшируем пароль
  const passwordHash = await bcrypt.hash(password, 12)

  // Создаём пользователя с профилем
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        role: 'USER',
        emailVerified: new Date()
      }
    })

    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        nickname,
        displayName: `${firstName} ${lastName}`,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=0D8ABC&color=fff`
      }
    })

    return { user, profile }
  })

  console.log('✅ Пользователь создан успешно!')
  console.log(JSON.stringify({
    id: result.user.id,
    email: result.user.email,
    firstName: result.user.firstName,
    lastName: result.user.lastName,
    role: result.user.role,
    profile: {
      id: result.profile.id,
      nickname: result.profile.nickname,
      displayName: result.profile.displayName
    }
  }, null, 2))
  console.log('\n📝 Данные для входа:')
  console.log(`   Email: ${email}`)
  console.log(`   Пароль: ${password}`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
