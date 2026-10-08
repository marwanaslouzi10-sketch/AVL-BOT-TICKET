
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const categories = {
  support: {
    en: "Support",
    ar: "الدعم الفني"
  },
  report: {
    en: "Report",
    ar: "التبليغ"
  },
  partnership: {
    en: "Partnership",
    ar: "الشراكات"
  }
};

client.once("ready", () => {
  console.log(`AVL Ticket Bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  try {
    if (!interaction.isChatInputCommand() &&
        !interaction.isButton()) return;

    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "ticketsetup") {
        if (!interaction.memberPermissions.has(
          PermissionsBitField.Flags.Administrator
        )) {
          return interaction.reply({
            content: "Administrator permission required.",
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setColor(0xD4AF37)
          .setTitle("AVL | TICKET CENTER")
          .setDescription(
            "🇬🇧 Select a category below to open a ticket.\n" +
            "🇲🇦 اختار نوع التذكرة من الأزرار لتواصل مع الإدارة."
          )
          .setFooter({ text: "ARABIC VIRTUAL LEAGUE" });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_support")
            .setLabel("Support | الدعم")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("ticket_report")
            .setLabel("Report | تبليغ")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("ticket_partnership")
            .setLabel("Partnership | شراكة")
            .setStyle(ButtonStyle.Success)
        );

        return interaction.reply({
          embeds: [embed],
          components: [row]
        });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId.startsWith("ticket_")) {
        const type = interaction.customId.slice(7);
        const category = categories[type];

        if (!category) return;

        const guild = interaction.guild;
        const safeName = interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 15) || "user";

        const channel = await guild.channels.create({
          name: `${type}-${safeName}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            },
            {
              id: client.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ManageChannels
              ]
            }
          ]
        });

        const embed = new EmbedBuilder()
          .setColor(0xD4AF37)
          .setTitle(`AVL | ${category.en}`)
          .setDescription(
            `Welcome ${interaction.user}!\n` +
            `مرحباً بك! شرح لينا المشكل ديالك هنا.\n\n` +
            `Category: ${category.en} / ${category.ar}`
          );

        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Close Ticket | إغلاق")
            .setStyle(ButtonStyle.Secondary)
        );

        await channel.send({
          content: `${interaction.user}`,
          embeds: [embed],
          components: [closeRow]
        });

        return interaction.reply({
          content: `Ticket created: ${channel}`,
          ephemeral: true
        });
      }

      if (interaction.customId === "ticket_close") {
        if (!interaction.channel.name.startsWith(
          "support-"
        ) && !interaction.channel.name.startsWith(
          "report-"
        ) && !interaction.channel.name.startsWith(
          "partnership-"
        )) {
          return interaction.reply({
            content: "This is not a ticket channel.",
            ephemeral: true
          });
        }

        await interaction.reply({
          content: "Ticket will close in 5 seconds. / سيتم إغلاق التذكرة.",
          ephemeral: true
        });

        setTimeout(() => {
          interaction.channel.delete().catch(console.error);
        }, 5000);
      }
    }
  } catch (error) {
    console.error("Interaction error:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "An error occurred. Please try again.",
        ephemeral: true
      }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
  
