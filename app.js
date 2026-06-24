/**
 * SafetyFeed (TBC) — Application Logic
 * Depends on: api.js (ApiService)
 */
(function () {
  'use strict';

  // ── State ──
  const STORAGE_KEY = 'safetyFeed_v5';
  let state = loadState();
  let allVideos = [];
  let currentPage = 'home';
  let currentFilter = 'all';

  // ── Theme Toggle ──
  (function initTheme() {
    const saved = localStorage.getItem('safetyFeed_theme');
    if (saved !== 'light') document.documentElement.classList.add('dark-theme');
  })();

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark-theme');
      const isDark = document.documentElement.classList.contains('dark-theme');
      localStorage.setItem('safetyFeed_theme', isDark ? 'dark' : 'light');
    });
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return { likes: {}, comments: {}, userVideos: [], discoverPosts: [] };
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ── Helpers ──
  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return Math.floor(diff / 604800) + 'w ago';
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Page Routing ──
  function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.page-section').forEach(el => el.style.display = 'none');
    const target = document.getElementById('page-' + page);
    if (target) target.style.display = '';

    document.querySelectorAll('.side-nav a, .bottom-nav a').forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`[data-nav="${page}"]`).forEach(l => l.classList.add('active'));

    if (page === 'learn') {
      renderFeed(document.getElementById('searchInput').value);
    } else if (page === 'share') {
      renderShare();
    } else if (page === 'play') {
      renderPlay();
    } else if (page === 'home') {
      // static content, no render needed
    }

    window.scrollTo(0, 0);
  }

  // ── Init State for Videos / Posts ──
  function ensureVideoState(items) {
    items.forEach(v => {
      if (!state.likes[v.id]) {
        state.likes[v.id] = { count: v.defaultLikes || 0, liked: false };
      }
      if (!state.comments[v.id]) {
        state.comments[v.id] = (v.defaultComments || []).map(c => ({ ...c }));
      }
    });
    saveState();
  }

  // ── Render Learn Feed ──
  async function renderFeed(filter) {
    const feed = document.getElementById('feed');

    const apiVideos = await ApiService.getVideos(filter);
    allVideos = apiVideos;
    ensureVideoState(allVideos);

    let videos = [...state.userVideos.filter(uv => {
      if (!filter) return true;
      const q = filter.toLowerCase();
      return uv.title.toLowerCase().includes(q) ||
        uv.desc.toLowerCase().includes(q) ||
        uv.author.toLowerCase().includes(q);
    }), ...allVideos];

    const CATEGORIES = ApiService.CATEGORIES;

    feed.innerHTML = videos.map((v, i) => {
      const cat = CATEGORIES[v.category] || { label: v.category, cssClass: 'cat-general' };
      const likeData = state.likes[v.id] || { count: 0, liked: false };
      const comments = state.comments[v.id] || [];
      const avIdx = i % 8;
      const thumbnailSvg = v.thumbnail || ApiService.defaultThumbnail(v.title);

      return `
        <div class="card" data-id="${v.id}">
          <div class="card-thumbnail" title="Play video">
            ${thumbnailSvg}
            <div class="play-overlay">
              <div class="play-btn">
                <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
            </div>
            <span class="card-category ${cat.cssClass}">${cat.label}</span>
            <span class="card-duration">${v.duration}</span>
          </div>
          <div class="card-body">
            <div class="card-header">
              <div class="avatar av-${avIdx}">${getInitials(v.author)}</div>
              <div class="card-meta">
                <div class="card-title">${escapeHTML(v.title)}</div>
                <div class="card-author">${escapeHTML(v.author)}</div>
              </div>
            </div>
            <div class="card-desc">${escapeHTML(v.desc)}</div>
            <div class="card-timestamp">${timeAgo(v.timestamp)}</div>
            <div class="card-actions">
              <button class="action-btn btn-like ${likeData.liked ? 'liked' : ''}" data-id="${v.id}" aria-label="Like">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span>${likeData.count}</span>
              </button>
              <button class="action-btn btn-comment" data-id="${v.id}" aria-label="Comments">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>${comments.length}</span>
              </button>
              <span class="action-btn-spacer"></span>
              <button class="action-btn btn-share" data-id="${v.id}" aria-label="Share">
                <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
          </div>
          <div class="comments-section" id="comments-${v.id}">
            <div class="comments-list" id="comments-list-${v.id}">
              ${comments.length === 0 ? '<div class="no-comments">No comments yet. Be the first!</div>' :
          comments.map(c => `
                  <div class="comment">
                    <div class="comment-avatar">${getInitials(c.author)}</div>
                    <div class="comment-body">
                      <div class="comment-author">${escapeHTML(c.author)}</div>
                      <div class="comment-text">${escapeHTML(c.text)}</div>
                      <div class="comment-time">${c.time}</div>
                    </div>
                  </div>
                `).join('')
        }
            </div>
            <div class="comment-input-row">
              <input type="text" placeholder="Add a comment..." id="comment-input-${v.id}">
              <button data-id="${v.id}" class="btn-post-comment">Post</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    attachCardEvents(feed);
  }

  // ── Render Share Feed (formerly Discover) ──
  async function renderShare() {
    const feed = document.getElementById('share-feed');

    const apiPosts = await ApiService.getDiscoverPosts();
    let allPosts = [...state.discoverPosts, ...apiPosts];
    ensureVideoState(allPosts);

    // Apply filter
    if (currentFilter !== 'all') {
      if (currentFilter === 'trending') {
        allPosts = allPosts.filter(p => (state.likes[p.id]?.count || p.defaultLikes || 0) >= 150);
      } else {
        allPosts = allPosts.filter(p => p.tag === currentFilter);
      }
    }

    const TAGS = ApiService.TAGS;

    feed.innerHTML = allPosts.map((p, i) => {
      const likeData = state.likes[p.id] || { count: 0, liked: false };
      const comments = state.comments[p.id] || [];
      const avIdx = i % 8;
      const tagInfo = TAGS[p.tag];
      const isTrending = likeData.count >= 150;

      const tagHTML = tagInfo ? `<span class="post-tag ${tagInfo.cssClass}">${tagInfo.icon} ${tagInfo.label}</span>` : '';

      const mediaSection = p.thumbnail ? (
        p.hasVideo ? `
        <div class="card-thumbnail post-video-thumb" title="Play video">
          ${p.thumbnail}
          <div class="play-overlay">
            <div class="play-btn">
              <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
          </div>
          ${p.duration ? `<span class="card-duration">${p.duration}</span>` : ''}
          ${p.videoTitle ? `<div class="post-video-label"><svg viewBox="0 0 24 24" width="14" height="14"><rect x="2" y="4" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="22,7 15,11.5 22,16" fill="currentColor"/></svg> ${escapeHTML(p.videoTitle)}</div>` : ''}
        </div>
      ` : p.hasImage ? `
        <div class="post-image">
          ${p.thumbnail}
        </div>
      ` : ''
      ) : '';

      return `
        <div class="discover-post ${isTrending ? 'trending' : ''}" data-id="${p.id}">
          ${isTrending ? '<div class="trending-badge">&#128293; Trending</div>' : ''}
          <div class="post-header">
            <div class="avatar av-${avIdx}">${getInitials(p.author)}</div>
            <div class="post-meta">
              <div class="post-author">${escapeHTML(p.author)}</div>
              <div class="post-time">${timeAgo(p.timestamp)} ${tagHTML}</div>
            </div>
          </div>
          <div class="post-text">${escapeHTML(p.text)}</div>
          ${mediaSection}
          <div class="post-reactions">
            <div class="reaction-faces">
              ${likeData.count > 5 ? '<span class="reaction-icon">&#10084;&#65039;</span>' : ''}
              ${likeData.count > 50 ? '<span class="reaction-icon">&#128079;</span>' : ''}
              ${likeData.count > 100 ? '<span class="reaction-icon">&#128293;</span>' : ''}
              <span class="reaction-count">${likeData.count}</span>
            </div>
            <span class="reaction-comments">${comments.length} comments</span>
          </div>
          <div class="card-actions">
            <button class="action-btn btn-like ${likeData.liked ? 'liked' : ''}" data-id="${p.id}" aria-label="Like">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>Like</span>
            </button>
            <button class="action-btn btn-comment" data-id="${p.id}" aria-label="Comments">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Comment</span>
            </button>
            <span class="action-btn-spacer"></span>
            <button class="action-btn btn-share" data-id="${p.id}" aria-label="Share">
              <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span>Share</span>
            </button>
          </div>
          <div class="comments-section" id="comments-${p.id}">
            <div class="comments-list" id="comments-list-${p.id}">
              ${comments.length === 0 ? '<div class="no-comments">No comments yet. Be the first!</div>' :
          comments.map(c => `
                  <div class="comment">
                    <div class="comment-avatar">${getInitials(c.author)}</div>
                    <div class="comment-body">
                      <div class="comment-author">${escapeHTML(c.author)}</div>
                      <div class="comment-text">${escapeHTML(c.text)}</div>
                      <div class="comment-time">${c.time}</div>
                    </div>
                  </div>
                `).join('')
        }
            </div>
            <div class="comment-input-row">
              <input type="text" placeholder="Add a comment..." id="comment-input-${p.id}">
              <button data-id="${p.id}" class="btn-post-comment">Post</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (allPosts.length === 0) {
      feed.innerHTML = '<div class="empty-state">No posts found for this filter.</div>';
    }

    attachCardEvents(feed);
  }

  // ── Play Page — 3D Safety Drills (iframe) ──

  let playGameActive = null; // null = selection, 'loto' or 'deloto'

  function renderPlay() {
    const container = document.getElementById('play-container');

    if (playGameActive) {
      renderGameIframe(container, playGameActive);
      return;
    }

    container.innerHTML = `
      <div class="game-grid">
        <!-- LOTO Game Card -->
        <div class="game-launch-card" data-game="loto">
          <div class="game-launch-preview">
            <svg viewBox="0 0 400 225" class="game-preview-svg">
              <defs>
                <linearGradient id="gpBg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0a0d10"/><stop offset="100%" stop-color="#161b22"/>
                </linearGradient>
              </defs>
              <rect width="400" height="225" fill="url(#gpBg1)"/>
              <g opacity="0.12">
                <line x1="0" y1="160" x2="400" y2="160" stroke="#3a434c"/>
                <line x1="80" y1="160" x2="80" y2="225" stroke="#3a434c"/>
                <line x1="160" y1="160" x2="160" y2="225" stroke="#3a434c"/>
                <line x1="240" y1="160" x2="240" y2="225" stroke="#3a434c"/>
                <line x1="320" y1="160" x2="320" y2="225" stroke="#3a434c"/>
                <line x1="0" y1="190" x2="400" y2="190" stroke="#3a434c"/>
              </g>
              <ellipse cx="200" cy="115" rx="50" ry="18" fill="none" stroke="#F5B301" stroke-width="2" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/>
              </ellipse>
              <rect x="175" y="75" width="50" height="50" rx="4" fill="#2a3037" stroke="#3a434c" stroke-width="1.5"/>
              <rect x="185" y="85" width="30" height="15" rx="2" fill="#E23A30">
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
              </rect>
              <circle cx="165" cy="100" r="10" fill="none" stroke="#444c54" stroke-width="3">
                <animateTransform attributeName="transform" type="rotate" values="0 165 100;360 165 100" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="195" cy="80" r="2" fill="#ffd27a" opacity="0.8">
                <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="210" cy="76" r="1.5" fill="#ffd27a" opacity="0.6">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="0.25s" repeatCount="indefinite"/>
              </circle>
              <rect x="55" y="95" width="8" height="28" rx="2" fill="#2c333a" stroke="#3a434c" stroke-width="1"/>
              <rect x="64" y="102" width="3" height="8" rx="1" fill="#F5B301"/>
              <rect x="55" y="145" width="8" height="18" rx="1" fill="#3a424a"/>
              <rect x="56" y="142" width="6" height="5" rx="1" fill="#E23A30"/>
              <circle cx="340" cy="105" r="8" fill="none" stroke="#c23b30" stroke-width="2"/>
              <rect x="185" y="170" width="30" height="14" rx="2" fill="#2c333a" stroke="#3a434c" stroke-width="1"/>
              <rect x="190" y="163" width="20" height="10" rx="1" fill="#18b5c8" opacity="0.6"/>
              <g>
                <rect x="196" y="195" width="8" height="12" rx="1" fill="#ff7a18"/>
                <rect x="195" y="201" width="10" height="2" rx="1" fill="#e5edf3"/>
                <circle cx="200" cy="192" r="3.5" fill="#e0b48c"/>
                <rect x="195" y="188" width="10" height="4" rx="2" fill="#F5B301"/>
              </g>
              <text x="200" y="28" text-anchor="middle" fill="#F5B301" font-size="11" font-weight="bold" font-family="monospace" letter-spacing="3">ZERO ENERGY</text>
              <text x="200" y="44" text-anchor="middle" fill="#8A929B" font-size="8" font-family="sans-serif">LOTO 3D Safety Drill</text>
            </svg>
            <div class="game-preview-overlay">
              <button class="game-play-circle">
                <svg viewBox="0 0 24 24" width="32" height="32"><polygon points="6,3 20,12 6,21" fill="#fff"/></svg>
              </button>
            </div>
          </div>
          <div class="game-launch-info">
            <div class="game-badge game-badge-loto">LOTO</div>
            <h3>Lockout Tagout</h3>
            <p>Isolate, lock, tag, verify &mdash; get the machine to zero energy before you touch it.</p>
            <button class="game-start-btn">
              <svg viewBox="0 0 24 24" width="16" height="16"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
              Start Drill
            </button>
          </div>
        </div>

        <!-- De-LOTO Game Card -->
        <div class="game-launch-card" data-game="deloto">
          <div class="game-launch-preview">
            <svg viewBox="0 0 400 225" class="game-preview-svg">
              <defs>
                <linearGradient id="gpBg2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0a100d"/><stop offset="100%" stop-color="#14201b"/>
                </linearGradient>
              </defs>
              <rect width="400" height="225" fill="url(#gpBg2)"/>
              <g opacity="0.12">
                <line x1="0" y1="160" x2="400" y2="160" stroke="#3a434c"/>
                <line x1="80" y1="160" x2="80" y2="225" stroke="#3a434c"/>
                <line x1="160" y1="160" x2="160" y2="225" stroke="#3a434c"/>
                <line x1="240" y1="160" x2="240" y2="225" stroke="#3a434c"/>
                <line x1="320" y1="160" x2="320" y2="225" stroke="#3a434c"/>
                <line x1="0" y1="190" x2="400" y2="190" stroke="#3a434c"/>
              </g>
              <!-- Safe ring (green) -->
              <ellipse cx="200" cy="115" rx="50" ry="18" fill="none" stroke="#25C281" stroke-width="2" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite"/>
              </ellipse>
              <!-- Machine (locked out, green core) -->
              <rect x="175" y="75" width="50" height="50" rx="4" fill="#2a3037" stroke="#3a434c" stroke-width="1.5"/>
              <rect x="185" y="85" width="30" height="15" rx="2" fill="#25C281" opacity="0.6"/>
              <!-- Rotor (stopped) -->
              <circle cx="165" cy="100" r="10" fill="none" stroke="#444c54" stroke-width="3"/>
              <!-- Lock on machine -->
              <rect x="193" y="130" width="14" height="11" rx="2" fill="#E23A30"/>
              <rect x="196" y="124" width="8" height="8" rx="4" fill="none" stroke="#E23A30" stroke-width="2.5"/>
              <!-- Guard panel on floor -->
              <rect x="230" y="140" width="22" height="14" rx="2" fill="#6b7480" opacity="0.6" stroke="#8a929b" stroke-width="0.8"/>
              <!-- Toolbox on floor -->
              <rect x="145" y="145" width="12" height="7" rx="1" fill="#c23b30" opacity="0.6"/>
              <!-- Colleague (blue vest) near machine -->
              <g>
                <rect x="218" y="96" width="7" height="10" rx="1" fill="#2b8cff"/>
                <rect x="217" y="101" width="9" height="2" rx="1" fill="#e5edf3"/>
                <circle cx="222" cy="93" r="3" fill="#e0b48c"/>
                <rect x="218" y="90" width="8" height="3.5" rx="2" fill="#2b8cff"/>
              </g>
              <!-- Worker (orange vest) -->
              <g>
                <rect x="196" y="195" width="8" height="12" rx="1" fill="#ff7a18"/>
                <rect x="195" y="201" width="10" height="2" rx="1" fill="#e5edf3"/>
                <circle cx="200" cy="192" r="3.5" fill="#e0b48c"/>
                <rect x="195" y="188" width="10" height="4" rx="2" fill="#F5B301"/>
              </g>
              <!-- Breaker panel -->
              <rect x="55" y="90" width="8" height="30" rx="2" fill="#2c333a" stroke="#3a434c" stroke-width="1"/>
              <rect x="64" y="102" width="3" height="8" rx="1" fill="#E23A30"/>
              <!-- Warning horn -->
              <rect x="335" y="90" width="4" height="28" rx="1" fill="#3a424a"/>
              <rect x="330" y="85" width="14" height="8" rx="2" fill="#F5B301" opacity="0.6"/>
              <text x="200" y="28" text-anchor="middle" fill="#18b5c8" font-size="11" font-weight="bold" font-family="monospace" letter-spacing="3">BACK IN SERVICE</text>
              <text x="200" y="44" text-anchor="middle" fill="#8A929B" font-size="8" font-family="sans-serif">de-LOTO 3D Safety Drill</text>
            </svg>
            <div class="game-preview-overlay">
              <button class="game-play-circle game-play-circle-cyan">
                <svg viewBox="0 0 24 24" width="32" height="32"><polygon points="6,3 20,12 6,21" fill="#fff"/></svg>
              </button>
            </div>
          </div>
          <div class="game-launch-info">
            <div class="game-badge game-badge-deloto">de-LOTO</div>
            <h3>Return to Service</h3>
            <p>Clear tools, account for personnel, remove the lock &mdash; then power it back up safely.</p>
            <button class="game-start-btn game-start-btn-cyan">
              <svg viewBox="0 0 24 24" width="16" height="16"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
              Start Drill
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.game-launch-card').forEach(card => {
      const game = card.dataset.game;
      const playCircle = card.querySelector('.game-play-circle');
      const startBtn = card.querySelector('.game-start-btn');
      const launch = () => { playGameActive = game; renderPlay(); };
      playCircle.addEventListener('click', launch);
      startBtn.addEventListener('click', launch);
    });
  }

  function renderGameIframe(container, game) {
    const src = game === 'loto' ? 'loto-3d-game-en.html' : 'de-loto-3d-game-en.html';
    container.innerHTML = `
      <div class="game-iframe-wrap">
        <button class="game-iframe-back" id="gameIframeBack">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"/></svg>
          Back
        </button>
        <iframe src="${src}" class="game-iframe" allowfullscreen></iframe>
      </div>
    `;

    document.getElementById('gameIframeBack').addEventListener('click', () => {
      playGameActive = null;
      renderPlay();
    });
  }

  // ── Trending filter chips ──
  document.querySelectorAll('.trending-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.trending-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderShare();
    });
  });

  // ── Card / Post Events (scoped to container) ──
  function attachCardEvents(container) {
    container.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', async function () {
        const id = this.dataset.id;
        const numId = isNaN(Number(id)) ? id : Number(id);
        if (!state.likes[numId]) state.likes[numId] = { count: 0, liked: false };
        const ld = state.likes[numId];
        ld.liked = !ld.liked;
        ld.count += ld.liked ? 1 : -1;

        if (ld.liked) { ApiService.likeVideo(numId); }
        else { ApiService.unlikeVideo(numId); }

        saveState();
        this.classList.toggle('liked', ld.liked);

        // Animate like
        if (ld.liked) {
          this.classList.add('like-pop');
          setTimeout(() => this.classList.remove('like-pop'), 300);
        }

        const parentPost = this.closest('.discover-post');
        if (parentPost) {
          const countEl = parentPost.querySelector('.reaction-count');
          if (countEl) countEl.textContent = ld.count;
        } else {
          this.querySelector('span').textContent = ld.count;
        }
      });
    });

    container.querySelectorAll('.btn-comment').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.id;
        const section = document.getElementById('comments-' + id);
        section.classList.toggle('open');
        if (section.classList.contains('open')) {
          document.getElementById('comment-input-' + id).focus();
        }
      });
    });

    container.querySelectorAll('.btn-post-comment').forEach(btn => {
      btn.addEventListener('click', function () {
        postComment(this.dataset.id);
      });
    });

    container.querySelectorAll('[id^="comment-input-"]').forEach(input => {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          postComment(this.id.replace('comment-input-', ''));
        }
      });
    });

    container.querySelectorAll('.btn-share').forEach(btn => {
      btn.addEventListener('click', function () {
        showToast('Link copied to clipboard!');
      });
    });

    container.querySelectorAll('.card-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', function () {
        showToast('Video playback coming soon!');
      });
    });
  }

  async function postComment(videoId) {
    const input = document.getElementById('comment-input-' + videoId);
    const text = input.value.trim();
    if (!text) return;

    const newComment = await ApiService.postComment(videoId, text);

    if (!state.comments[videoId]) state.comments[videoId] = [];
    state.comments[videoId].push(newComment);
    saveState();

    const listEl = document.getElementById('comments-list-' + videoId);
    const comments = state.comments[videoId];
    listEl.innerHTML = comments.map(c => `
      <div class="comment">
        <div class="comment-avatar">${getInitials(c.author)}</div>
        <div class="comment-body">
          <div class="comment-author">${escapeHTML(c.author)}</div>
          <div class="comment-text">${escapeHTML(c.text)}</div>
          <div class="comment-time">${c.time}</div>
        </div>
      </div>
    `).join('');

    // Update comment count
    const parentPost = document.querySelector(`.discover-post[data-id="${videoId}"]`);
    if (parentPost) {
      const el = parentPost.querySelector('.reaction-comments');
      if (el) el.textContent = comments.length + ' comments';
    } else {
      const btn = document.querySelector(`.btn-comment[data-id="${videoId}"] span`);
      if (btn) btn.textContent = comments.length;
    }

    input.value = '';
    listEl.scrollTop = listEl.scrollHeight;
  }

  // ── Search ──
  let searchTimeout;
  document.getElementById('searchInput').addEventListener('input', function () {
    clearTimeout(searchTimeout);
    const val = this.value;
    searchTimeout = setTimeout(() => {
      if (currentPage === 'learn') renderFeed(val);
    }, 250);
  });

  // ── Create Post Modal ──
  const createPostModal = document.getElementById('createPostModal');
  const createPostClose = document.getElementById('createPostClose');
  const createPostTrigger = document.getElementById('createPostTrigger');
  const createPostForm = document.getElementById('createPostForm');
  const postFileArea = document.getElementById('postFileArea');
  const postFileInput = document.getElementById('postFileInput');
  const postFileNameDisplay = document.getElementById('postFileName');

  function openCreatePostModal() {
    if (!createPostModal) return;
    createPostModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('postText').focus(), 100);
  }

  function closeCreatePostModal() {
    if (!createPostModal) return;
    createPostModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (createPostTrigger) createPostTrigger.addEventListener('click', openCreatePostModal);
  // Also open from the action buttons
  document.getElementById('createPostPhoto')?.addEventListener('click', openCreatePostModal);
  document.getElementById('createPostVideo')?.addEventListener('click', openCreatePostModal);
  document.getElementById('createPostLocation')?.addEventListener('click', openCreatePostModal);

  if (createPostClose) createPostClose.addEventListener('click', closeCreatePostModal);
  if (createPostModal) createPostModal.addEventListener('click', function (e) { if (e.target === createPostModal) closeCreatePostModal(); });
  if (postFileArea && postFileInput) postFileArea.addEventListener('click', () => postFileInput.click());
  if (postFileInput) postFileInput.addEventListener('change', function () {
    if (this.files.length > 0 && postFileNameDisplay) postFileNameDisplay.textContent = this.files[0].name;
  });

  if (createPostForm) createPostForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const text = document.getElementById('postText').value.trim();
    if (!text) { showToast('Please write something to share.'); return; }

    const hasVideo = postFileInput && postFileInput.files.length > 0;
    const videoTitle = hasVideo ? postFileInput.files[0].name.replace(/\.[^/.]+$/, '') : '';

    const newPost = await ApiService.createDiscoverPost({
      text,
      hasVideo,
      videoTitle
    });

    state.discoverPosts.unshift(newPost);
    state.likes[newPost.id] = { count: 0, liked: false };
    state.comments[newPost.id] = [];
    saveState();

    this.reset();
    if (postFileNameDisplay) postFileNameDisplay.textContent = '';
    closeCreatePostModal();
    renderShare();
    showToast('Post shared successfully!');
  });

  // ── Upload Modal (hidden for now, safe-guarded) ──
  const modal = document.getElementById('uploadModal');
  const fileInput = document.getElementById('fileInput');
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileNameDisplay = document.getElementById('fileName');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  const modalClose = document.getElementById('modalClose');
  const uploadForm = document.getElementById('uploadForm');

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  if (fileUploadArea && fileInput) fileUploadArea.addEventListener('click', () => fileInput.click());
  if (fileInput) fileInput.addEventListener('change', function () {
    if (this.files.length > 0 && fileNameDisplay) fileNameDisplay.textContent = this.files[0].name;
  });

  if (uploadForm) uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const title = document.getElementById('videoTitle').value.trim();
    const desc = document.getElementById('videoDesc').value.trim();
    const cat = document.getElementById('videoCat').value;
    if (!title || !desc || !cat) { showToast('Please fill in all fields.'); return; }
    const formData = new FormData();
    formData.set('title', title);
    formData.set('description', desc);
    formData.set('category', cat);
    if (fileInput && fileInput.files.length > 0) formData.set('video', fileInput.files[0]);
    const newVideo = await ApiService.uploadVideo(formData);
    state.userVideos.unshift(newVideo);
    state.likes[newVideo.id] = { count: 0, liked: false };
    state.comments[newVideo.id] = [];
    saveState();
    this.reset();
    if (fileNameDisplay) fileNameDisplay.textContent = '';
    closeModal();
    renderFeed(document.getElementById('searchInput').value);
    showToast('Video uploaded successfully!');
  });

  // ── Nav routing ──
  document.querySelectorAll('.side-nav a, .bottom-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.dataset.nav;
      if (page && page !== currentPage) {
        navigateTo(page);
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (createPostModal && createPostModal.classList.contains('open')) closeCreatePostModal();
      else if (modal && modal.classList.contains('open')) closeModal();
    }
  });

  // ── Home page nav buttons (including SVG hotspots) ──
  document.querySelectorAll('#page-home [data-nav]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.dataset.nav || this.getAttribute('data-nav');
      if (page) navigateTo(page);
    });
  });

  // ── Init — Home is the default page ──

})();
