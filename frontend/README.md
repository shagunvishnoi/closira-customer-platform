# Closira — Frontend (Mobile Dashboard)

A React Native mobile dashboard for business owners to monitor conversations, track leads, and act on escalations.

## Tech Stack

- **React Native** (Expo)
- **React Navigation** (Bottom Tabs + Stack)
- **Expo Vector Icons** (Ionicons)
- **StyleSheet** (Vanilla React Native styling)

## Setup & Run

```bash
cd frontend
npm install
npx expo start
```

## Styling Choice: StyleSheet

For this prototype, I chose **StyleSheet** (Vanilla React Native) over NativeWind/Tailwind for the following reasons:
1. **Zero Configuration**: No extra Babel plugins or PostCSS setup required, ensuring the project runs immediately on any environment.
2. **Type Safety**: Works seamlessly with TypeScript/JavaScript with full IDE autocompletion for style properties.
3. **Performance**: Minimal runtime overhead compared to external styling libraries.
4. **Consistency**: Leverages built-in React Native primitives for a predictable look and feel across platforms.

## Mock Data

All data is realistically structured and stored in `src/mock/`:
- `enquiries.js`: Inbound leads with channel badges and status.
- `conversations.js`: Flat thread structure with SOP matches and summaries.
- `followUps.js`: Scheduled tasks with due times.

## Design System

- **Channel Badges**: WhatsApp (Green), Email (Blue), Call (Amber).
- **Status Indicators**: New (Blue), Qualified (Green), Escalated (Red).
- **Empty States**: Implemented across all list views to handle cases with no data.

## Screenshots

*(In a real submission, screenshots of the Dashboard, Leads, Escalations, and Conversation Detail would be embedded here.)*
