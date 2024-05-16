import { Controller, Get, UseGuards } from '@nestjs/common';
import { OpenAIService } from './ai.service';
import { CacheType, Client, GatewayIntentBits, Interaction, Events, REST, Routes } from 'discord.js';
import { ConfigsService } from './configs.service';
import { ProblemsService } from './modules/problems/problems.service';
import { boopCommand, chatCommand, pingCommand, searchCommand } from './commands.discord';
import { SearchProblemsDTO } from './modules/problems/dto/search-problems.dto';

@Controller()
export class AppController {
  private client = new Client({
    /**274877975616 */
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  });
  constructor(
    private readonly openAI: OpenAIService,
    private readonly problemsService: ProblemsService,
    private readonly configs: ConfigsService,
  ) {
    this.client.on(Events.ClientReady, this.onClientReady);
    this.client.on(Events.InteractionCreate, this.onInteractionCreate);
    this.client.login(this.configs.DISCORD_TOKEN);
    this.registerCommands();
  }

  onClientReady = () => {
    console.log('--- onClientReady ---');
    console.log(`Logged in as ${this.client.user.tag}!`);
  };

  onInteractionCreate = async (interaction: Interaction<CacheType>) => {
    console.log('--- onInteractionCreate ---');
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
      await interaction.reply(`Pong from ${process.env.ENV}`);
      return;
    }

    if (interaction.commandName === 'chat') {
      // console.log(interaction);
      await interaction.reply(`Thinking...`);
      const question = interaction.options.get('question')?.value?.toString();
      console.log(question);
      const context = await this.getContext();
      const response = await this.openAI.getResponse(question, context);
      console.log({ response });
      await interaction.editReply(response);
      return;
    }

    if (interaction.commandName === 'search') {
      const searchObj: SearchProblemsDTO = {
        keyword: interaction.options.get('keyword')?.value?.toString().toLowerCase(),
        tag: interaction.options.get('tag')?.value?.toString().toLowerCase(),
        level: interaction.options.get('level')?.value?.toString().toLowerCase(),
        skip: interaction.options.get('skip')?.value
          ? parseInt(interaction.options.get('skip')?.value?.toString())
          : undefined,
      };
      console.log({ searchObj });
      await interaction.reply(`Searching for ${JSON.stringify(searchObj)}`);
      try {
        const res = await this.problemsService.search(searchObj);
        await interaction.editReply(
          `Results [\`total: ${res.total}\`] \`${JSON.stringify(searchObj)}\`:\n---\n${res.results.map((o) => o.toContextString()).join('\n---\n')}`,
        );
      } catch (error) {
        await interaction.editReply(error.message);
      }
      return;
    }
  };

  async registerCommands() {
    const commands = process.env.ENV == 'PROD' ? [searchCommand] : [chatCommand, searchCommand];

    const rest = new REST({ version: '10' }).setToken(this.configs.DISCORD_TOKEN);

    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(this.configs.DISCORD_CLIENT_ID), { body: commands });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }

  async getContext(): Promise<string> {
    const all = await this.problemsService.getAll();
    const problemsText = all.map((t) => t.toContextString()).join('\n---\n');
    return `Below is all the problems in our course! 
    Use it as context to answer user questions.
    ${problemsText}}`;
  }

  @Get()
  check() {
    return 'discord_thebox';
  }
}
