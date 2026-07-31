<div align="center">

<h1>
  <img src="./public/logo.png" alt="Atlas Munich Logo" height="42" style="vertical-align: middle; border-radius: 8px; margin-right: 8px;" />
  <span style="vertical-align: middle;">Atlas Munich</span>
</h1>

**Your Complete Guide to Thriving in Munich**

![Atlas Munich Screenshot](./public/atlas.png)

Built by Hamza Chaouki, for the Moroccan community. Everything you need to navigate life in Munich — from your first Anmeldung to finding the best tajine in town.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🌐 Live Demo](https://atlasmunich.de) · [📖 Documentation](#features) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Internationalization](#internationalization)
- [Contributing](#contributing)
- [License](#license)

## 🌍 About

Atlas Munich is a comprehensive web platform designed to help members of the Moroccan community navigate life in Munich, Germany. Whether you're a newcomer or a long-time resident, this guide provides essential information about:

- 🏠 **Housing & Registration** - Finding accommodation and completing bureaucratic procedures
- 🍽️ **Food & Dining** - Discovering halal restaurants and Moroccan cuisine
- 📚 **Practical Guides** - Step-by-step tutorials for common tasks
- 🗺️ **Places & Services** - Community-recommended locations
- ❓ **FAQs** - Answers to frequently asked questions
- 💬 **AI Chat Guides** - Persona-driven assistants for housing, bureaucracy, academics, and healthcare

## ✨ Features

- **🌐 Multilingual Support** - Available in English, French, and German
- **🔍 Smart Search** - Fuzzy search powered by Fuse.js to find guides quickly
- **🗺️ Interactive Maps** - Explore places with Leaflet.js integration
- **📱 Responsive Design** - Beautiful, modern UI that works on all devices
- **🌓 Dark Mode** - Eye-friendly theme switching with next-themes
- **♿ Accessible** - Built with accessibility in mind using Radix UI components
- **⚡ Lightning Fast** - Optimized with Next.js 16 and Turbopack
- **🎨 Modern UI** - Styled with Tailwind CSS and shadcn/ui components
- **🧹 Clean Code** - Automated linting, formatting, and pre-commit hooks

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Maps:** [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Search:** [Fuse.js](https://fusejs.io/)
- **Content:** [react-markdown](https://github.com/remarkjs/react-markdown)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Code Quality:** ESLint, Prettier, Husky, lint-staged

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** and npm/yarn/pnpm
- **Git** for version control

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/HamzaChx/Atlas-Munich.git
cd Atlas-Munich
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
npm run dev           # Start development server with Turbopack
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## 🧹 Code Quality & Linting

This project uses automated tools to maintain code quality and consistency:

### **Tools**

- **ESLint** - Identifies and fixes code quality issues
- **Prettier** - Enforces consistent code formatting
- **Husky** - Manages git hooks for automation
- **lint-staged** - Runs linters on staged files only (fast!)

### **Automated Workflow**

#### **During Development**

- **Format on Save** - VS Code auto-formats files when you save (if you have Prettier extension)
- **ESLint Auto-fix** - Unused imports are removed automatically on save

#### **Before Commit (Pre-commit Hook)**

When you run `git commit`, the following happens automatically:

1. **ESLint** runs on staged `.ts`, `.tsx`, `.js`, `.jsx` files
   - Removes unused imports
   - Fixes auto-fixable issues
   - Reports remaining errors
2. **Prettier** formats staged files
3. **Commit blocked** if there are unfixable errors

### **Manual Commands**

```bash
# Fix all linting issues in the codebase
npm run lint:fix

# Format all files
npm run format

# Check if files are properly formatted (CI/CD)
npm run format:check
```

### **First-Time Setup**

After cloning, Husky is automatically initialized via the `prepare` script. The pre-commit hook is ready to use immediately.

### **VS Code Setup (Recommended)**

Install the recommended extensions when prompted:

- **Prettier** - Code formatter
- **ESLint** - Linting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete

Settings are pre-configured in [.vscode/settings.json](.vscode/settings.json).

## 📁 Project Structure

```
Atlas-Munich/
├── src/
│   ├── app/              # Next.js app directory (pages & routes)
│   │   ├── about/        # About page
│   │   ├── category/     # Category pages
│   │   ├── faq/          # FAQ page
│   │   ├── guides/       # Guides listing & individual guides
│   │   ├── places/       # Places listing
│   │   └── search/       # Search page
│   ├── components/       # React components
│   │   ├── home/         # Home page specific components
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   ├── shared/       # Shared/reusable components
│   │   └── ui/           # shadcn/ui components
│   ├── data/             # Static data (guides, places, categories, etc.)
│   ├── i18n/             # Internationalization configuration
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── messages/             # Translation files (en, de, fr)
├── public/               # Static assets
└── ...config files
```

## 🌐 Internationalization

The project supports three languages:

- 🇬🇧 English (`en`)
- 🇫🇷 French (`fr`)
- 🇩🇪 German (`de`)

Translation files are located in the `messages/` directory. To add or update translations, edit the corresponding JSON file.

A Moroccan Arabic (Darija) locale is on the roadmap but not implemented yet.

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### **Quick Contribution Guide**

1. **Fork & Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Atlas-Munich.git
   cd Atlas-Munich
   npm install
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing patterns and conventions
   - The pre-commit hook will auto-format and lint your code

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

   The pre-commit hook will automatically:
   - Fix linting issues
   - Format your code
   - Remove unused imports

5. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

### **Contribution Tips**

- **Small PRs** - Focus on one feature/fix at a time
- **Clear Commits** - Use descriptive commit messages
- **Test Locally** - Run `npm run dev` and test your changes
- **Check Build** - Run `npm run build` to ensure it builds successfully

The automated tools will help keep your code clean, so focus on solving the problem!

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 💬 Contact

Project Link: [https://github.com/HamzaChx/Atlas-Munich](https://github.com/HamzaChx/Atlas-Munich)
