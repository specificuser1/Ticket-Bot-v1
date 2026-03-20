import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setup-panel")
  .setDescription("Create Ticket Panel");

export async function run(client, interaction) {
  const embed = new EmbedBuilder()
    .setTitle("Support Ticket")
    .setDescription("Click the button below to open a ticket.")
    .setColor("Blue");

  const btn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("create_ticket")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.reply({ embeds: [embed], components: [btn] });
}
