// ZHELEZO Discord bot — !spin / !bonus / !faq / !leaderboard.
// Spec: Texts/discord_server_structure.md. Requires a bot token (see README.md in this folder)
// which I don't have and can't obtain myself — this code is ready to run once you provide one.
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { recordSpin, getLeaderboard } = require('./store');
const { findAnswer, listTopics } = require('./faq');

const PREFIX = '!';
const TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN environment variable. See Scripts/discord-bot/README.md.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // privileged intent — must be enabled in the Dev Portal too
  ],
  partials: [Partials.Channel], // needed so DM sends don't require a cached channel
});

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const [command, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);

  try {
    switch (command.toLowerCase()) {
      case 'spin': {
        const result = recordSpin(message.author.id, message.author.username);
        if (result.alreadySpun) {
          await message.reply('Ты уже отметился сегодня — колесо обновится через 24 часа после последнего спина на BC.Game.');
        } else {
          await message.reply(
            `Записал! Спинов на этой неделе: ${result.weekSpins}. Не забудь крутить реальное колесо на BC.Game каждый день.`
          );
        }
        break;
      }

      case 'bonus': {
        const link =
          'https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist&subId1=discord&subId2=own_server_bonus';
        try {
          await message.author.send(`Твоя ссылка на бонус до 360% + Daily Lucky Spin: ${link}\n18+. Играй ответственно.`);
          if (message.guild) await message.reply('Отправил в личные сообщения.');
        } catch {
          await message.reply('Не смог отправить в личные сообщения — проверь, что личные сообщения от участников сервера разрешены.');
        }
        break;
      }

      case 'faq': {
        const topic = args[0];
        const answer = findAnswer(topic);
        if (answer) {
          await message.reply(answer);
        } else {
          await message.reply(`Не нашёл такую тему. Доступные: ${listTopics()}. Пример: \`!faq fair\``);
        }
        break;
      }

      case 'leaderboard': {
        const top = getLeaderboard();
        if (top.length === 0) {
          await message.reply('На этой неделе ещё никто не отметился через `!spin`.');
        } else {
          const lines = top.map((e, i) => `${i + 1}. ${e.username} — ${e.weekSpins} спинов`);
          await message.reply(`**Лидерборд недели:**\n${lines.join('\n')}`);
        }
        break;
      }

      default:
        break; // unknown command — stay quiet, don't spam "unknown command" for every stray "!" message
    }
  } catch (err) {
    console.error(`Error handling command "${command}":`, err);
  }
});

client.login(TOKEN);
