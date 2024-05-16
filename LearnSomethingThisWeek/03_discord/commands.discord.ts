import { SlashCommandBuilder } from 'discord.js';

/**
 * Example command
 */
export const boopCommand = new SlashCommandBuilder()
  .setName('boop')
  .setDescription('Boops the specified user, as many times as you want')
  .addUserOption((option) => option.setName('user').setDescription('The user to boop').setRequired(true))

  // Adds an integer option
  .addIntegerOption((option) =>
    option.setName('boop_amount').setDescription('How many times should the user be booped (defaults to 1)'),
  )

  // Supports choices too!
  .addIntegerOption((option) =>
    option
      .setName('boop_reminder')
      .setDescription('How often should we remind you to boop the user')
      .addChoices({ name: 'Every day', value: 1 }, { name: 'Weekly', value: 7 }),
  )
  .toJSON();

/**
 * Test command
 */
export const pingCommand = new SlashCommandBuilder().setName('ping').setDescription('Reply with Pong!').toJSON();

/**
 * Chat with AI
 */
export const chatCommand = new SlashCommandBuilder()
  .setName('chat')
  .setDescription('Chat with AI!')
  .addStringOption((option) => option.setName('question').setDescription('in the title').setRequired(true))
  .toJSON();

/**
 * Search problems
 */
export const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search problems in the course!')
  .addStringOption((option) => option.setName('keyword').setDescription('in the title,leetcode_id,fbid'))
  .addStringOption((option) => option.setName('tag').setDescription('array,sort,...'))
  .addStringOption((option) => option.setName('level').setDescription('easy,medium,hard'))
  .addIntegerOption((option) => option.setName('skip').setDescription('skip n first results!'))
  .toJSON();
