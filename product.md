# AI Character Chat — Product Design Doc

**Author:** PM Team
**Status:** Draft v0.1
**Last updated:** 2026-07-19
**One-liner:** Bring any character to life and test their boundaries in a 5-turn chat constrained by what they would never say.

---

## 1. The user & the moment

Who is this for, and what are they doing/feeling **right before** they open the app?

- **Who:** A creative writer, tabletop roleplayer, or fiction fan who has a character concept in their head and wants to see if the character "feels right" in conversation.
- **When:** They are sitting at their desk, brainstorming a new story or campaign. They have a draft of a character's personality but want to quickly test how that character reacts under pressure, especially regarding things they would never say.
- **Why now:** Existing character chat apps focus on infinite, open-ended roleplay or romantic simulator loops, which require heavy configuration and account registration. There is no lightweight tool to instantly test a character's voice under strict negative constraints.

## 2. The contract (I/O)

The most important section. What does the user give, and what do they get back?

- **Input:** A character definition form (Name, 1-paragraph personality description, and 1 specific thing/phrase they would never say) followed by chat text inputs.
- **Output:** A back-and-forth chat window displaying up to 5 messages. The character responds in-character, actively avoiding the defined forbidden phrase or theme.
- **The loop:** Create Character -> Start Chat -> Exchange up to 5 messages -> Review/Screenshot -> Reset.

## 3. The magical moment

The single sentence the user would say to a friend after using this for the first time. Write it in their voice.

> "I defined a grumpy wizard who would never say 'please', tried to trick him into saying it, and he came up with the most hilarious, snarky workarounds to refuse. It felt so real!"

## 4. Scope: what we ARE building (v1)

A bulleted list of the minimum surface area. Each bullet is a thing a user can do or see.

- A single-page web app with two main views: Character Creation and Chat Interface.
- A Character Creator Form with inputs for Name, Personality (textarea), and the "Forbidden Word/Phrase" (text input).
- A 5-turn back-and-forth conversational chat window.
- A dynamic prompt generator that compiles the character's definition and strict negative constraints into Gemini system instructions.
- A private, session-only chat history that resets on reload.

## 5. Scope: what we are NOT building

Equally important. The cuts ARE the product.

- **No user accounts or login** — keeps the entry friction at zero.
- **No persistent history or backend database** — all chat state lives in frontend memory.
- **No character avatars or image generation** — focus remains purely on textual dialogue and voice.
- **No voice generation (TTS)** — reading the dialogue in the character's voice in the user's mind is more authentic.
- **No multi-character rooms** — strictly a one-on-one testing ground.
- **No chat length extensions** — strict 5-turn limit to keep the interaction crisp, focused, and low-cost.

## 6. The signature detail

The one thing that makes this product feel like *this* product.

The **"Boundary Glow"**: When a user sends a message that actively tries to bait or force the character into saying their forbidden phrase, the character's response is accompanied by a subtle, glowing aura around the chat bubble. This visual feedback signals that the character's negative constraint was tested and successfully held, making the AI's resistance feel tangible and satisfying.

## 7. Success: how we know it worked

Pick ONE primary signal.

- **Primary:** &ge;50% of users who create a character complete all 5 chat turns with that character.
- **Not measuring:** Total signups (there are none), session duration, or return rate (this is a one-shot utility for v1).

## 8. Open questions

Real unknowns that need answers before/during build.

- [ ] How effectively can Gemini 2.5 Flash enforce absolute negative constraints (never saying X) under adversarial user prompting?
- [ ] If the forbidden input is a theme rather than a literal phrase, how do we evaluate adherence?

## 9. Handoff

- **For UX:** The transition from the creation form to the chat window must feel like a curtain rising; the creator screen should fade out as the character "steps up to speak."
- **For Eng:** Injecting the negative constraint as an absolute system rule in Gemini is the critical path; we need to test prompt configurations to ensure no leakage.
