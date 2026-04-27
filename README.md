# CASHLINE — Startup Runway Calculator

> "Your Cash Has a Heartbeat. Know When It Flatlines."

## 🌐 Live Demo
[Click here to try CASHLINE](https://cash-line.vercel.app/)

---

## 💡 What is CASHLINE?
CASHLINE is a financial health monitor for startup 
founders. Just like a hospital monitor tracks your 
heartbeat, CASHLINE tracks your startup's runway 
and tells you exactly when your cash hits zero.

---

## 🎯 Why I Built It This Way
Most runway calculators just show a number. 
I wanted CASHLINE to feel urgent and alive.

I chose the heartbeat metaphor because:
- Cash is the lifeblood of a startup
- When it flatlines, the startup dies
- Founders need to FEEL the urgency, not just see a number

The heartbeat animation changes speed based on 
danger level — slow when safe, rapid when critical.
This makes the danger feel real and immediate.

---

## ✨ Features
- 🫀 Live heartbeat monitor that reacts to danger level
- 📅 Exact "Zero Day" date — know exactly when cash hits zero
- 📊 Cash depletion chart showing month by month breakdown
- 💰 Expense breakdown calculator with auto sum
- 🚨 Three danger states — Healthy, Warning, Critical
- 💡 Smart contextual survival tips
- ✂️ Cost cutting suggestions to extend runway
- 📱 Fully mobile responsive
- 🌙 Dark theme throughout

---

## 🎨 Design Decisions

### Dark Theme
Founders work late at night. A dark theme 
feels natural and reduces eye strain during 
those late planning sessions.

### Three Color States
- 🟢 Green #00ff88 → 6+ months → Healthy
- 🟡 Amber #ffbb00 → 3-6 months → Warning  
- 🔴 Red #ff3333 → under 3 months → Critical

### Heartbeat Animation
The animation speed changes with danger level:
- Safe → Slow and steady pulse
- Warning → Medium pace
- Critical → Rapid and urgent

### Collapsible Expense Breakdown
Hidden by default to keep the UI clean.
Founders who know their burn rate can skip it.
Founders who need help calculating it can expand it.

### Currency Formatting
All numbers use Indian currency format (₹)
with proper comma placement for readability.

---

## 🛠️ Tech Stack
- HTML — Structure and layout
- Tailwind CSS (CDN) — Styling and responsiveness
- Vanilla JavaScript — Logic and animations
- Chart.js (CDN) — Cash depletion chart

No frameworks. No installation. No build step.
Just open and use.

---

## 📁 Project Structure
