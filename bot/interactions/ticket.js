import Ticket from "../../database/Ticket.js";
import { PermissionFlagsBits } from "discord.js";

export const customId = "create_ticket";

export async function run(client, interaction) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  // Create category if missing
  let category = guild.channels.cache.find(c => c.name === "Tickets");
  if (!category) {
    category = await guild.channels.create({
      name: "Tickets",
      type: 4
    });
  }

  // Create channel
  const channel = await guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: 0,
    parent: category.id,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages
        ]
      }
    ]
  });

  // Save to DB
  await Ticket.create({
    user: interaction.user.id,
    channel: channel.id
  });

  channel.send(`<@${interaction.user.id}> Welcome! Support will respond soon.`);
  interaction.reply({ content: "Ticket created!", ephemeral: true });
}
