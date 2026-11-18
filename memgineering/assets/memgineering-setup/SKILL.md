---
name: memgineering-setup
description: Use when installing or configuring memgineering, when moving a brain between a machine and an account, when renaming or deleting a hosted brain, when the user wants their whole account deleted, or whenever the user asks WHICH of their AI tools can see this memory. Triggers include "set up memgineering", "connect my notes", "rename my brain", "delete that brain", "delete my account", "close my account", "does my other AI see this too", "which of my tools can read this", "will it work in the app on my phone", "can I use this in ChatGPT", "does it work in Claude.ai", "no brain is linked".
type: skill
allowed-tools: Bash(memgineering:*)
---

# Setting memgineering up

## Which tools this actually reaches, today

Answer this from here, not from a guess. The line is capability, not brand, so
it does not move as products come and go:

|                                                            |                                                                                                                                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Any tool that can run a shell command**                  | Reads and writes the same brain. Nothing has to be built for a tool that does not exist yet.                                                                                            |
| **A chat app that takes a custom MCP connector, no shell** | Reads and writes the **hosted** brain on their account through `https://mcp.memgineering.com/mcp`, once they add that connector in the app and sign in with Google. Not a folder brain. |
| **Neither**                                                | **Not yet.**                                                                                                                                                                            |

`memgineering setup` writes its guidance into the agent tools it finds on the
machine, and `setup --dry-run` names the ones it actually found rather than
guessing from a list.

So when someone names a tool and asks whether it remembers too, work it out from
those rows and answer plainly — not a hedge, not a promise:

- **Claude.ai, Claude Desktop, Cowork** — **Customize** → **Connectors** →
  **Add custom connector** → `https://mcp.memgineering.com/mcp`. One connector
  covers all three, and custom connectors are on every plan, the free one
  included. Then sign in with Google when it asks and tick both consents on the
  connect screen (below).
- **ChatGPT** — **paused for now.** The connect screen refuses it with
  `connector_recipient_paused` while the notice about OpenAI is verified. Say so
  plainly, and offer Claude or Gemini instead, or trying again later; do not
  walk them through Developer mode in the meantime.
- It reaches the brain **on their account**. A brain that lives only as a folder
  on this machine is out of its reach until it is moved up (see "Moving a brain
  between this machine and their account").
- Moving it up does NOT make it appear in the chat app by itself. When their
  brain is still a folder, the answer is both steps, in order: move it up, then
  add the connector above in their app. An answer that stops at the first step
  leaves them with an account brain and no way in.
- `npx memgineering-mcp` — the local, stdio server — is **registry-only**. It has
  no memory tools; for memory from a chat app, the URL above is the way.

"You are signed in here, so it works everywhere" is still the wrong answer: the
account syncs the brain between machines, and each chat app needs the connector
added in that app, once.

## 1. Register with the agents

**Default: open the screen.** `memgineering setup --web` starts a setup session,
prints a short pairing code, opens memgineering.com/setup in their browser, and
RETURNS — in seconds, with the screen still up. It does not block until they
finish, so run it and keep going in the same turn.

```
memgineering setup --web              # the screen; the normal answer
memgineering setup --web --print-url  # no browser here — hand over the link
```

Three things to do after running it:

1. Tell them, in their language, that their browser has a setup screen open.
2. Show them the pairing code it printed. The screen's first question is
   whether they started this, and it asks them to compare that code — the
   defence against somebody being sent a setup link.
3. Stop. Nothing installs until they finish on the screen, and this machine
   picks it up on its own when they do. There is nothing to poll and nothing
   to wait for.

The link is the key to that screen, not the code: whoever holds the whole link
can drive it. Give it only to them, never paste it anywhere else — with
`--json`, `setup_url` is printed only when no browser opened.

If they chose to upload existing notes on the screen, this machine does NOT
upload them on its own: the next `memgineering` command shows which folder and
which account would receive them, with the `push` that sends them. Check with
them that the account is theirs before running it. And a machine already
signed in to a different account is never switched by `setup --web` — the
terminal says so; `logout` first if they really mean to switch.

The screen asks everything `--agent` takes from flags — sign in, where the
memory lives, which brain, which tools, auto-update, the session hook — with
the recommended answer pre-selected. A person who is already signed in to
memgineering.com does not sign in again: that session IS the identity, and one
sign-in covers both halves (below).

**Only when they ask you to decide for them**, answer from flags instead:

```
memgineering setup --agent \
  --tools claude,codex \        # default: everything detected
  --auto-update on \            # default: on, and recommended
  --hook on \                   # session-start summary + rules before an edit
  --error-telemetry on          # anonymized crash reports; unset = undecided (off)
```

`--dry-run` reports what would change without changing it. `--human` draws the
same questions as a checkbox list in your terminal, for a machine with no
browser and a person sitting at it.

**`--no-login` is how someone says "this machine only".** It is a flag on the
`--agent` path, not a step on the screen: a brain that lives in a folder here
cannot follow them to their phone or their next laptop, and that is discovered
weeks later, by which time the notes are in the wrong place. On the screen the
same choice is made in front of them, with the differences side by side.

**One sign-in covers both halves (0.17.0+).** Signing in also links the user's
registry account (same Google account, automatic), so the credentials hold a
registry session next to the brain token. `memgineering whoami` reports both —
the brain identity and a `registry:` line with the username. If the registry
line says "not linked", the link simply did not happen at sign-in time (older
server, registry briefly down); a fresh `logout` + `login` links it. Never
treat a missing registry line as a failed brain sign-in — the brain token
stands on its own. Consent to the terms is asked once, when an account is
first created. Two other consents are asked on every chat-app connection
instead. Connecting Claude or Gemini gives the company that runs it what the app
reads from the brain — brain names, the questions asked, note titles,
summaries, claims and sources, the rules in force, opened notes in full — and
what it writes, automatically at the start of every conversation and without
asking each time it records; that company is in the United States. So the
connect screen names who receives it and how to reach them, what it is used for
(that company's model training included, as the app's own settings allow) and
how long it is kept, and asks for two ticks: one to the provision to that
company, one to the transfer abroad. Without both the app is not connected, and
nothing else changes; to connect, the user starts again from the app and ticks
both. If the screen says the notice changed, the user reloads it (or starts
again from the app) and approves again. A program on their own computer (a
connector redirecting to 127.0.0.1 or localhost) asks for no tick — what it
sends onward follows that program's own terms. An app whose recipient
memgineering has no notice for is refused (`unknown_connector_recipient`):
suggest Claude or Gemini.

**`logout --all` is "disconnect everything".** It ends every brain token on
the account (every machine, ChatGPT and Claude connections, the website), and
anything approved before that moment — a sign-in nobody collected yet, a half-
finished connection — can no longer finish. It also ends every registry
sign-in of the same Google account. `--json` carries `registry_sessions`:
`revoked` (with a count), `not_linked`, or `unreachable` with a `hint` — on
that one, tell the user the brain side is done and relay the hint (it names
`kordis logout`). Signing in again afterwards works as usual. With nothing
signed in on this machine, it says how to do it instead: the website's button,
or `login` first.

**When the setup finishes, say what is true and no more.** Commands work
immediately — `recall`, `remember`, the session hook. What waits is the
guidance files setup just wrote: an agent reads those at the start of a
conversation, so they arrive with the next one. Do not tell the user they must
restart. (Measured: a fresh agent relayed "restart required" as fact, the user
checked, and it was not one.)

**Ask before setting policy for them.** Auto-update means the tool updates
itself: once a day, when a newer version exists, a global install starts
`memgineering update` in the background and the next run uses it (a project-local
or npx copy is never touched — it only gets the notice; nor is anything installed
from a session hook or under CI). One install runs at a time: `memgineering
update` run while a background install is going answers `update_in_progress`
and installs nothing — wait a few minutes and run it again; it reports whether
that install worked. `update_claim_stuck` means a crashed install's leftover
could not be cleared; its hint names the folder to delete. `--hook on` means note
summaries and their standing rules reach an agent unasked. Recommend both, but
they are theirs to decide.

**Error telemetry is theirs to decide too, and defaults to off.** With
`--error-telemetry on`, the CLI sends an anonymous report when it ITSELF
breaks: error kind, CLI/Node version, platform, and a sanitized message
excerpt — never note content, commands, or anything naming them, and the
server has no columns identity could land in. Unset leaves it `undecided`
(behaves as off) so a person can be asked later; a terminal `setup` asks
once; without a terminal it never prompts. Two off-switches at any time:
`memgineering setup --error-telemetry off`, or `MEMGINEERING_NO_TELEMETRY=1`
in the environment. Deleted server-side after 90 days; the full contract is
at api.memgineering.com/privacy.

**`--hook off` removes them**, it does not merely decline to add them, so it is
the answer when someone already has the callbacks and has decided they do not
want them. Only groups memgineering wrote are taken out; anything else in that
settings file is left alone.

**After setup the agent session has to restart** for the guidance to load. Say
so, or they will wonder why nothing changed.

### When it reports something it could not do

The guide lives between `<!-- memgineering-start -->` and
`<!-- memgineering-end -->`, and those markers are the only way it can be found
again. Two outcomes are worth recognising:

- **`N file(s) could not be written`** — a guide setup wrote is still in that
  file with its markers gone, or a settings file is not valid JSON. Everything
  else in that run WAS applied; the exit code is non-zero so the one skipped
  file is not mistaken for a clean install. Put the markers back around the
  block, or delete the block, then run setup again. Never append a second copy
  by hand: two guides means both are in the user's context every session.
- **`Appended below an unmarked guide`** — the same shape, on a file setup has
  no record of writing, so it installed rather than refusing. Look at the file:
  if an older unmarked copy is now sitting above the new block, delete that copy.
  If those lines are the user's own writing, nothing is wrong.
- **`Replaced N file(s) you had edited`** — the bytes on disk were not the ones
  setup last wrote, so someone's own words were just overwritten. setup owns
  those files and an upgrade has to replace them; what belongs to the user goes
  OUTSIDE the markers, where nothing touches it. Ordinary upgrades do not print
  this.

The hooks go to Claude Code and Codex, and only there. Codex asks the user to
review new hooks once at the start of the next session and runs neither until
they answer — **tell them the key: `t` trusts them.** Measured on Codex
0.149.1: both hooks show `Installed 1 / Active 0` until that panel is
answered, and the trust is recorded per hook CONTENT
(`[hooks.state."<path>:<event>:0:0"] trusted_hash`) in `~/.codex/config.toml`,
so an upgrade that changes a hook asks again. Somebody who is not told this
reads the silence as an install that did not take.

**An update brings the hooks along.** The first `resurface` (session start)
after an update — or the next command anybody types — replaces memgineering's
own hook commands with the new version's, in both Claude Code and Codex, and
says so once. It replaces only a command memgineering itself shipped: a hook
someone edited (an absolute path, say), a removed hook, a symlinked or
unreadable settings file are left exactly as they are, and the last two are
named once. When a Codex hook changed this way, Codex asks for the review
above again at its next start — relay that, with the key.

Grok is the case worth knowing, because the obvious guess is wrong: it has
hooks, more events than either of those two, and `~/.grok/hooks/` needs no
trust prompt — but a hook there cannot say anything to the model. Measured
three ways on 1.0.3, each with a value the session could not have known:
`PreToolUse` with `additionalContext`, `SessionStart` stdout, and
`UserPromptSubmit` with `additionalContext`. All three hooks ran; none of the
three arrived. Its own docs agree — `PreToolUse` reads `decision`/`deny`, and
"every other event is passive". So Grok gets the guide and the skills, which do
reach it, and nothing that would spawn a process to talk to nobody.

On Grok and Antigravity, run `memgineering resurface` yourself when you start
work in a folder, and `memgineering rules` before you change anything — that is
the same job the hooks do elsewhere, done by hand.

### The screen, in more detail

```
memgineering setup --web         # the default: a page in their own browser
memgineering setup --web --print-url    # no browser here — hand over the link
memgineering setup --human       # checkbox screen in your terminal, no browser
```

The page is on memgineering.com, not on this machine — the same site, the same
sign-in, the same design. So a person who is already signed in there is
recognised, and the sign-in they do on that screen is the ONLY one the whole
install asks for. **Do not run `login` first**; it adds an approval to a flow
that no longer needs one.

**The command returns; the screen does not.** With nobody watching a terminal
(you, a pipe, a CI job) the waiting half detaches and keeps going after your
command exits, so a slow reader cannot time your call out. `--wait` forces the
old behaviour of blocking until the screen is answered, for a script that
genuinely wants it.

It covers step 2 as well, with the same disclosure `link --dry-run` prints —
including, for someone who already keeps notes on this machine, the option to
carry that folder up to the account. Folder names are sent only after the
screen asks for them, and never their contents.

## 2. Connect a brain

Signed in — the default — a brain belongs on the account, where every machine
and every tool they use reads the same one. Three openings; run
`memgineering brains` first to learn which one you are in:

**The account already holds brains** — list, ask which, point:

```
memgineering brains                     # what it holds, with note counts
memgineering use --brain work           # nothing is uploaded by switching
```

**The account holds nothing and there are no notes here** — make one:

```
memgineering create work --user "Rayul" --language Korean --about "one line"
```

Agree the NAME with the user first, and ask the three base questions in their
language — what to call them, which language to answer in, one line about who
they are. Every flag except the name is optional: leave out what they do not
want to say. `create` makes the brain on the account, writes the six starter
notes, records those answers as real content, points this machine at it, and
its output says how many base files are still empty templates —
`memgineering onboard` prints what to ask for the rest, and it now reaches a
hosted brain too. Its `--json` may also report `missing`: base notes the brain
does not hold at all, with a `missing_hint` naming the way to put them there —
never a revise instruction that cannot succeed.

A name the account already holds is refused with nothing written — `use
--brain <name>` points at it instead, or agree a different name. The one
exception is a brain holding nothing but its own untouched scaffolding: that
is an interrupted `create`, and running the same command again finishes it.

### Renaming and deleting a hosted brain

**A wrongly-named brain is a rename, not a delete.** `memgineering rename
<new name>` changes what the brain this machine reads is called, in place —
notes, ledger and id untouched; `--brain <name-or-id>` renames another one.
Other machines pick the new name up on their own next command; nothing on
them breaks, because pointers hold the id. Never create a second brain to
fix a name.

`memgineering delete-brain <name-or-id> --confirm "<exact name>"` is the
destructive one: the brain, every note in it, its ledger and its
measurements, gone from the server, not recoverable. Run it ONLY when the
person has explicitly asked for THIS brain to be deleted, and take the
confirm name from what they said — never type it for them from a listing to
tidy an account up. Without `--confirm` in a real terminal it asks the
person to retype the brain's name; with no terminal it refuses rather than
deciding. `unlink --brain` is the gentle sibling: it only stops this machine
reading a brain and deletes nothing.

### Deleting the whole account

`memgineering delete-account --confirm "delete my account"` deletes the
hosted brain account (every brain on it, every note, every token) and the
registry account the same Google sign-in made (profile, stars, follows,
comment text, sign-ins; the account is renamed `deleted-…`, and its
published packages and versions stay at their existing addresses), in that
order, then signs this machine out. Nothing comes back. Run it ONLY
when the person has explicitly asked for their account to be deleted, and
pass the sentence exactly as written; without `--confirm` in a real terminal
it asks them to type it, and with no terminal it refuses rather than
deciding. There is no dry run.

A person with no terminal can delete the same two accounts on the website:
signed in at memgineering.com/brain, the "Delete my account" section at the
bottom of the page, confirmed with one tick (there is no sentence to type). Point
them there when they ask; you cannot press it for them. A deletion that stopped
half way is finished from the same page ("Finish deleting"). A Google account
that never opened a brain can delete its registry account from the same page too:
signed in, the consent screen shows a "Delete my account" section below the terms,
with the same single tick. Only an account that never signed in with Google, and a
brain account whose terms were never accepted, are deleted by mail to
support@memgineering.com.

- **Before deleting anything** it checks both sign-ins work and belong to one
  person: the two accounts' emails, or — when either account has no email on
  record — this machine's registry sign-in, which the brain sign-in issued. `--json` says which in `matched`. Different people answer
  `account_mismatch` and nothing is deleted.
- **It refuses rather than deleting half**: a machine signed in to a brain
  with no registry half answers `not_linked` (`memgineering logout`, then
  `memgineering login`, links it). A machine signed in to nothing answers
  `not_signed_in`: a brain kept in a folder has no account, and this command
  never touches folders on this disk.
- **Stopped halfway** — `account_partly_deleted` means the brain account is
  gone and the registry account is not. Tell the person exactly that, then
  run the same command again: it skips the brain and finishes the registry.
- Somebody who cannot sign in, or whose account never used Google, writes to
  support@memgineering.com from the address on the account.

**They already keep notes in a folder on this machine** — carry them up
instead of starting empty:

```
memgineering push --brain work          # folder → account; deletes nothing local
memgineering reindex                    # makes the moved notes searchable by meaning
```

### Migrating notes that were never memgineering notes

`push` carries files; it does not turn prose into memory. After a migration,
offer — do not sweep — a pass over the notes they actually care about: ask
WHICH matter, `memgineering open` each, then
`memgineering revise <path> --action reinforce --claim "<one factual line the
note itself contains>" --summary "<what recall should show>"`. Never write a
claim the note does not contain: a guessed fact recalled later is
indistinguishable from something they said. One `reindex` at the end covers
the whole batch.

### Machine-only (they chose `--no-login`)

**They already keep notes somewhere:**

```
memgineering link ~/notes
```

Prints exactly what would be indexed and what would be refused — with samples of
the real lines that would be stored — then asks. **Run it and stop.** Do not
pass `--yes` for them: that screen is the one moment they decide what this tool
may read.

With no terminal attached it says so rather than assuming no. Then show them
`memgineering link <path> --dry-run` — same disclosure, writes nothing — wait
for a real yes, and only then run with `--yes`.

**Tell them one thing before they answer:** the title and first paragraph of
every listed note gets stored outside the folder, and with the session-start
hook on, a few of those summaries reach every new session unasked. Anything they
would not want in either place goes in `.memgdeny` at the top of the folder, one
path per line, no wildcards:

```
30_personal/medical.md
journal/                 (a trailing slash covers a whole folder)
```

A `.memgdeny` line matching no file is refused on purpose — a rule with a wrong
path protects nothing.

**They have no notes yet:**

```
memgineering init ~/brain
```

Creates the layout and links it. Tell them to fill in `01_BASE/USER.md` and
leave the rest; the folders are there for when they are needed, not as homework.

### Several brains

Normal — one of their own, a shared folder, one per project. Which one answers is
decided in this order: `--vault <path>` → a `.memgineering` pointer found by
walking up → the brain the cwd is inside → the only one linked → their default.

```
memgineering use ~/brains/work          # bind this directory to one brain
memgineering use --default ~/brains/work
```

Inside a repository `use` writes a relative path, so it can be committed and
resolves for a teammate who links the same brain.

### Which project a folder is

```
memgineering project                    # what this folder answers to, and how it was decided
memgineering project acme/site          # bind a name of your own to this repository
memgineering project --unset            # back to the derived name
```

Derived without asking: the git remote's `owner/repo`, else the checkout's
folder name, else nothing — a folder outside any repository names no project
until somebody sets one. The name follows the repository, so worktrees and
subfolders of one checkout answer the same. It is what `remember` stamps as a
note's scope and what the reads send as `asked_from`, so a hosted resurface
can rank what was asked about here — as a name; the folder's path never
leaves the machine. Renaming does not move history: what was recalled under
the old name stays recorded there and the new name starts fresh, which the
command says out loud whenever it changes anything.

**An account can hold several hosted brains. `brains` lists them and
`use --brain <name>` switches.**

```
memgineering brains                     # what the account holds, and which one this machine reads
memgineering use --brain work           # name or id; nothing is uploaded
```

**Run `brains` before you switch, not after a guess.** It carries a note count
and a creation date, which is what tells two brains apart when their names do
not — and it marks the one this machine currently reads. `--json` puts that id
at the top level as `current`, so you do not have to scan the array to answer
the question you most often have. An absent `note_count` is `null` and not `0`:
zero notes is an empty brain, and no count is a server too old to send one.

It moves the one hosted brain this machine reads and touches no notes — `push`
and `pull` are what move those. It does not create: an unknown name is refused
with the account's list, because pointing at a brain that does not exist would
have every recall answer from an empty one, and from the outside that looks like
the notes are gone. Making a NEW brain is `create <name>` (empty, scaffolded)
or `push --brain <name>` (filled from a folder) — both point this machine at
the result on their own.

It refuses a folder path, `--default` or `--here` in the same call. Those bind a
folder; this is one setting for the whole machine.

**Do not give up on a write because the choice is ambiguous.** A refused
`remember` means the thing they asked you to keep was not kept — ask which
brain, or pass `--vault` for the write and settle the default afterwards.

## Checking it worked

```
memgineering recall "anything"     # should answer, even if with "nothing matched"
memgineering log                   # what this brain has recorded
```

## Asking where things stand, without changing them

There is no `status` verb. Three read-only questions cover it, and none of them
writes anything:

```
memgineering setup --agent --dry-run   # which tools are installed, what would change
memgineering whoami                    # which account this machine is signed in as
memgineering use                       # which brain answers recall and takes writes
```

**`use` is the one to run before believing anything about where a note went.**
Signed in and pointed at a hosted brain, it names that brain — where `recall`
reads and every write lands — and then the folder on this disk, which `--local`
reaches and which the before-edit hook reads.

Pointed at one with no sign-in here (what `logout` leaves: token cleared,
pointer kept), it names the **folder** first, because that is genuinely where
the next write goes — nothing refuses, it falls through to the local brain.

The third state is a sign-in left waiting by `login --emit-only`: it names the
folder AND the waiting sign-in, because until somebody approves it the next
command's claim is refused and the write lands in the folder — and once approved
that same claim succeeds and everything goes to the hosted brain.

In `--json`, read **`destination`**: `"hosted"`, `"local"`, or `"pending"`.
`"pending"` is not a hedge — a sign-in waiting for approval lands writes in
`brain` until somebody approves it and in the hosted brain after, and this
command will not open a browser to find out which. Do not read
`hosted.signed_in` for this: it is `false` for both the logged-out and the
waiting state, and those go to different places. It reads state off the disk, so
it answers with the server down and never finishes a sign-in just for being
asked.

`setup --agent --dry-run` is the one worth naming out loud, because the answer to
"am I installed" lives behind a verb that otherwise installs. A tester who wanted
the answer either avoided `setup` and had no answer, or ran it without
`--dry-run`. It writes nothing at all — it reports.

The hook itself is `memgineering guard`, deliberately absent from `--help`: it
reads a PreToolUse payload on stdin and does nothing without one, so listing it
would put "run this" in front of an agent for a command that cannot work when
run. If a hook is misbehaving, that is the name to look for in the tool's hook
config — not a command to invoke by hand.

## Moving a brain between this machine and their account

```
memgineering push                    # this folder → their account
memgineering pull ~/my-brain         # their account → a folder here
```

Both are safe to run twice and careful in opposite directions: **`push` never
deletes anything locally, `pull` never overwrites anything locally.** Whatever
was already there is left alone and counted, so an interrupted transfer finishes
by running the same command again. `--dry-run` on either lists what would move.

Reach for `pull` when they want a backup, are moving machines, or ask where
their memory actually lives. **Say what it brings**: notes the brain excludes
from recall come down too — excluded means "stop reading this", not "this is no
longer yours" — along with `.memgignore`. Readable files in a folder is not
something to let them discover later.

**One `pull` is one brain, not one account.** If the output names other hosted
brains (`other_brains` in `--json`), this folder is not their memory — it is part
of it. Run `pull --brain <name> <folder>` for each before telling them anything
is backed up. A partial backup nobody knows is partial is worse than one that
failed.

What lands is markdown, not yet a brain here. Offer `memgineering link <folder>`
as a next step rather than running it.

### What a hosted brain does that a folder does not

Every verb works on either kind now, consolidation included. Three things are
only true of a hosted brain.

**A chat app with no shell can reach it** — through the connector at the top of
this file. A folder brain is reached only by tools that can run `memgineering`.

**Meaning is searched, if a model is configured for it.** That is what lets an
English question reach a Korean note. It needs `BRAIN_EMBEDDING_URL` and
`BRAIN_EMBEDDING_MODEL` set on the server; with neither, the brain searches text
and says so. Recall reports which happened — `semantic: "used"` or `"skipped"`
with a reason — so if somebody expected meaning-based matching and did not get
it, read that field before guessing. A brain in a folder always searches text
and needs no model anywhere; that is a decision, not a gap.

**Its indexes live on the server.** Nothing to install and nothing to rebuild
by hand in the ordinary case — writes keep the index in step on their own.
`memgineering reindex` reaches either kind of brain: on a hosted one it backfills
what is missing and clears stored rows for notes the brain has since been told
not to read, reporting both; `--local` forces the folder brain. On a brain in a
FOLDER it also names what it left out — notes a deny name, a `.memgignore` rule
or a symlink kept from the index, any folder a rule excluded whole, and any other
symlink, which is never followed — so "3 notes rebuilt" is never the whole
answer when a fourth was dropped. A hosted reindex cannot say that: the rules are
applied on the machine that pushed, so the server only ever saw what arrived.

Under `--json` that is `not_indexed` with `denied_by_name`, `denied_explicitly`,
`excluded_by_rule`, `skipped_symlinks`, `excluded_folders` and
`skipped_other_symlinks`. **Read the count together with the last two**: a rule
that names a folder stops the walk at the folder, and a symlink is never
followed, so the notes in such a folder are never counted — `not_indexed: 0`
beside a non-empty `excluded_folders` or `skipped_other_symlinks` means the count
is a floor, not the answer. `push` reports the same set with its total under
`not_sent`. A `recall` that brings back nothing the user wrote — no cards, or
only templates — counts the same set by reason in both modes (beside notes it
did search, only when a note is among them) and prints this command, never a
path; what to tell the user then is in `memgineering-recall`.
`--rebuild`
exists for one situation only, where an embedding model changed the shape of its
answers without changing its name and the index has to be laid down again.

## Turning things off

```
memgineering setup --agent --auto-update off   # the hook stays as this machine recorded it
memgineering unlink            # stop reading a brain; notes untouched
memgineering unlink --purge    # also delete the local index and undo snapshots
```

`MEMGINEERING_NO_UPDATE=1` skips the update check for a single run without
changing the setting.
