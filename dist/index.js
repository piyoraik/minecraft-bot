"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discord_js_1 = require("discord.js");
const ec2Status_1 = require("./ec2Status");
const discordClient = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
});
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Discord Bot');
});
discordClient.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'start') {
        yield interaction.reply({
            content: 'EC2 Instance StartUp...',
        });
        (0, ec2Status_1.ec2Status)(interaction, 'START');
    }
    if (interaction.commandName === 'kill') {
        yield interaction.reply({
            content: 'EC2 Instance Shutdown...',
        });
        (0, ec2Status_1.ec2Status)(interaction, 'STOP');
    }
    if (interaction.commandName === 'test') {
        yield interaction.reply({
            content: 'うまぴょい！うまぴょい！',
        });
    }
}));
discordClient.login(process.env.TOKEN);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Listening on port', port);
});
