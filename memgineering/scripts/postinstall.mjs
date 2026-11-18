#!/usr/bin/env node
/**
 * The one thing an AGENT has to be told after a global install.
 *
 * This used to print `memgineering installed. Next: memgineering setup` and
 * gate it on `process.stdout.isTTY`. Both were wrong, and a first-run test with
 * Codex showed exactly how: the agent installed the package and then reported
 * to its user "초기 설정 명령: memgineering setup" — handing a terminal command
 * to a non-developer and stopping. The person is left holding an instruction
 * they did not ask for and cannot act on, in a product whose entire premise is
 * that their agent does this for them.
 *
 * The TTY gate made it worse. An agent running `npm i -g` has a PIPE, not a
 * terminal, so the guidance was suppressed in precisely the case it exists for
 * and printed only for the developer who least needed it.
 *
 * So: speak to the agent, and speak when the agent is listening. The global
 * check stays — a dependency pulled into somebody's project still has no
 * business printing instructions.
 *
 * Setup is NOT run from here. It asks which tools to install into and whether
 * the tool may update itself, and answering those from a package manager
 * running unattended would be inventing consent. The agent asks the one
 * question that decides it, then runs setup itself — which is the same
 * division of labour every other verb in this product uses.
 *
 * English, per the CLI-output rule: the agent re-renders it in whatever
 * language its user speaks.
 */
if (process.env['npm_config_global'] === 'true') {
  process.stdout.write(
    [
      '',
      'memgineering is installed, but not set up yet.',
      '',
      'Nothing is connected: there is no brain to read, and the agent tools on this',
      'machine have no memgineering guidance yet. Setup is one command:',
      '',
      '  memgineering setup --web',
      '',
      'It does NOT wait for them. It returns in a few seconds — measured — and leaves',
      'a setup screen open in their browser at memgineering.com, where they choose',
      'everything: signing in, where the memory lives, which notes. Nothing is',
      'installed until they finish there, and this machine picks it up on its own.',
      '',
      'If they have not already asked you to set it up, ask them first — it opens a',
      'browser window on their computer. Once you run it, tell them in their language',
      'that the setup screen is open. It prints a short code first: show it to them,',
      'because the screen asks them to compare it.',
      '',
      'No browser on this machine (a server, a container, a sandbox)? Run',
      '`memgineering setup --web --print-url` and give them the link to open on the',
      'computer they are actually sitting at.',
      '',
      '`setup --agent` answers every one of those questions on their behalf, and',
      '`--no-login` answers the biggest one — no account, so the memory cannot follow',
      'them to another machine. Use it only when they have said they would rather you',
      'decided, or when this machine cannot reach a browser and `--print-url` is no',
      'use to them either.',
      '',
      "Setup's output then says how to connect their brain — create one, pick one, or",
      'move existing notes up.',
      '',
      'The `memgineering-setup` skill covers what comes after.',
      '',
    ].join('\n'),
  );
}
