import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Obter o token do bot a partir das variáveis de ambiente
const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedUsers = process.env.TELEGRAM_ALLOWED_USERS ? process.env.TELEGRAM_ALLOWED_USERS.split(',') : [];

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
    let userAllowed: boolean = true;
  
    // Verificar se o remetente da mensagem está na lista de IDs permitidos
    if (msg.from && allowedUsers.length > 0 && !allowedUsers.includes(msg.from.id.toString())) {
      userAllowed = false;
    }
  
    const commandArray = message.split(' '); // Divide a mensagem em um array de palavras
    const command = commandArray[0].toLowerCase(); // Obtém o primeiro elemento do array (o comando)
    const incidencia = commandArray.slice(1).join(' '); // Junta as palavras após o comando

    switch (command) {
    case '/start':
        bot.sendMessage(chatId, 'Bem-vindo! Este é um <b>bot</b> simples para o Telegram.', { parse_mode: 'HTML' });
        break;

    case '/sucesso':
        if (userAllowed) {
        contagem++;
        bot.sendMessage(chatId, `Contagem atual: <b>${contagem}</b>`, { parse_mode: 'HTML' });
        }
        break;

    case '/incidencia':
        if (userAllowed) {
        contagem = 0; // Zera a contagem ao ocorrer uma incidência
        bot.sendMessage(chatId, `Infelizmente tivemos uma incidência de <b>${incidencia}</b> e a contagem foi <b>zerada</b>.`, { parse_mode: 'HTML' });
        }
        break;

    case '/contagem':
        if (userAllowed) {
        bot.sendMessage(chatId, `Estamos a <b>${contagem}</b> dia(s) sem pedidos de bots de Cassinos, ask-to-ask, hackaer facebook, contribua com essa contagem.`, { parse_mode: 'HTML' });
        }
        break;

    case '/myid':
        const myIdMessage = msg.from ? `Seu ID de usuário é <b>${msg.from.id}</b>` : 'Não foi possível obter o ID de usuário.';
        bot.sendMessage(chatId, myIdMessage, { parse_mode: 'HTML' });
        break;

    case '/idgrupo':
        const groupIdMessage = `O ID deste grupo é <b>${chatId}</b>`;
        bot.sendMessage(chatId, groupIdMessage, { parse_mode: 'HTML' });
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
