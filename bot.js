const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

// Crie uma instância do cliente Prisma
const prisma = new PrismaClient();

// Função para criar um novo userEmail
async function criarNovoUserEmail(email) {
  try {
    // Use o método create do Prisma para criar salvar o email
    const novoUserEmail = await prisma.userEmail.create({
      data: {
        email: email,
      },
    });
    console.log('Novo userEmail criado:', novoUserEmail);
  } catch (error) {
    console.error('Erro ao criar novo userEmail:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// replace the value below with the Telegram token you receive from @BotFather
const token = '6323356318:AAHcOqd0--uyzx24yRiPIFk6AVzw3Ya7Huo';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.

state = 0 //Gambiarra de estado pra saber se o usario foi barrado ou não o acesso devido ao horario
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const timeUnix = msg.date
  // Converte unix para date
  var date = new Date(timeUnix * 1000);
  // Pega hora
  var hora = date.getHours();
  console.log(msg)
  if(state == 0)// state = zero significa q n barraram o cara
  {
      if(hora >= 9 && hora < 18) // se entre 9h as 18h
      {
        bot.sendMessage(chatId, 'https://uvv.br');
      }
      else
      {
          bot.sendMessage(chatId, 'A empresa so funciona entre as 9h as 18h por favor nos envie seu email para entramos em contato');
          state = 1 //Muda o estado pq significa que o cara foi barrado
      }
  }
  else if(state == 1)// state = 1 signfica que o cara foi barrado
  {
    state = 0
    criarNovoUserEmail(msg.text) //função para salvar email
    bot.sendMessage(chatId, 'email salvo , entraremos em contato');
  }
});