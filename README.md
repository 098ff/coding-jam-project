# 🎭 AI Character Chat (MMV)

A lightweight conversational sandbox where you can bring any character concept to life and instantly test their boundaries in a 5-turn interaction constrained by what they would never say.

---

## 🚀 What It Does
- **Character Creator**: Quickly define a character by name, a one-paragraph personality description, and a single forbidden word/phrase that they'd never say.
- **Conversational Sandbox**: Engage in a back-and-forth chat with the character.
- **Strict Boundary Guardrails**: Uses a dual-layered filter (Gemini system instructions + local verification) to ensure the character never leaks the forbidden term.
- **Boundary Glow**: Visual feedback (a pulsing cyan aura) appears when the character successfully resists saying their forbidden phrase under user baiting.
- **Interaction Limit**: Sessions are strictly limited to 5 turns to keep interaction crisp and focused.

---

## 🛠️ Getting Started

### Prerequisites
- Python 3.11 or newer
- [uv](https://github.com/astral-sh/uv) (for ultra-fast dependency management)

### Installation
1. Clone this repository to your local machine.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Sync the virtual environment and dependencies:
   ```bash
   uv sync
   ```
4. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and replace `your_gemini_api_key_here` with your actual **Gemini API key** from Google AI Studio.

---

## 💻 Running the App

### Starting the Development Server
From the `backend` directory, run:
```bash
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Once the server starts, open your browser and navigate to:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### Running the Tests
To run the automated unit and integration tests:
```bash
uv run pytest -v
```

---

## 📖 System Design & Source of Truth
The architecture, user experience, and design goals of this project are documented and preserved in three key design documents located in the project root:
- [product.md](file:///Users/098f/Desktop/coding-jam-project/product.md) — Product requirements, target users, magical moments, and project scope.
- [ui.md](file:///Users/098f/Desktop/coding-jam-project/ui.md) — Interface specifications, component layouts, edge states, and user journeys.
- [engineering.md](file:///Users/098f/Desktop/coding-jam-project/engineering.md) — System architecture, API endpoints, testing strategy, and technical trade-offs.
