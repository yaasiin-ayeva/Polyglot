import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import { config } from 'dotenv';
import { createRequire } from "module";
const require = createRequire(import.meta.url)
const translate = require('@iamtraction/google-translate');

config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const dialects = [
    'en', 'ko', 'ja', 'es', 'fr', 'de', 'zh', 'ru', 'pt', 'it', 'nl', 'pl', 'sv', 'tr', 'cs', 'hu', 'ro', 'fi', 'da', 'no', 'vi', 'el', 'bg',
    'th', 'id', 'hi', 'ar', 'he', 'ur', 'fa', 'ps', 'fil', 'tl', 'ms', 'bn', 'pa', 'gu', 'ta', 'te', 'kn', 'ml', 'si', 'am', 'ne', 'mr', 'sa',
    'mn', 'my', 'km', 'lo', 'bo', 'cy', 'jv', 'su', 'gl', 'ka', 'az', 'eu', 'is', 'mk', 'af', 'sq', 'hy', 'be', 'bs', 'hr', 'sr', 'mt', 'ga',
    'yi', 'sw', 'kk', 'ky', 'tg', 'tk', 'uz', 'tt'
];

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

const commandPrefix = "!";

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const content = message.content.trim();

    let isCommand = false;
    let args = [];
    if (content.startsWith(commandPrefix)) {
        args = content.slice(commandPrefix.length).trim().split(/ +/);
        isCommand = true;
    } else if (message.mentions.has(client.user)) {
        args = content.split(/ +/).slice(1);
        isCommand = true;
    }

    if (!isCommand) return;

    const command = args.shift()?.toLowerCase();

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
            message.reply(`Available code languages (${dialects.length}) :\n ${dialects.join(", ")}`);
        },
        translate: () => {
            const lang = args.shift()?.toLowerCase();

            if (!lang || !dialects.includes(lang)) {
                return message.reply(`Invalid language code. Please use a valid language code. For a list of language codes, use ${commandPrefix}langlist`);
            }

            const text = args.join(" ");
            if (!text) {
                return message.reply(`Please provide text to translate.`);
            }

            translate(text, { to: lang }).then(res => {
                message.reply(`Translated text:\n ${res.text}`);
            }).catch((err) => {
                console.error(err);
                message.reply(`An error occurred while translating.`);
            });
        }
    };

    if (command && commands[command]) {
        commands[command]();
    }
});

client.login(DISCORD_TOKEN);