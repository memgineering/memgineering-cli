# memgineering

One memory for the AI you connect.

Your notes stay in a folder you own. Every agent you use — Claude Code, Codex,
Grok, Gemini CLI, anything that can run a command — reads and writes the same
brain through one CLI, so what you told one of them is there for the next one,
tomorrow, and in whatever tool you move to after that.

**You do not have to run any of this yourself.** Ask whichever agent you are
already talking to — "install memgineering and set it up" — and it does the
whole thing, asking you only what it genuinely cannot decide.

<details>
<summary>The commands, for the agent (or for you, if you prefer a terminal)</summary>

```bash
npm i -g memgineering
memgineering setup --agent              # or --web to choose the settings on a screen
memgineering link ~/Documents/Notes     # or: memgineering init ~/brain
```

</details>

## What it does

```bash
memgineering recall "how do we deploy"
```

```
## recall: how do we deploy  (2 cards)

### 1. Deploy is manual
stated

> launchctl kickstart on the Mac Studio, no CD pipeline

`open: deploy-manual`
```

Cards first, not documents. Your agent gets the shape of what you know and a
handle for the one that matters, then opens only that:

```bash
memgineering open deploy-manual                  # the claims behind the card
memgineering open deploy-manual --detail full    # the whole note
```

And it writes, without stopping to ask:

```bash
memgineering remember "deploys are manual — launchctl by hand, no CD"
memgineering undo                                # if that was wrong
```

## Why there is no approval step

Most memory tools queue what an agent learned and wait for you to approve it.
That tax lands on every true observation in order to catch the rare wrong one,
and what it produces in practice is a backlog nobody reads.

memgineering trades permission-before for correction-after. Every write records
what changed, against which bytes, and how to reverse it — in a ledger that
lives inside your brain and travels with it.

```bash
memgineering log      # what has changed, and what can still be undone
memgineering undo <op>
```

The one thing it refuses to do is undo on top of an edit you made yourself. If
the note moved on since, it stops and says so rather than throwing your work
away.

## Your notes stay yours

- **Nothing is uploaded until you say so.** A brain is a folder on this disk;
  only `push`, or connecting a hosted brain, carries notes to your account. The
  index is derived and lives outside your notes folder; deleting it costs a
  rebuild and nothing else.
- **Prose is never rewritten.** `revise` only touches the memory block in a
  note's frontmatter. Your paragraphs are yours.
- **You decide what is read.** `link` shows the actual lines that would be
  stored — not a description of them — before anything is indexed. Notes whose
  content looks like a credential are refused automatically; anything else you
  want left alone goes in `.memgdeny`.
- **You decide what is never written.** Say "nothing about my health goes in
  here" and the declaration is enforced, not advised:
  `remember "…" --never-store "health, hospital"` records the boundary in your
  own words, and any later write carrying one of them is refused with the word
  and your declaration quoted back — whether or not the agent read anything
  first. Widen it one word at a time with `revise --never-store-add`; retire
  the declaration to lift it.
- **`memgineering unlink --purge`** removes every trace this tool kept locally.

## Progressive reading

Depth is a parameter, because context costs money.

| `--detail` | what you get                                    |
| ---------- | ----------------------------------------------- |
| `title`    | just the titles                                 |
| `card`     | title + summary (default)                       |
| `summary`  | + the note's headings                           |
| `chunks`   | + every section, or one with `--section <name>` |
| `full`     | the whole note                                  |

`memgineering recall "deploy" --limit 1 --detail full` is "find the best match
and read it" in a single call.

## Several brains

A personal one, a team folder that syncs, one per repository, one in your
account. Which one answers is decided in this order:

1. an explicit flag — `--vault <path>`, `--brain <name>` (a hosted brain, without
   moving the machine's pointer), or `--local`
2. the hosted brain this machine is pointed at, when you are signed in
3. a `.memgineering` pointer, found by walking up from the current directory
4. the brain the current directory is inside
5. the only one linked

If nothing settles it, memgineering refuses and lists the candidates rather
than guessing. To bind a directory once — a repository root, say — or to point
the whole machine at a hosted brain:

```bash
memgineering use ~/brains/work    # writes a relative path when it can, so it commits
memgineering use --brain "work"   # this machine now reads that hosted brain
```

## Starting a session

```bash
memgineering resurface
```

No query. It ranks by what has been recalled before, how recently, and which of
your base notes have gone unread — a folder-local signal joins in when the
brain lives on this machine. `memgineering setup` can register it to run
automatically when a Claude Code session starts.

## Commands

**Memory — day to day**

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| `recall <query>`  | recall memory cards for a question                    |
| `open <ref>`      | open one memory — by handle, id, path, or exact title |
| `evidence <ref>`  | how much a memory has been used, and why it changed   |
| `remember <text>` | write something down now                              |
| `revise <ref>`    | change a memory's conclusion                          |
| `undo [op]`       | take back the last change, or a named one             |
| `resurface`       | what is worth having in view, unasked                 |
| `rules`           | the standing decisions that bind here                 |

**Brain — set up and point**

|                                     |                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `init <path>`                       | create a brain, laid out and ready                                       |
| `onboard`                           | what to ask so it knows who it belongs to                                |
| `link <path>`                       | read notes you already keep                                              |
| `use [brain]`                       | bind this folder — or, with `--brain`, point the machine at a hosted one |
| `unlink` · `reindex` · `sync-rules` | brain housekeeping                                                       |
| `log`                               | what changed, and what can still be undone                               |

**Curation — occasional**

|                         |                                                     |
| ----------------------- | --------------------------------------------------- |
| `retire` · `unretire`   | mark a memory no longer current, or current again   |
| `exclude` · `unexclude` | stop reading a note entirely, or resume             |
| `consolidate`           | find memories worth merging — reads, writes nothing |
| `propose <action>`      | draft a change for approval — writes no note        |
| `proposals`             | review what is waiting — approve, reject, rebase    |

**Account — optional; everything above works without it**

|                                      |                                                     |
| ------------------------------------ | --------------------------------------------------- |
| `login` · `logout` · `whoami`        | the account session on this machine                 |
| `brains`                             | list your hosted brains, and which one answers here |
| `create` · `rename` · `delete-brain` | make, rename, or delete a hosted brain              |
| `push` · `pull`                      | carry a brain to your account, and back down again  |
| `delete-account`                     | delete your account — brain and registry — for good |

`delete-account` deletes the hosted brain account (every brain, note and
token on it) and then the registry account the same Google sign-in made
(the account is renamed `deleted-…`; its published packages and versions
stay at their existing addresses), and signs this machine out. It asks for the sentence `delete my account` — typed at the prompt, or
`--confirm "delete my account"` — and checks first that both sign-ins work and
belong to one person (their emails match; if either account has no email, the
registry sign-in this machine got from the brain sign-in is the match). If it stops halfway, run it again: it finishes the side
that is left. Folders on this disk are never touched. Without a sign-in you
can use, mail support@memgineering.com from the address on the account.

**System**

|          |                            |
| -------- | -------------------------- |
| `setup`  | install into your agents   |
| `update` | update memgineering itself |

Every command takes `--json`.

## Environment

|                            |                                                              |
| -------------------------- | ------------------------------------------------------------ |
| `MEMGINEERING_HOME`        | state and derived index (default `~/.memgineering`)          |
| `MEMGINEERING_JSON=1`      | force JSON output without the flag                           |
| `MEMGINEERING_NO_UPDATE=1` | skip the version check for one run                           |
| `MEMGINEERING_API_URL`     | hosted brain server (default `https://api.memgineering.com`) |
| `MEMGINEERING_AGENT_HOME`  | where `setup` installs agent files (default: your home)      |

## A brain that is not on this machine

A brain can also live in a memgineering account, so the same memory reaches
every tool and device you sign in from. Nothing about the local path went away —
`--local` reads the folder on this disk whether or not you are signed in.

```bash
memgineering push                 # carry this folder up, note by note
memgineering pull ~/my-brain      # bring it back down, as markdown
```

The pair is deliberately asymmetric in the same direction: **`push` never
deletes anything here, and `pull` never overwrites anything here.** A file
already at that path is left alone and reported, so an interrupted transfer is
finished by running the command again and a mistyped folder costs you nothing.

What `pull` writes is your notes, at the paths they had, including the ones your
rules exclude — excluded means "stop reading this", not "this is no longer
yours" — with `.memgignore` alongside them so the scoping survives the trip.
It is a folder of markdown, not yet a brain: `memgineering link` is what makes
it one, and it shows you what it would read first.

## Licence

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE), which also states
the update and support policy.
