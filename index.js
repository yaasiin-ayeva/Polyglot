import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config();

const { DISCORD_TOKEN } = process.env;

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url)

const translate = require('@iamtraction/google-translate');
const langAry = ['en', 'ko', 'ja', 'es', 'fr', 'de', 'zh', 'ru', 'pt', 'it', 'nl', 'pl', 'sv', 'tr', 'cs', 'hu', 'ro', 'fi', 'da', 'no', 'vi', 'el', 'bg', 'th', 'id', 'hi', 'ar', 'he', 'ur', 'fa', 'ps', 'fil', 'tl', 'ms', 'bn', 'pa', 'gu', 'ta', 'te', 'kn', 'ml', 'si', 'am', 'ne', 'mr', 'sa', 'mn', 'my', 'km', 'lo', 'bo', 'cy', 'jv', 'su', 'gl', 'ka', 'az', 'eu', 'is', 'mk', 'af', 'sq', 'hy', 'be', 'bs', 'hr', 'sr', 'mt', 'ga', 'yi', 'sw', 'kk', 'ky', 'tg', 'tk', 'uz', 'tt', 'bn', 'ka', 'hy', 'az', 'eu', 'is', 'mk', 'af', 'sq', 'hy', 'be', 'bs', 'hr', 'sr', 'mt', 'ga', 'yi', 'sw', 'kk', 'ky', 'tg', 'tk', 'uz', 'tt', 'bn', 'ka', 'hy', 'az', 'eu', 'is', 'mk', 'af', 'sq', 'hy', 'be', 'bs', 'hr', 'sr', 'mt', 'ga', 'yi', 'sw', 'kk', 'ky', 'tg', 'tk', 'uz', 'tt', 'bn', 'ka', 'hy', 'az', 'eu', 'is', 'mk', 'af', 'sq', 'hy', 'be', 'bs', 'hr', 'sr', 'mt', 'ga', 'yi', 'sw', 'kk', 'ky', 'tg', 'tk', 'uz', 'tt', 'bn', 'ka', 'hy', 'az', 'eu', 'is', 'mk', 'af', 'sq', 'hy', 'be', 'bs', 'hr', 'sr', 'mt', 'ga', 'yi', 'sw', 'kk', 'ky', 'tg', 'tk'];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

const prefix = "!"; // Prefix for commands

client.on(Events.MessageCreate, (message) => {
    const content = message.content.trim();
    if (!content.startsWith(prefix)) return; // Ignore messages that don't start with the prefix

    const args = content.slice(prefix.length).trim().split(/ +/); // Split the message into arguments
    const command = args.shift().toLowerCase(); // Get the command name
    console.log(command, args);

    const commands = {
        help: () => {
            message.reply(`Available commands: ${Object.keys(commands).join(", ")}`);
        },
        ping: () => {
            message.reply(
                `Pong! Latency is ${Date.now() - message.createdTimestamp}ms.`
            );
        },
        langlist: () => {
            message.reply(`Available code languages (${langAry.length}) :\n ${langAry.join(", ")}`);
        },
        translate: () => {
            
            const lang = args.shift().toLowerCase();
            if (!langAry.includes(lang)) return message.reply(`Invalid language code. Please use a valid language code. For a list of language codes, use ${prefix}langlist`);
            const text = args.join(" ");
            if (!text) return message.reply(`Please provide text to translate.`);
            translate(text, { to: lang }).then(res => {
                message.reply(`Translated text:\n ${res.text}`);
            }).catch(err => {
                console.error(err);
            });
        }
    };

    if (command in commands) {
        commands[command]();
    }
});

client.login(DISCORD_TOKEN);