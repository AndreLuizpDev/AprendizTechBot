import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Obter o token do bot a partir das variáveis de ambiente
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Token do bot não encontrado no arquivo .env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

let contagem = 0; // Variável para armazenar a contagem

// Mensagem de log indicando que o bot foi inicializado com sucesso
console.log('Bot inicializado com sucesso.');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text || '';

  const commandArray = message.split(' '); // Divide a mensagem em um array de palavras
  const command = commandArray[0].toLowerCase(); // Obtém o primeiro elemento do array (o comando)
  const incidencia = commandArray.slice(1).join(' '); // Junta as palavras após o comando

  switch (command) {
    case '/start':
      bot.sendMessage(chatId, 'Bem-vindo! Este é um bot simples para o Telegram.');
      break;

    case '/sucesso':
      contagem++;
      bot.sendMessage(chatId, `Contagem atual: ${contagem}`);
      break;

    case '/incidencia':
      contagem--;
      bot.sendMessage(chatId, `Infelizmente tivemos uma incidência de ${incidencia} e perdemos 1 dia na contagem, atualmente a contagem é de ${contagem} dia(s)`);
      break;

    case '/contagem':
      bot.sendMessage(chatId, `Estamos a ${contagem} dia(s) sem pedidos de bots de Cassinos, ask-to-ask, hackaer facebook, contribua com essa contagem.`);
      break;

    default:
      bot.sendMessage(chatId, 'Desculpe, não entendi essa mensagem.');
  }
});

// Manipulador de eventos para o sinal de interrupção (Ctrl + C)
process.on('SIGINT', () => {
  // Mensagem de log indicando que o bot está sendo encerrado
  console.log('Bot encerrado.');
  process.exit();
});
