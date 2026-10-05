# 💸 Expense Tracker

A colorful, playful expense tracker built with React. Add income and expenses, watch your balance update instantly, and play with an interactive animated background that reacts to your mouse.

**🔗 Live demo:** https://jeet-4u.github.io/expense-tracker/

<!-- Add a screenshot: upload an image to the repo (e.g. screenshot.png) and uncomment the line below -->
<!-- ![Expense Tracker screenshot](screenshot.png) -->

## Features

- Add income (positive amount) and expenses (negative amount) with a short label
- Live balance, total income, and total expense
- Transaction history, with a delete button that appears on hover
- Interactive canvas background with five animation modes you can switch between:
  - 🎉 **Confetti**: shapes flee your cursor, click to burst them outward
  - 🧲 **Magnet**: shapes are pulled toward your cursor
  - 🌀 **Swirl**: shapes orbit around your cursor
  - ✨ **Trail**: your cursor leaves sparkles, click for a firework
  - 🌸 **Stems**: a field of flowers that bend away from your cursor
- Respects reduced-motion settings and works with touch

## Built with

- [React](https://react.dev/) (Create React App)
- Context API with a reducer for state management
- HTML canvas for the background animation
- GitHub Actions and GitHub Pages for automatic deployment

## Project structure

```
src/
  components/   Header, Balance, IncomeExpenses, TransactionList,
                Transaction, AddTransaction, Background
  context/      GlobalState (provider) and AppReducer
  App.js
  App_2.css     styles
public/         index.html, icons, manifest
```

## Run locally

```bash
git clone https://github.com/jeet-4u/expense-tracker.git
cd expense-tracker
npm install
npm start
```

Then open http://localhost:3000.

## Deployment

Every push to `main` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the app and publishes it to GitHub Pages.

## Author

Made by [Jeet Mohanty](https://github.com/jeet-4u).
