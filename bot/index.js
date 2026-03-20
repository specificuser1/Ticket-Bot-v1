import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// Command Loader
client.commands = new Collection();
const cmdFiles = fs.readdirSync("./bot/commands");
for (const file of cmdFiles) {
  const cmd = await import(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

// Interaction Loader
const intFiles = fs.readdirSync("./bot/interactions");
client.interactions = new Map();
for (const file of intFiles) {
  const int = await import(`./interactions/${file}`);
  client.interactions.set(int.customId, int);
}

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("[DB] Connected"))
  .catch(err => console.log(err));

// Event Handling
client.on("ready", () => {
  console.log(`[BOT] Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    return cmd.run(client, interaction);
  }

  if (interaction.isButton()) {
    const handler = client.interactions.get(interaction.customId);
    if (handler) handler.run(client, interaction);
  }
});

client.login(process.env.TOKEN);
export default client;
