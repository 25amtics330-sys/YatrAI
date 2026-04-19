import { createSlice } from '@reduxjs/toolkit';
import { QUICK_REPLIES } from '@/utils/constants';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'ai',
  text: '🙏 Namaste! I\'m YatrAI Guide, your AI travel assistant for India!\n\nI can help you with:\n🗺️ Destination recommendations\n🚂 Train & bus routes\n🏨 Hotel suggestions\n🍛 Local food guides\n🎉 Festival calendars\n💰 Budget planning\n\nWhat would you like to explore today?',
  timestamp: new Date().toISOString(),
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    messages: [WELCOME_MESSAGE],
    isOpen: false,
    isTyping: false,
    quickReplies: QUICK_REPLIES,
    language: 'en',
  },
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: 'msg_' + Date.now(),
        sender: 'user',
        text: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.isTyping = true;
    },
    addAiMessage: (state, action) => {
      state.messages.push({
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai',
        text: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.isTyping = false;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [WELCOME_MESSAGE];
    },
  },
});

/**
 * Thunk: sends message to backend AI (Gemini) and dispatches the reply
 */
export const sendChatMessage = (text) => async (dispatch, getState) => {
  dispatch(addUserMessage(text));

  const { messages } = getState().chatbot;
  // Send last 10 messages as history context (excluding the one just added)
  const history = messages.slice(-11, -1).filter((m) => m.id !== 'welcome');

  try {
    const response = await axios.post(`${API_BASE}/chatbot/message`, {
      message: text,
      history,
    });
    dispatch(addAiMessage(response.data.reply));
  } catch (err) {
    // Local keyword fallback if backend is unreachable
    const lower = text.toLowerCase();
    const FALLBACK = {
      bus: '🚌 Use RedBus or IRCTC for bus booking. RSRTC, KSRTC operate great intercity routes at ₹800-2000.',
      train: '🚂 Book trains on IRCTC.co.in. Tatkal at 10 AM (AC) / 11 AM (Sleeper). Try Rajdhani or Vande Bharat!',
      hotel: '🏨 OYO/Zostel for budget (₹500-1500), Treebo for mid-range (₹2000-5000), Taj for luxury!',
      food: '🍛 North: Dal Makhani, South: Dosa, East: Momos, West: Vada Pav. India\'s food is incredible!',
      festival: '🎉 Pushkar Mela (Nov), Hornbill (Dec), Rann Utsav (Nov-Feb), Onam (Sep) — all unmissable!',
      goa: '🏖️ Best Nov-Feb! North for parties, South for peace. Budget ~₹3000-6000/day.',
      kerala: '🛶 God\'s Own Country! Best Sep-Mar. Houseboat in Alleppey, tea in Munnar.',
    };
    let reply = '🙏 I\'m having trouble connecting right now. Please try again in a moment!';
    for (const [key, val] of Object.entries(FALLBACK)) {
      if (lower.includes(key)) { reply = val; break; }
    }
    dispatch(addAiMessage(reply));
  }
};

export const {
  toggleChat,
  openChat,
  closeChat,
  addUserMessage,
  addAiMessage,
  setTyping,
  setLanguage,
  clearMessages,
} = chatbotSlice.actions;
export default chatbotSlice.reducer;
