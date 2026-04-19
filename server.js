require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('./lib/supabase');

if (supabase) {
  console.log('🛡️ Supabase Connection Initialized');
} else {
  console.error('❌ Supabase Connection Failed');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '15071577928-nucc4osovkuusbiclkqqi3riv990r3dg.apps.googleusercontent.com';
const JWT_SECRET = process.env.JWT_SECRET || 'yatrai-super-secret-jwt-key-2025';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ─── Admin Credentials ──────────────────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'yatrai-admin-2025';

// Gemini AI setup
const genAI = GEMINI_API_KEY.trim() ? new GoogleGenerativeAI(GEMINI_API_KEY.trim()) : null;
console.log('Gemini AI initialized:', genAI ? 'YES (Key detected)' : 'NO (Key missing)');

const app = express();

// Allow requests from any origin for the temporary public tunnel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(express.json());

const places = require("./data/places.json");

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "dist")));

// ─── Analytics Middleware (Supabase) ──────────────────────────────────────────
app.use(async (req, res, next) => {
  const path = req.path;
  // Skip API calls and static assets
  if (req.method === 'GET' && !path.startsWith('/api') && !path.includes('.')) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // We use RPC or a simple upsert to increment the counter
      // For simplicity, we fetch and update
      const { data: current } = await supabase.from('analytics').select('*').limit(1).single();
      
      if (current) {
        const daily = current.daily_views || {};
        daily[today] = (daily[today] || 0) + 1;
        
        const sessions = current.active_sessions || {};
        const sessId = req.headers['user-agent']?.substring(0, 50) || 'anon';
        sessions[sessId] = Date.now();

        await supabase.from('analytics').update({
          total_views: (current.total_views || 0) + 1,
          daily_views: daily,
          active_sessions: sessions
        }).eq('id', current.id);
      }
    } catch (e) {
      // console.error('Supabase Analytics Error:', e.message);
    }
  }
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Tourist Recommendation API Running 🚀", status: "ok" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Tourist Recommendation API Running 🚀", status: "ok" });
});

// ─── Auth ──────────────────────────────────────────────────────────

// POST /api/auth/google  — verify Google credential token, issue our own JWT
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No credential provided' });
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Save/Update user in Supabase
    const { data: userData, error: userError } = await supabase.from('users').upsert([
      { 
        email: payload.email, 
        name: payload.name, 
        avatar: payload.picture, 
        role: 'user', 
        last_login: new Date().toISOString() 
      }
    ], { onConflict: 'email' }).select().single();

    if (userError) console.error('Supabase User Save Error:', userError);

    const user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
      role: userData?.role || 'user',
      lastLogin: new Date().toISOString()
    };

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user, token });
  } catch (err) {
    console.error('Google auth error:', err.message);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
});

// Mock Login/Register (to avoid 404s)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for Admin credentials first (case-insensitive for username)
  if (email?.toLowerCase() === ADMIN_USER && password === ADMIN_PASS) {
    const user = { id: 'admin-id', name: 'Site Administrator', email: 'admin@yatrai.ai', avatar: 'https://i.pravatar.cc/150?u=admin', role: 'admin', lastLogin: new Date().toISOString() };
    
    // Save admin to Supabase
    await supabase.from('users').upsert([
      { email: user.email, name: user.name, avatar: user.avatar, role: 'admin', last_login: user.lastLogin }
    ], { onConflict: 'email' });

    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ user, token });
  }

  // Normal Mock Login
  const user = { id: 'mock-id', name: email.split('@')[0], email, avatar: 'https://i.pravatar.cc/150' };
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user, token });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name } = req.body;
  const user = { id: 'mock-id', name, email, avatar: 'https://i.pravatar.cc/150' };
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user, token });
});

// ─── Admin Auth ─────────────────────────────────────────────────────────

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ message: 'Invalid Admin credentials' });
});

// Middleware to verify Admin JWT
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not an admin');
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));
    const analytics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'analytics.json'), 'utf8'));
    
    // Process analytics for Google-style dashboard
    const activeUsersNow = Object.keys(analytics.activeSessions || {}).length || 1;
    
    // Add some mock geographic data for demo if not present
    analytics.topCities = analytics.topCities || {
      "Jaipur": 45, "Delhi": 32, "Mumbai": 28, "Udaipur": 15, "Bangalore": 12
    };

    res.json({
      totalUsers: users.length,
      activeUsers: activeUsersNow,
      users: users,
      analytics: analytics,
      serverStatus: 'online',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

// GET /api/auth/profile  — returns user data from JWT (simple decode, no DB)
app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ userId: decoded.userId, email: decoded.email });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// ─── Chatbot ──────────────────────────────────────────────────────────

const TRAVEL_SYSTEM_PROMPT = `You are YatrAI Guide, a friendly and expert AI travel assistant specializing in India tourism.
You help users plan trips, find destinations, get travel tips, learn about festivals, find hotels, and understand transport options across India.
Always be concise, helpful and enthusiastic. Use emojis sparingly to make responses lively.
Focus ONLY on India travel topics. If asked about something unrelated, politely redirect to Indian travel.
Provide practical, actionable advice. Include budget estimates in Indian Rupees when relevant.
Know about all 28 states and 8 UTs of India, their cultures, foods, festivals, and attractions.`;

// Simple keyword fallback (used when no Gemini key)
const FALLBACK_MAP = {
  bus: '🚌 RSRTC, KSRTC, and APSRTC connect most cities. Use RedBus or IRCTC for booking. Volvo AC buses cost ₹800-2000 for intercity routes.',
  train: '🚂 Use IRCTC (irctc.co.in) to book trains. Tatkal opens at 10 AM (AC) and 11 AM (Sleeper). Popular: Rajdhani, Shatabdi, Vande Bharat.',
  hotel: '🏨 Budget: Zostel/OYO (₹500-1500) | Mid-range: Treebo (₹2000-5000) | Luxury: Taj/Oberoi (₹10000+). Book via MakeMyTrip for deals.',
  food: '🍛 North: Butter Chicken, Chole Bhature | South: Dosa, Biryani | East: Momos, Rasgulla | West: Vada Pav, Dhokla.',
  festival: '🎉 Upcoming: Pushkar Mela (Nov), Hornbill Festival (Dec), Rann Utsav (Nov-Feb), Onam (Sep). Each is a unique cultural experience!',
  goa: '🏖️ Goa is best Nov-Feb. North Goa for beaches & nightlife, South Goa for peace. Budget: ₹3000-6000/day.',
  kerala: '🛶 Kerala is best Sep-Mar. Alleppey houseboats, Munnar tea gardens, Kovalam beach. Budget: ₹2500-5000/day.',
  rajasthan: '🎯 Best Oct-Mar. Jaipur, Udaipur, Jaisalmer are must-visits. Rich history, forts, and amazing food!',
  himachal: '⛰️ Best Mar-Jun for Manali. Spiti valley, Shimla ridge. Adventure sports like rafting and paragliding available!',
  weather: '🌤️ India: Summer (Mar-Jun), Monsoon (Jul-Sep), Winter (Oct-Feb). Best travel time: Oct-Mar for most destinations.',
  budget: '💰 India travel budgets: Backpacker ₹1500-2500/day | Mid-range ₹3000-6000/day | Luxury ₹10000+/day.',
  default: '🙏 Namaste! I\'m YatrAI Guide, your AI travel assistant for India! Ask me about destinations, trains, hotels, food, festivals, or anything about traveling in India! 🇮🇳'
};

function getKeywordFallback(text) {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(FALLBACK_MAP)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return FALLBACK_MAP.default;
}

// POST /api/chatbot/message
app.post('/api/chatbot/message', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  // If no Gemini key, use keyword fallback
  if (!genAI) {
    console.log('No Gemini API Key found, using fallback.');
    return res.json({ reply: getKeywordFallback(message), source: 'fallback' });
  }

  // Log chat activity
  const analyticsPath = path.join(__dirname, 'data', 'analytics.json');
  try {
    const analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
    analytics.chatMessages = (analytics.chatMessages || 0) + 1;
    fs.writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2));
  } catch (e) {}

  try {
    // Forced v1 and gemini-pro for maximum reliability
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro' 
    }, { apiVersion: 'v1' });

    // Build a simple combined prompt with history
    let prompt = `${TRAVEL_SYSTEM_PROMPT}\n\n`;
    history.forEach(msg => {
      prompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
    });
    prompt += `User: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();
    
    console.log('Gemini success! Response received.');
    return res.json({ reply, source: 'gemini' });
  } catch (err) {
    console.error('Gemini error:', err.message);
    // Fallback on error
    return res.json({ reply: getKeywordFallback(message), source: 'fallback' });
  }
});

// GET /api/chatbot/quick-replies
app.get('/api/chatbot/quick-replies', (req, res) => {
  res.json([
    { id: 'qr1', text: '🚌 Bus Routes', keyword: 'bus' },
    { id: 'qr2', text: '🚂 Train Info', keyword: 'train' },
    { id: 'qr3', text: '🏨 Hotel Tips', keyword: 'hotel' },
    { id: 'qr4', text: '🍛 Local Food', keyword: 'food' },
    { id: 'qr5', text: '🎉 Festivals', keyword: 'festival' },
    { id: 'qr6', text: '💰 Budget Tips', keyword: 'budget' },
  ]);
});

// ─── Recommendations ──────────────────────────────────────────────────────────

// POST /api/recommendations/preference  (called by frontend)
app.post("/api/recommendations/preference", (req, res) => {
  const { interests = [], budget, groupType, duration } = req.body;

  const scored = places.map((place) => {
    let score = 0;
    interests.forEach((interest) => {
      if (place.interests.includes(interest)) score += 25;
    });
    // Map string budget labels to numeric ranges
    const budgetMap = { low: 2000, medium: 4000, high: 8000 };
    if (budget && budgetMap[place.budget] <= budget) score += 15;
    score = Math.min(98, Math.max(45, score + Math.floor(Math.random() * 10)));
    return {
      id: place.name.toLowerCase().replace(/ /g, '-'),
      name: place.name,
      type: place.type,
      budget: place.budget,
      interests: place.interests,
      days: place.days,
      matchPercent: score,
      tags: place.interests,
      highlights: place.interests.map((i) => i.charAt(0).toUpperCase() + i.slice(1)),
      crowdLevel: place.budget === 'high' ? 'High' : place.budget === 'medium' ? 'Medium' : 'Low',
      avgBudgetPerDay: place.budget === 'high' ? 5000 : place.budget === 'medium' ? 3000 : 1500,
      heroImage: `https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=500&fit=crop`,
      bestSeason: 'October – March',
      festivals: [],
      destinations: [],
      whyRecommended: `Based on your interests in ${interests.join(', ')}, ${place.name} is a great match!`,
    };
  });

  // Filter by interests if provided
  const filtered = interests.length
    ? scored.filter((p) => p.interests.some((i) => interests.includes(i)))
    : scored;

  filtered.sort((a, b) => b.matchPercent - a.matchPercent);

  res.json(filtered.slice(0, 6));
});

// GET /api/recommendations/state/:stateId
app.get("/api/recommendations/state/:stateId", (req, res) => {
  const { stateId } = req.params;
  const place = places.find((p) => p.name.toLowerCase().replace(/ /g, '-') === stateId);
  if (!place) return res.status(404).json({ error: 'Not found' });
  res.json(place);
});

// GET /api/recommendations/festivals
app.get("/api/recommendations/festivals", (req, res) => {
  // Return empty array — frontend falls back to local FESTIVALS_2025 constant
  res.json([]);
});

// ─── Frontend Catch-all ───────────────────────────────────────────────────
// This MUST be the last middleware
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"), (err) => {
    if (err) {
      // If index.html is missing, it means frontend hasn't been built yet
      res.status(404).json({ message: "Frontend build not found. Run 'npm run build' in the frontend directory." });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🚀 Backend running on http://localhost:${PORT}`));