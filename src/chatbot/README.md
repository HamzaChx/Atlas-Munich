# Atlas Munich Chatbot System

A modular, multi-persona chatbot system integrated into the Atlas Munich website, providing intelligent assistance across different sections.

## 🤖 Chatbot Personas

### 1. **Zellija** (Home Router)

- **Avatar**: `zellija.jpeg`
- **Section**: Home (`/`)
- **Personality**: Friendly, neutral, approachable
- **Role**: Router that welcomes users and directs them to specialist chatbots
- **Features**:
  - Navigation assistance
  - Intelligent routing to specialists
  - 5-second handoff notifications

### 2. **Hamid Chefnaj** (Guides Specialist)

- **Avatar**: `hamidChefnaj.jpeg`
- **Section**: Guides (`/guides`, `/category`, `/faq`)
- **Personality**: Funny, witty, easy to talk to
- **Role**: Expert on all Munich guides (housing, KVR, university, career)
- **Features**:
  - Access to all guide content
  - Step-by-step procedure explanations
  - Darija phrases for authentic vibes

### 3. **Jmila** (Places Specialist)

- **Avatar**: `jmila.png`
- **Section**: Places (`/places`)
- **Personality**: Smart, concise, relaxing
- **Role**: Helpful camel who knows all Munich spots
- **Features**:
  - Restaurant and food recommendations
  - Place search and filtering
  - Rating and verification info

### 4. **Hamza** (About Specialist)

- **Avatar**: `hamza.png`
- **Section**: About (`/about`)
- **Personality**: Passionate, technical, community-minded
- **Role**: Project developer who answers about Atlas Munich
- **Features**:
  - Project information and history
  - Technical stack details
  - Contribution guidance

## 🏗️ Architecture

### LLM Facade Pattern

The system uses a facade pattern with:

- **Shared foundation**: Common principles, Darija phrases, response guidelines
- **Personality sections**: Per-chatbot personality traits and behavior
- **Context sections**: Per-chatbot knowledge base and capabilities
- **Capabilities**: Specific actions each chatbot can perform

```
src/chatbot/
├── types.ts           # TypeScript definitions
├── prompt-builder.ts  # LLM facade pattern implementation
├── use-chatbot.ts     # React hook for chatbot state
├── index.ts           # Exports
└── prompts/
    └── system-prompt.xml  # XML template reference

src/components/chatbot/
├── Chatbot.tsx        # Main UI component
├── ChatbotWrapper.tsx # Client-side wrapper
└── index.ts           # Exports

src/app/api/chat/
└── route.ts           # API endpoint for Gemini
```

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 2. Add Avatar Images

Place your chatbot avatars in `public/chatbot/`:

- `zellija.jpeg` - Moroccan zellij tiles pattern
- `hamidChefnaj.jpeg` - Hamid character
- `jmila.png` - Camel character
- `hamza.png` - Developer character

### 3. Run the App

```bash
npm run dev
```

The chatbot will appear as a floating button in the bottom-right corner.

## 🎨 UI Features

- **Expandable/Collapsible**: Click the floating button to toggle
- **Overlay Design**: Sits above all content, modular and non-intrusive
- **Chatbot Tabs**: Switch between personas manually
- **Auto-routing**: Zellija automatically routes to specialists
- **Handoff Notifications**: Toast notifications during persona switches
- **Suggested Questions**: Quick-start prompts for each persona
- **Dark Mode Support**: Matches website theme
- **Mobile Responsive**: Works on all screen sizes

## 🌍 Internationalization

The chatbot responds in the user's current language:

- English (`en`)
- French (`fr`)
- German (`de`)

All responses include natural Moroccan Darija phrases regardless of language.

## 📡 API

### POST `/api/chat`

```typescript
interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  chatbotType: "zellija" | "hamid" | "jmila" | "hamza";
  locale: string;
  currentPath?: string;
}

interface ChatResponse {
  message: string;
  navigation?: {
    type: "navigate";
    path: string;
    targetChatbot: ChatbotType;
    message: string;
  };
}
```

### GET `/api/chat`

Health check endpoint returning chatbot status.

## 🎯 UX Principles

Following the project's UX philosophy:

- **Clarity**: Simple, intuitive interface
- **Speed**: Fast 150-300ms animations
- **Non-intrusive**: Overlay design, no UI changes
- **Mobile-first**: Responsive on all devices
- **Immediate feedback**: Typing indicators, loading states
- **Easy recovery**: Clear chat, switch personas

## 🔮 Future Enhancements

- [ ] Voice input support
- [ ] Message persistence (localStorage)
- [ ] Conversation export
- [ ] Multi-language Darija phrases
- [ ] More specialized personas
- [ ] Analytics and feedback
