
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error(
    "Missing DISCORD_BOT_TOKEN, CLIENT_ID or GUILD_ID"
  );
}

const commands = [
  new SlashCommandBuilder()
    .setName("ticketsetup")
    .setDescription("Create the AVL ticket panel")
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(token);

async function main() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("AVL Ticket Bot: command registered!");
  } catch (error) {
    console.error("Failed to register command:", error.message);
    process.exitCode = 1;
  }
}

main();
    
