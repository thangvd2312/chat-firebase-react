# Real-Time Chat App

> 🚀 Full-featured real-time chat application built with React + Firebase + Ant Design. Supports group rooms, 1-on-1 messaging, stickers/GIFs, and responsive UI.

## ✨ Features

- **🔐 Google Authentication** — Sign in with Google via Firebase Auth
- **💬 Group Chat Rooms** — Create rooms, add members, chat in groups
- **👤 Direct Messaging** — Private 1-on-1 conversations
- **👥 Friend System** — Add friends, search by name with keyword matching
- **🎨 Sticker & GIF Picker** — Rich emoji, sticker, and GIF support
- **🖼️ Image Sharing** — Upload and send images via Firebase Storage
- **📱 Responsive Design** — Collapsible sidebar for mobile, works on all screen sizes
- **🔔 Real-time Sync** — Instant message delivery via Firestore real-time listeners
- **👤 User Profile** — View user info popup with avatar and details

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Firebase project

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/thangvd2312/chat-firebase-react.git
   cd chat-firebase-react/chat-firebase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase (see [Firebase Setup](#firebase-setup))

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + Vite |
| **UI Library** | Ant Design 5 |
| **Styling** | styled-components |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Routing** | React Router v5 |
| **State** | React Context API |
| **Other** | emoji-picker-react, date-fns, axios, cheerio |

## 📦 Project Structure

```
chat-firebase/
├── src/
│   ├── components/
│   │   ├── ChatRoom/
│   │   │   ├── ChatWindow.jsx      # Main chat window with message list
│   │   │   ├── Message.jsx         # Individual message bubble
│   │   │   ├── SideBar.jsx         # Sidebar with user info + tabs
│   │   │   ├── TabsSidebar.jsx     # Rooms / Friends tabs + search
│   │   │   ├── FriendList.jsx      # Friend list + add friend modal
│   │   │   ├── UserInfo.jsx        # User profile popup
│   │   │   ├── StickerPicker.jsx   # Emoji / Sticker / GIF picker
│   │   │   └── AddFriendModal.jsx  # Add friend search dialog
│   │   ├── Modals/
│   │   │   ├── AddRoom.jsx         # Create new chat room
│   │   │   └── AddMemberToRoom.jsx # Invite members to room
│   │   └── Login/
│   │       └── index.jsx           # Google sign-in page
│   ├── context/
│   │   ├── AuthProvider.jsx        # Firebase auth context
│   │   └── AppProvider.jsx         # App-wide state (rooms, friends, etc.)
│   ├── firebase/
│   │   ├── config.js               # Firebase initialization
│   │   └── service.js              # Firestore CRUD helpers
│   ├── hooks/
│   │   ├── useFireStore.js         # Real-time Firestore data hook
│   │   └── useBlockDevTools.js     # Production devtools blocker
│   ├── styles/
│   │   └── ChatWindowStyles.js     # Styled-components for chat UI
│   ├── App.jsx                     # Main app with routing
│   └── main.jsx                    # Entry point
└── package.json
```

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)

### 2. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** (for development)

### 4. Enable Storage

1. Go to **Storage** → **Get started**
2. Start in **test mode** (for development)

### 5. Get Your Config

1. Go to **Project Settings** → **General** → **Your apps**
2. Register a web app and copy the config
3. Update `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 📊 Firestore Collections

| Collection | Description |
|-----------|-------------|
| `users` | User profiles (displayName, photoURL, friends list) |
| `rooms` | Group chat rooms (name, description, members) |
| `messages` | Group chat messages (text, sticker, image) |
| `message_single` | Direct messages between 2 users |
| `invitations` | Room member invitations |

## 🎯 How It Works

### Authentication
- Google OAuth via Firebase Auth
- User data synced to Firestore `users` collection on first login
- AuthProvider manages auth state globally

### Messaging
- **Group:** Messages stored in `messages` collection with `roomId`
- **Direct:** Messages stored in `message_single` with composite `roomId` (`uid1_uid2`)
- Real-time updates via `useFirestore` custom hook with `onSnapshot`

### Friend System
- Keyword search with permutation matching (`generateKeywords()`)
- Friends stored as array in user document
- Search returns users matching any keyword prefix

### UI Features
- **Responsive sidebar** — Collapsible on mobile (<768px) with toggle button
- **Sticker/GIF picker** — Outside click handler to close popup
- **Auto-scroll** — Message list auto-scrolls to latest message
- **Member avatars** — Avatar group with overflow counter in room header

## 🏃 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🐛 Known Issues & TODOs

- [ ] Message read/unread status
- [ ] File sharing (documents, videos)
- [ ] Voice/video calls
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Message search within conversations
- [ ] Dark mode toggle
- [ ] Push notifications
- [ ] Message edit/delete

## 📸 Screenshots

> _Coming soon — app screenshots will be added here_

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT

---

<p align="center">Made with ❤️ by <a href="https://github.com/thangvd2312">Jerry</a></p>
