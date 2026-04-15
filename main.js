/* ==============================================
   CAMECORN — MAIN.JS
=============================================== */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ——— THEME TOGGLE ——— */
const themeToggle = $('#themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('camecorn-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle && themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('camecorn-theme', next);
});

/* ——— MAGNETIC BUTTONS ——— */
$$('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

/* ——— HEADER (always solid — no scroll toggle needed) ——— */
const header = $('#header');

/* ——— MOBILE MENU ——— */
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');
hamburger && hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
$$('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ——— SMOOTH SCROLL ——— */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ——— EMBER PARTICLES ——— */
const emberContainer = $('#embers');
if (emberContainer) {
  for (let i = 0; i < 20; i++) {
    const e = document.createElement('div');
    e.classList.add('ember-particle');
    const size = Math.random() * 2.5 + 1.2;
    e.style.cssText = `left:${Math.random()*100}%;bottom:-10px;width:${size}px;height:${size}px;--drift:${(Math.random()-0.5)*140}px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*10}s;opacity:0;`;
    emberContainer.appendChild(e);
  }
}

/* ——— SCROLL REVEAL ——— */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.10 });
$$('.reveal-up, .reveal-right').forEach(el => revealObserver.observe(el));

/* ——— ACTIVE NAV LINK ——— */
const sections = $$('section[id]');
const navLinks = $$('.nav-links .nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => { if (a.getAttribute('href') && a.getAttribute('href').startsWith('#')) a.classList.remove('active'); });
      const active = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ——— CARD TILT ——— */
$$('.pillar-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ——— SCROLL PROGRESS BAR ——— */
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#b07a45,#9b89b3,#97576f);z-index:2000;width:0%;transition:width 0.08s linear;';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) progressBar.style.width = `${(window.scrollY / docHeight) * 100}%`;
}, { passive: true });

/* ——— SERVICE ROW UNDERLINE ——— */
$$('.service-row').forEach(row => {
  const h3 = row.querySelector('h3');
  if (h3) {
    h3.style.backgroundImage = 'linear-gradient(#b07a45,#b07a45)';
    h3.style.backgroundSize = '0 1px';
    h3.style.backgroundRepeat = 'no-repeat';
    h3.style.backgroundPosition = 'left bottom';
    h3.style.transition = 'background-size 0.4s ease, color 0.3s';
    row.addEventListener('mouseenter', () => h3.style.backgroundSize = '100% 1px');
    row.addEventListener('mouseleave', () => h3.style.backgroundSize = '0 1px');
  }
});

/* ——— MARQUEE PAUSE ——— */
const marqueeTrack = $('.marquee-track');
if (marqueeTrack) {
  const wrap = marqueeTrack.parentElement;
  wrap.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
  wrap.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
}

/* ——— RESOURCES FILTER ——— */
const resFilters = $$('.res-filter');
if (resFilters.length) {
  resFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      resFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.res-card').forEach(card => { card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none'; });
      $$('.resources-section-block').forEach(block => {
        if (filter !== 'all') {
          block.style.display = [...block.querySelectorAll('.res-card')].some(c => c.dataset.category === filter) ? '' : 'none';
        } else { block.style.display = ''; }
      });
    });
  });
}

/* =============================================
   AI CHATBOT — powered by Anthropic API
   Reads page content to answer questions
============================================= */
const chatbotTrigger = $('#chatbotTrigger');
const chatbotWindow  = $('#chatbotWindow');
const chatbotClose   = $('#chatbotClose');
const chatbotInput   = $('#chatbotInput');
const chatbotSend    = $('#chatbotSend');
const chatbotMsgs    = $('#chatbotMessages');
const quickReplies   = $('#quickReplies');

let chatOpen = false;
let conversationHistory = [];
let isThinking = false;

/* Extract text content from the current page to feed into the AI context */
function getPageContent() {
  const selectors = [
    '.hero-heading', '.hero-sub',
    '.pillar-card', '.service-content',
    '.offering-content', '.about-prose-block',
    '.res-card-body', '.testi-card blockquote',
    '.cta-heading', '.cta-inner > p',
    '.section-heading', '.section-label'
  ];
  const texts = [];
  selectors.forEach(sel => {
    $$(sel).forEach(el => {
      const t = el.innerText.trim();
      if (t) texts.push(t);
    });
  });
  return texts.join('\n\n').slice(0, 3000); // cap to keep prompt lean
}

const CAMECORN_SYSTEM_PROMPT = () => `You are Camecorn's AI assistant — friendly, knowledgeable, and professional. You represent Camecorn, a next-generation AI company empowering African businesses.

Here is the current page content to draw your answers from:
---
${getPageContent()}
---

Core knowledge about Camecorn:
- Mission: Empowering African businesses with AI-powered solutions, skills, and education.
- Three goals: Brand, Scale, Position.
- Services: (1) AI Education — free live classes & tutorials. (2) AI Training — hands-on programs in web dev, content creation, workflow automation, AI agents, graphic design, email automation, market analysis. (3) AI Solutions — done-for-you websites, apps, automation workflows, AI agents, landing pages, digital marketing, presentations.
- Offerings (each available as done-for-you AND as training): Content Creation, Graphic Design, Market Analysis, Web Development, AI Workflow Creation, AI Agent Creation, Landing Pages, Email Automations, Presentations.
- Free resources on YouTube channel.
- Pricing: varies by scope — direct people to the free class as a risk-free starting point.

Tone: Warm, clear, confident, concise. Responses: 2–4 short paragraphs max. Always encourage the next step (free class or get in touch). Do not invent prices or contact details.`;

function toggleChat() {
  chatOpen = !chatOpen;
  chatbotWindow.classList.toggle('open', chatOpen);
  const openIcon  = chatbotTrigger.querySelector('.chat-icon-open');
  const closeIcon = chatbotTrigger.querySelector('.chat-icon-close');
  if (openIcon && closeIcon) {
    openIcon.style.display  = chatOpen ? 'none' : '';
    closeIcon.style.display = chatOpen ? '' : 'none';
  }
  if (chatOpen) { chatbotInput && chatbotInput.focus(); scrollToBottom(); }
}

chatbotTrigger && chatbotTrigger.addEventListener('click', toggleChat);
chatbotClose   && chatbotClose.addEventListener('click', toggleChat);

function scrollToBottom() { if (chatbotMsgs) chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight; }

function addMessage(text, role) {
  const div = document.createElement('div');
  div.classList.add('chat-msg', role);
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble');
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  div.appendChild(bubble);
  chatbotMsgs.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  const div = document.createElement('div');
  div.classList.add('chat-typing'); div.id = 'typingIndicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  chatbotMsgs.appendChild(div); scrollToBottom();
}
function removeTyping() { const el = $('#typingIndicator'); if (el) el.remove(); }
function hideQuickReplies() { if (quickReplies) quickReplies.style.display = 'none'; }

$$('.quick-reply').forEach(btn => {
  btn.addEventListener('click', () => { if (btn.dataset.msg) sendMessage(btn.dataset.msg); });
});
chatbotInput && chatbotInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const v = chatbotInput.value.trim(); if (v) sendMessage(v); }
});
chatbotSend && chatbotSend.addEventListener('click', () => {
  const v = chatbotInput && chatbotInput.value.trim(); if (v) sendMessage(v);
});

async function sendMessage(text) {
  if (isThinking) return;
  isThinking = true;
  hideQuickReplies();
  addMessage(text, 'user');
  if (chatbotInput) chatbotInput.value = '';
  conversationHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: CAMECORN_SYSTEM_PROMPT(),
        messages: conversationHistory
      })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    const replyText = data.content?.[0]?.text || "I'm here to help! Ask me anything about Camecorn's services or how AI can grow your business.";
    removeTyping();
    addMessage(replyText, 'bot');
    conversationHistory.push({ role: 'assistant', content: replyText });
  } catch (err) {
    removeTyping();
    const fallbacks = {
      'What services do you offer?': "Camecorn offers three core services:\n\nAI Education — free live classes and tutorials to help you understand AI.\n\nAI Training — hands-on programs covering web development, content creation, workflow automation, AI agents, and more.\n\nAI Solutions — done-for-you: we build websites, automation systems, AI agents, landing pages, and presentations.\n\nEvery offering is available as a service we deliver for you, and as training for your team.",
      'Tell me about AI training programs': "Our training programs are practical and business-specific, covering: Web Development, AI Content Creation, Workflow Automation, AI Agent Building, Graphic Design, Email Automation, and Market Analysis.\n\nAll programs are hands-on and immediately applicable — no technical background needed.",
      'How much does it cost?': "Pricing varies based on your project or training needs. The best starting point is our free live class — no commitment, just real learning.\n\nAfter that, we'll discuss what makes sense for your business. Would you like to join a free class?",
      'How do I get started?': "Getting started is simple and free!\n\n1. Join a Free Class — attend one of our live AI sessions.\n2. Explore our services on this page.\n3. Get in touch and we'll build a custom plan for your business.\n\nWould you like to know more about the free class?"
    };
    addMessage(fallbacks[text] || "Thank you for reaching out! I can help you learn about Camecorn's AI services and training. Explore the services on this page, or join our free class to get started. What would you like to know?", 'bot');
    conversationHistory.push({ role: 'assistant', content: 'Fallback response given.' });
  }
  isThinking = false;
}