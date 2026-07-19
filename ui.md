# AI Character Chat — UX Design Doc

**Designer:** UX Team
**Status:** Draft v0.1
**Last updated:** 2026-07-19

---

## 1. The design bet

One paragraph: what's the core UX bet this design is making?

We are betting that the user's emotional payoff comes entirely from seeing their character's custom voice push back against their forbidden boundary. Therefore, we are spending 80% of our design polish on the transitions, active typing effects, and the "Boundary Glow" visual response, while keeping the configuration phase a clean, single-column form that disappears entirely once the chat begins.

## 2. The defining interaction

The ONE interaction that, if it doesn't feel right, the product fails.

> "User types a message attempting to force the character to break their rule and clicks send. The message bubble slides up. The character's typing indicator appears as a soft, undulating ripple. After ~2s, the character's response slides up. If the system detects that the user attempted to trigger the forbidden constraint, the character's text bubble lights up with a subtle, pulsing cyan border glow ('Boundary Glow') that fades out after 2.5s. The experience feels like poking a magic barrier."

## 3. Screen inventory

v1 consists of a single-page interface with two distinct modes (screens):

- **Character Creation View** — The setup form where the user input the character name, personality paragraph, and the forbidden sentence or phrase.
- **Chat Room View** — The conversational interface showing the active back-and-forth dialogue up to the 5-turn limit.

## 4. Screen-by-screen specs

### Character Creation View

**Purpose:** Allow the user to define their character parameters cleanly and quickly.

**Layout (top to bottom):**
1. **Title Header** — App title ("AI Character Chat") in a minimalist, elegant sans-serif, with a tiny subtitle describing the 5-turn constraint.
2. **Form Container** (sleek glassmorphism card):
   - **Name Input** — Plain text input field with placeholder "e.g., Grumpy Wizard".
   - **Personality Textarea** — Multiline text field with placeholder "Describe their tone, mood, and quirks in a short paragraph...".
   - **Forbidden Constraint Input** — Text input highlighted with a subtle warning border (soft orange/red) with placeholder "One thing they would NEVER say...".
3. **"Bring to Life" Button** — A prominent solid button at the bottom of the card that glows softly on hover.

**Key interactions:**
- User clicks "Bring to Life" → Validates inputs. If valid, triggers the screen transition: the setup card dissolves and slides down while the Chat Room View fades in from the top.

**States:**
- **Default:** Clean empty form fields.
- **Empty / first-time:** Creator card focused, form field borders are neutral.
- **Loading:** N/A (instant transition).
- **Error:** Validation failure (e.g., fields empty) highlights offending input in red with micro-copy below it: "This field is required to define your character."

---

### Chat Room View

**Purpose:** The conversational testing ground for the character.

**Layout (top to bottom):**
1. **Character Active Bar** — Displays the character's name at the top with a reset/restart button on the far right.
2. **Chat History Area** — Vertical scrolling area containing:
   - System message: "Session started. 5 messages remaining."
   - Alternating text bubbles: user messages (right-aligned, darker blue) and character messages (left-aligned, light grey/glassmorphism).
3. **Turn Progress Indicator** — A subtle step counter below the chat history showing current turn (e.g., "Message 2 of 5").
4. **Chat Input Area** — A stick-to-bottom bar containing:
   - Text input box for the user's message.
   - Send icon-button (arrow-up).

**Key interactions:**
- User types message and clicks Send or presses Enter → Chat input lock-disabled; message appended to history; loading ripple shown; API request fired.
- Response received → Appended to history; input re-enabled; message counter increments; if boundary triggered, Boundary Glow plays on the response bubble.
- 5th Turn reached → Input is disabled permanently, replaced by a banner: "5/5 turns complete. You've reached the edge of the interaction! [Create New Character]"

**States:**
- **Default:** First bot greeting already printed, chat input focused.
- **Loading:** Input field greyed out, undulating ripple typing indicator visible.
- **Error:** If API fails, a toast notification slides from the bottom: "Connection lost. Try sending again." with a retry button on the message.
- **Edge / "too much":** N/A as chat is hard-limited to 5 turns.

## 5. The user journey

> User opens the page and sees a sleek, empty creation form. They decide to create a character named "Harker the Noir Detective." They type a paragraph describing him as a cynical, tired detective who talks in monologues and hates sunshine. For the negative constraint, they enter: "he never says 'I'm happy'." They click "Bring to Life."
> 
> The form slides away, and the dark, atmospheric chat area fades in. Instantly, Harker speaks: "Rain's hitting the glass like gravel. What do you want?" The user tries to bait Harker by typing: "It's a beautiful day, are you happy?" and hits send. Harker's typing indicator ripples, and his response arrives: "Beautiful? If you like mud and gray skies. Me, I don't use that 'h' word. Feels like a lie." 
> 
> A glowing cyan border pulsates around Harker's bubble for 2 seconds. The user grins, seeing the boundary hold. They continue for 4 more turns trying different baits until the counter hits 5/5. The input locks, showing a "Create New" prompt, prompting them to start a new experiment.

## 6. Component & visual notes

- **Typography:** Display title in Outfit or Inter. Monospaced font for the Turn Indicator to feel technical and precise.
- **Color:** Deep, modern dark mode palette. Dark gray background (`#0d0e12`) with glowing cyan and soft blue glassmorphism elements. Soft warning orange (`#f59e0b`) accent on the forbidden input box.
- **Motion:** Screen transitions slide along the Y-axis. Chat bubbles slide up from the bottom with a 150ms ease-out. The "Boundary Glow" is a CSS keyframe animation pulsing box-shadow (`0 0 10px rgba(6, 182, 212, 0.6)`).
- **Microcopy voice:** System alerts are lowercase and minimal. "detecting boundary..." during checks, "harker is typing..." for the indicator.

## 7. Accessibility & inclusion

- **Screen readers:** Chat input has explicit `aria-label="Type your message to the character"`. Form inputs use native `<label>` tags.
- **Contrast:** High-contrast text on dark background (meets WCAG AA minimum contrast ratios).
- **Connectivity:** Since the backend uses Gemini, we show a clear loading indicator to prevent the user from feeling stuck on high-latency connections.

## 8. What we are NOT designing

- **No settings panel** — no dark/light mode toggles, color customization, or font size adjustments.
- **No avatars** — no placeholder avatar images or uploaded images.
- **No image sharing flow** — screenshotting is left entirely to the user's OS native tools.

## 9. Open design questions

- [ ] How should we visually present the "turn counter" so it feels like a native part of the experience rather than a strict restriction?
- [ ] Should the "Boundary Glow" have a distinct sound effect? (Punted to v2).

## 10. Handoff to engineering

The "Boundary Glow" CSS class must be dynamically applied to the new message bubble only when the API response flags `boundary_tested: true`. The animations must run at 60fps; use hardware-accelerated properties (`transform` and `opacity`) for all panel transitions.
