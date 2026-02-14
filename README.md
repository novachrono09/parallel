# 🌀 P A R A L L E L

> **Explore the lives you never lived.**

![Parallel App Demo](/public/app-screenshots/SS-2.jpg)
*(Replace this link with your actual screenshot)*

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pollinations API](https://img.shields.io/badge/AI-Pollinations-ff00ff?style=for-the-badge)](https://pollinations.ai/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[**View Live Demo**](YOUR_VERCEL_LINK_HERE)

</div>

---

## 📖 About

**Parallel** is not just an AI wrapper; it is an engine for introspection.

Every major decision creates a split in reality. A road taken, and a road left behind. This application allows users to simulate those unchosen paths. By combining the **Pollinations.ai Text API** with a deep simulation engine, Parallel generates three distinct, year-by-year timelines of your alternate future—complete with career shifts, emotional arcs, and life-defining moments.

It is designed to be calm, reflective, and deeply personal.

## ✨ Key Features

-   **🔮 Triple Timeline Simulation:** Generates three distinct alternate realities (The Practical Path, The Bold Risk, The Unconventional Turn) based on a single input.
-   **🌿 Branch Deeper:** Interactive storytelling allows you to click any specific event in a timeline and ask *"What if I made a different choice here?"* to spawn new sub-timelines.
-   **📊 Emotional Analytics:** Visual comparison of "Happiness," "Wealth," and "Growth" scores across all three realities.
-   **💾 Local History:** Automatically saves your past simulations to the browser, creating a personal journal of "what ifs."
-   **🎨 Editorial Design:** A rejection of "cyberpunk/neon" tropes in favor of a warm, sophisticated, typographic-led aesthetic using Earth tones and dark charcoal backgrounds.

## 🛠️ Tech Stack

-   **Framework:** React + Vite
-   **Styling:** Tailwind CSS (Custom configuration for typography and palettes)
-   **Animations:** Framer Motion (Orchestrated timeline reveals)
-   **AI Engine:** [Pollinations.ai](https://pollinations.ai/) (Free, keyless text generation)
-   **Persistence:** LocalStorage API

## 🎨 Design Philosophy

Parallel was built with a specific mood in mind: **"The Digital Journal."**

Most AI apps use bright neon gradients and dark cold modes. Parallel uses:
-   **Warm Dark Mode:** Backgrounds are `#0a0a0a` with hints of warmth, not pitch black.
-   **Typography:** Serif headings for an editorial, magazine feel.
-   **Palette:** Terracotta, Sage, and Muted Blue to represent different emotional states.
-   **Atmosphere:** Calm, slow-fade animations that encourage reading and reflection.

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/parallel.git
    cd parallel
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run locally**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🧠 AI Integration

This project uses **Pollinations.ai** for all text generation. It requires no API keys.

The integration handles:
-   **JSON Enforcement:** Strict prompt engineering to ensure the LLM returns structured data for the timeline visualization.
-   **Markdown Cleaning:** Robust parsing logic to strip code fences and handle raw text responses.
-   **Retry Logic:** Automatic retry mechanisms to ensure a smooth user experience even if the AI hiccups.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with 🖤 and 🌀 by Novachrono<p>
  <p>Powered by <a href="https://pollinations.ai">Pollinations.ai</a></p>
</div>