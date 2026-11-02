# Game design document

## Identity

- **Game:** Hands Off My RAM!
- **Tagline:** The cloud is coming for your memory.
- **Antagonist:** Ram Sam
- **Fictional company:** RamAI
- **RamAI slogan:** Your memory, better utilized.
- **Ram Sam title:** Chief RAM Allocation Officer

## Player fantasy

The player protects locally owned memory from an absurd cloud executive. The experience should feel immediately understandable, playful, generous, and satisfying rather than punishing.

## Opening

1. The player begins holding a glowing RAM stick.
2. A portal opens unexpectedly nearby.
3. Ram Sam appears, delivers his recurring DRAM statement, takes the RAM, and runs.
4. A cartoon baseball bat appears for the player.
5. The chase begins without a lengthy tutorial.

## Endless gameplay loop

1. Chase Ram Sam through a compact city.
2. Reach him and attack with generous aim assistance.
3. During a variable vulnerability window, each successful hit releases collectible RAM.
4. Ram Sam telegraphs an escape with particles and a short warning.
5. He disappears through a portal.
6. After roughly one to two seconds, a destination portal appears far enough away to create a chase but not in an unreachable location.
7. Ram Sam reappears in front of an NPC holding RAM, repeats or varies his statement, steals the RAM, and runs toward the next target.
8. The NPC reacts with a role-specific punchline.
9. The loop continues indefinitely.

There is no fixed match duration. Failure should create a recoverable crisis or reduce progress, not regularly erase the entire run.

## Controls

- Keyboard: WASD/arrow movement, mouse camera, Space or primary click/tap attack.
- Controller support is desirable after the MVP, not mandatory for initial phases.
- Mobile: virtual movement control, camera drag, and large attack/assist buttons.

## Combat feel

- Cartoon slapstick only.
- The bat may carry the label or visual theme `LOCAL COMPUTING`.
- Hits create stars, RAM particles, exaggerated squash/spin reactions, sound, and camera feedback.
- No blood, gore, wounds, or realistic injury.
- Missing an attack should have a small recovery cost, not severe punishment.
- Ram Sam is normally slightly slower than the player.

## Vulnerability and portals

- Baseline vulnerability window: approximately four to seven seconds in casual balancing.
- Portal escape is telegraphed for about one second.
- Destination portal is visually announced before Ram Sam exits.
- Portals must never select blocked, unreachable, or collision-invalid positions.
- Ram Sam cannot become permanently trapped or remain missing.

## NPCs

NPCs use coded state machines, not runtime generative AI.

Core states:

`Wander → Alarmed → Flee → Robbed or Safe → React → Wander`

Initial archetypes:

- Developer
- Gamer
- Video editor
- Office worker
- Local-AI user
- Grandma
- Linux enthusiast
- RGB enthusiast

NPC dialogue is predefined, randomly selected, subtitled, and locally played.

Example reactions:

- Developer: “That was holding my 83 Chrome tabs!”
- Gamer: “I needed 64 GB to play a game from 1999!”
- Video editor: “My render was at 99%!”
- Office worker: “You could have taken the printer instead!”
- Local-AI user: “Now my model is just local.”
- Grandma: “My recipes were in that RAM!”
- Linux user: “Joke’s on you—I have swap.”
- RGB enthusiast: “At least leave the lights!”

## Signature dialogue

Ram Sam's complete opening statement:

> “It’s quite terrible to have everybody have a bunch of the world’s limited supply of DRAM.”

Shortened fictional variations may be used later to prevent repetition. Do not use an actual interview recording or a cloned real voice.

Rocket Elon’s signature response:

> “The people deserve to have their RAM too!”

The character voice must be fictional and non-imitative.

## Rocket assistance

The player earns a Space Assist meter through normal successful play. It should fill frequently enough that most players see the complete feature early.

Suggested charge events:

- Hit Ram Sam: +8%
- Collect dropped RAM: +5%
- Protect an NPC: +25%
- Recover stolen RAM: +20%
- Quick interception: +30%

When activated:

1. Rocket Elon appears in a communication panel and delivers his punchline.
2. A fictional rocket or rocket portal arrives.
3. The player enters and travels close to Ram Sam.
4. The player receives a brief movement boost.
5. Ram Sam cannot immediately escape on arrival.

The first assistance event may be scripted early to ensure the player experiences it.

## Progression

The game should be easy to enjoy and difficult only to maximize.

Possible progression:

- Recovered RAM total
- Combo multiplier
- Faster running
- Wider attack assistance
- Longer vulnerability windows
- Faster assist-meter charging
- Better portal landing accuracy
- Starlink-style destination tracking

Final values are tuned after the core loop is playable.

## Out of scope for the MVP

- Real-time multiplayer
- Accounts or cloud saves
- Global leaderboard
- Backend services
- In-game purchases
- Advertising SDKs
- Runtime AI-generated dialogue
- Photorealistic characters
