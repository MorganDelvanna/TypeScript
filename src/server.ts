import 'dotenv/config';
import bcrypt from 'bcryptjs';
import express, { type Request, type Response, type NextFunction } from 'express';
import session from 'express-session';
import Stripe from 'stripe';
import { doubleCsrf } from 'csrf-csrf';
import cookieParser from 'cookie-parser';
import { initializeDatabase, query } from './db.js';
import { loadMenuMap } from './utils/menuLoader';
import { getShowById, loadShows } from './utils/showsLoader.js';
import {renderHomeView} from './views/index.js';
import path from 'path';
import { loadNewsHeaders, loadNews } from './utils/newsLoader.js';
import { renderRulesView } from './views/rules.js';
import { renderHistoryView } from './views/history.js';
import { renderLocationView } from './views/location.js';
import { renderScheduleView } from './views/schedule.js';
import { renderFaqView } from './views/faq.js';
import { renderMembershipView } from './views/membership.js';
import { renderNewMemberView } from './views/newMember.js';
import { renderRenewalView } from './views/renewal.js';
import { renderShowsView } from './views/shows.js';
import { renderLinksView } from './views/links.js';
import { loadLinks } from './utils/linksLoader.js';
import { renderCalendarView } from './views/calendar.js';
import { loadCalendarEvents } from './utils/calendarLoader.js';
import { renderNewsView } from './views/news.js';
import { renderIndoorsView } from './views/indoors.js';
import { renderOutdoorsView } from './views/outdoors.js';
import { renderCoursesView } from './views/courses.js';
import { renderPropertyView } from './views/property.js';
import { renderSectionsView } from './views/sections.js';
import { renderActionView } from './views/action.js';
import { renderArcheryView } from './views/archery.js';
import { renderHandgunView } from './views/handgun.js';
import { renderSmallboreView } from './views/smallbore.js';
import { renderRiflesView } from './views/rifles.js';
import { renderJuniorsView } from './views/juniors.js';
import { renderContactView } from './views/contacts.js';
import { renderDirectionsView } from './views/directions.js';
import { renderMemberView } from './views/stripe/memberform.js';
import { Console } from 'console';


declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
    user?: {
      Id?: number;
      username?: string;
      role?: string;
    };
  }
}

type RecordMap = {
  [key: string]: unknown;
};

type UserRecord = {
  Id: number;
  username: string;
  password: string;
  role: string;
};

type DashboardStats = {
  newsCount: number;
  calendarCount: number;
};

type NewsRecord = {
  id: number;
  header: string;
  description: string;
  publish_date: Date;
};

const app = express();
const port = Number(process.env.PORT ?? 3000);
const sessionSecret = process.env.SESSION_SECRET;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.toString();

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set in .env');
}
const stripe = new Stripe(stripeSecretKey ?? '');

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
}));
app.use(cookieParser(sessionSecret));
const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => sessionSecret,
  getSessionIdentifier: (req) => req.sessionID,
  cookieName: '__csrf',
  cookieOptions: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
});

// Apply globally (replaces app.use(csrfProtection))
app.use(doubleCsrfProtection);

app.use(express.static(path.join(__dirname, '../public')));

function page(title: string, content: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:3rem auto;padding:0 1rem;line-height:1.5}nav{display:flex;gap:1rem;margin-bottom:2rem}article{border-top:1px solid #ddd;padding:1rem 0}input,textarea{display:block;width:100%;max-width:32rem;margin:.4rem 0 1rem;padding:.6rem;box-sizing:border-box}button{padding:.6rem 1rem;cursor:pointer}.error{color:#a00}</style></head><body>
<nav><a href="/">Public home</a><a href="/admin">Admin</a></nav>${content}</body></html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function textValue(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

function pickDisplayText(row: RecordMap, fallbackLabel: string): string {
  const candidate = row.header ?? fallbackLabel;
  return textValue(candidate) || fallbackLabel;
}

function pickBodyText(row: RecordMap): string {
  const candidate = row.description ?? '';
  return textValue(candidate);
}

function formatDate(value: unknown): string {
  const raw = textValue(value);
  if (!raw) {
    return 'No date';
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return parsed.toLocaleString();
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session.authenticated && req.session.user?.role === 'admin') {
    next();
    return;
  }
  res.redirect('/admin/login');
}

async function getFees(): Promise<Map<string, number>> {
  let fees = new Map<string, number>();
  
  const initiationFee = await stripe.prices.retrieve(process.env.PRICE_INITIATION ?? '');
  const generalFee = await stripe.prices.retrieve(process.env.PRICE_GENERAL ?? '');
  const seniorFee = await stripe.prices.retrieve(process.env.PRICE_SENIOR ?? ''); 
  const juniorFee = await stripe.prices.retrieve(process.env.PRICE_JUNIOR ?? '');
  const extraFee = await stripe.prices.retrieve(process.env.PRICE_EXTRA ?? '');
  const familyFee = await stripe.prices.retrieve(process.env.PRICE_FAMILY ?? '');
  const generalHalfFee = await stripe.prices.retrieve(process.env.PRICE_GENERAL_HALF ?? '');
  const seniorHalfFee = await stripe.prices.retrieve(process.env.PRICE_SENIOR_HALF ?? '');
  const juniorHalfFee = await stripe.prices.retrieve(process.env.PRICE_JUNIOR_HALF ?? ''); 

  fees.set('initiation', (initiationFee.unit_amount ?? 7500)/ 100 );
  fees.set('general', (generalFee.unit_amount ?? 35000)/ 100);
  fees.set('senior', (seniorFee.unit_amount ?? 32000)/ 100);
  fees.set('junior', (juniorFee.unit_amount ?? 25000)/ 100);
  fees.set('extra', (extraFee.unit_amount ?? 2500)/ 100);
  fees.set('family', (familyFee.unit_amount ?? 2000)/ 100);
  fees.set('general_half', (generalHalfFee.unit_amount ?? 25000)/ 100);
  fees.set('senior_half', (seniorHalfFee.unit_amount ?? 23000)/ 100);
  fees.set('junior_half', (juniorHalfFee.unit_amount ?? 28000)/ 100);
  return fees;

}

async function verifyUserPassword(storedPassword: string, inputPassword: string): Promise<boolean> {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  return storedPassword === inputPassword;
}

app.get('/', async (_req, res) => {
  const html = renderHomeView({
    menuMap: loadMenuMap(),
    currentPath: '/', 
    newsHeaders: await loadNewsHeaders(),
  });
  res.send(html);
});

app.get('/rules', (_req, res) => {
  const html = renderRulesView({
    menuMap: loadMenuMap(),
    currentPath: '/rules',
  });
  res.send(html);
});

app.get('/history', (_req, res) => {
  const html = renderHistoryView({
    menuMap: loadMenuMap(),
    currentPath: '/history',
  });
  res.send(html);
});

app.get('/location', (_req, res) => {
  const html = renderLocationView({
    menuMap: loadMenuMap(),
    currentPath: '/location',
  });
  res.send(html);
});

app.get('/schedule', (_req, res) => {
  const html = renderScheduleView({
    menuMap: loadMenuMap(),
    currentPath: '/schedule',
  });
  res.send(html);
});

app.get('/faq', (_req, res) => {
  const html = renderFaqView({
    menuMap: loadMenuMap(),
    currentPath: '/faq',
  });
  res.send(html);
});

app.get('/membership', (_req, res) => {
  const html = renderMembershipView({
    menuMap: loadMenuMap(),
    currentPath: '/membership',
  });
  res.send(html);
});

app.get('/newmember', (_req, res) => {
  const html = renderNewMemberView({
    menuMap: loadMenuMap(),
    currentPath: '/newmember',
  });
  res.send(html);
});

app.get('/renewal', (_req, res) => {
  const html = renderRenewalView({
    menuMap: loadMenuMap(),
    currentPath: '/renewal',
  });
  res.send(html);
});

app.get('/shows', (_req, res) => {
  const html = renderShowsView({
    menuMap: loadMenuMap(),
    currentPath: '/shows',
    shows: loadShows(),
  });
  res.send(html);
});

app.get('/directions/:id', (_req, res) => {
  const showId = parseInt(_req.params.id);
  const show = getShowById(showId);

  if (!show) {
    res.status(404).send('Show not found');
    return;
  }
  
  const html = renderDirectionsView({
    menuMap: loadMenuMap(),
    currentPath: `/directions/${showId}`,
    show: show
  });
  res.send(html);
});

app.get('/links', (_req, res) => {
  const html = renderLinksView({
    menuMap: loadMenuMap(),
    currentPath: '/links',
    links: loadLinks(),
  });
  res.send(html);
});

app.get('/calendar', (_req, res) => {
  const html = renderCalendarView({
    menuMap: loadMenuMap(),
    currentPath: '/calendar',
  });
  res.send(html);
});

app.get(['/news', '/news/:id'], async (req, res) => {
  const id = req.params.id === undefined ? undefined : Number(req.params.id);
  const newsItems = await loadNews();

  const html = renderNewsView({ 
    menuMap: loadMenuMap(),
    currentPath: '/news',
    newsItems: newsItems
  });
  res.send(html);
});

app.get('/indoors', (_req, res) => {
  const html = renderIndoorsView({
    menuMap: loadMenuMap(),
    currentPath: '/indoors',
  });
  res.send(html);
});

app.get('/outdoors', (_req, res) => {
  const html = renderOutdoorsView({
    menuMap: loadMenuMap(),
    currentPath: '/outdoors',
  });
  res.send(html);
});

app.get('/courses', (_req, res) => {
  const html = renderCoursesView({
    menuMap: loadMenuMap(),
    currentPath: '/courses',
  });
  res.send(html);
});

app.get('/property', (_req, res) => {
  const html = renderPropertyView({
    menuMap: loadMenuMap(),
    currentPath: '/property',
  });
  res.send(html);
});

app.get('/sections', (_req, res) => {
  const html = renderSectionsView({
    menuMap: loadMenuMap(),
    currentPath: '/sections',
  });
  res.send(html);
});

app.get('/action', (_req, res) => {
  const html = renderActionView({
    menuMap: loadMenuMap(),
    currentPath: '/action',
  });
  res.send(html);
});

app.get('/archery', (_req, res) => {
  const html = renderArcheryView({
    menuMap: loadMenuMap(),
    currentPath: '/archery',
  });
  res.send(html);
});

app.get('/handgun', (_req, res) => {
  const html = renderHandgunView({
    menuMap: loadMenuMap(),
    currentPath: '/handgun',
  });
  res.send(html);
});

app.get('/rifles', (_req, res) => {
  const html = renderRiflesView({
    menuMap: loadMenuMap(),
    currentPath: '/rifles',
  });
  res.send(html);
});

app.get('/smallbore', (_req, res) => {
  const html = renderSmallboreView({
    menuMap: loadMenuMap(),
    currentPath: '/smallbore',
  });
  res.send(html);
});

app.get('/juniors', (_req, res) => {
  const html = renderJuniorsView({
    menuMap: loadMenuMap(),
    currentPath: '/juniors',
  });
  res.send(html);
});

app.get('/contact', (_req, res) => {
  const html = renderContactView({
    menuMap: loadMenuMap(),
    currentPath: '/contact',
  });
  res.send(html);
});

app.get('/stripe/memberform/:applicationType', async (req, res) => {
  const applicationType = req.params.applicationType;
  const token = generateCsrfToken(req, res);
  const html = renderMemberView({
    menuMap: loadMenuMap(),
    currentPath: `/stripe/memberform/${applicationType}`,
    applicationType,
    fees: await getFees(),
    csrfToken: token
  });
  res.send(html);
});

app.get('/calendar/events', async (_req, res) => {
  try {
    const eventsJson = await loadCalendarEvents();  
    res.json(JSON.parse(eventsJson));
  } catch (error) {
    console.error('Error loading calendar events:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

app.get('/admin/login', (req, res) => {
  if (req.session.authenticated && req.session.user?.role === 'admin') {
    res.redirect('/admin');
    return;
  }
  res.send(page('Admin login', `<h1>Admin login</h1><form method="post" action="/admin/login"><label for="username">Username</label><input id="username" name="username" required autofocus><label for="password">Password</label><input id="password" name="password" type="password" required><button type="submit">Sign in</button></form>`));
});

app.post('/admin/login', async (req, res) => {
  const username = String(req.body.username ?? '').trim();
  const password = String(req.body.password ?? '');

  const [user] = await query<UserRecord>('SELECT Id, username, password, role FROM users WHERE username = ? LIMIT 1', [username]);

  if (!user || user.role !== 'admin') {
    res.status(401).send(page('Admin login', '<h1>Admin login</h1><p class="error">Invalid admin username or password.</p><a href="/admin/login">Try again</a>'));
    return;
  }

  const matches = await verifyUserPassword(user.password, password);

  if (!matches) {
    res.status(401).send(page('Admin login', '<h1>Admin login</h1><p class="error">Invalid admin username or password.</p><a href="/admin/login">Try again</a>'));
    return;
  }

  req.session.authenticated = true;
  req.session.user = { Id: user.Id, username: user.username, role: user.role };
  res.redirect('/admin');
});

app.get('/admin', requireAdmin, async (req, res) => {
  const [newsCountRow] = await query<{ newsCount: number }>('SELECT COUNT(*) AS newsCount FROM news');
  const [calendarCountRow] = await query<{ calendarCount: number }>('SELECT COUNT(*) AS calendarCount FROM calendar');
  const newsItems = await query<RecordMap>('SELECT * FROM news ORDER BY id DESC LIMIT 5');
  const calendarItems = await query<RecordMap>('SELECT * FROM calendar ORDER BY id DESC LIMIT 5');

  const stats: DashboardStats = {
    newsCount: Number(newsCountRow?.newsCount ?? 0),
    calendarCount: Number(calendarCountRow?.calendarCount ?? 0),
  };

  const newsRows = newsItems.length
    ? newsItems.map((item) => `<li><strong>${escapeHtml(pickDisplayText(item, 'News item'))}</strong> <small>(${formatDate(item.publish_date)})</small><br>${escapeHtml(pickBodyText(item) || 'No description available.')}</li>`).join('')
    : '<li>No news items found.</li>';

  const calendarRows = calendarItems.length
    ? calendarItems.map((item) => `<li><strong>${escapeHtml(pickDisplayText(item, 'Calendar item'))}</strong> <small>(${formatDate(item.date ?? item.event_date ?? item.start_date ?? item.created_at)})</small><br>${escapeHtml(pickBodyText(item) || 'No details available.')}</li>`).join('')
    : '<li>No calendar items found.</li>';

  const dashboard = `
    <h1>Admin dashboard</h1>
    <p>Welcome, ${escapeHtml(req.session.user?.username ?? 'admin')}.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1rem;margin:1.5rem 0;">
      <div style="border:1px solid #ddd;padding:1rem;border-radius:8px;"><strong>${stats.newsCount}</strong><br>News items</div>
      <div style="border:1px solid #ddd;padding:1rem;border-radius:8px;"><strong>${stats.calendarCount}</strong><br>Calendar items</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
      <section>
        <h2>Latest news</h2>
        <ul>${newsRows}</ul>
      </section>
    </div>

    <section style="margin-top:2rem;">
      <h2>Upcoming calendar</h2>
      <ul>${calendarRows}</ul>
    </section>

    <form method="post" action="/admin/logout" style="margin-top:2rem;">
      <button type="submit">Sign out</button>
    </form>
  `;

  res.send(page('Admin dashboard', dashboard));
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

async function start(): Promise<void> {
  await initializeDatabase();
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

start().catch((error: unknown) => {
  console.error('Unable to start application:', error);
  process.exit(1);
});

