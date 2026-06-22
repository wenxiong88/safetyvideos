/**
 * Safety Reminder — Application Logic
 * Depends on: api.js (ApiService)
 */
(function () {
  'use strict';

  // ── State ──
  const STORAGE_KEY = 'safetyReminder_v3';
  let state = loadState();
  let allVideos = [];

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return { likes: {}, comments: {}, userVideos: [] };
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

  // ── Init State for Videos ──
  function ensureVideoState(videos) {
    videos.forEach(v => {
      if (!state.likes[v.id]) {
        state.likes[v.id] = { count: v.defaultLikes || 0, liked: false };
      }
      if (!state.comments[v.id]) {
        state.comments[v.id] = (v.defaultComments || []).map(c => ({ ...c }));
      }
    });
    saveState();
  }

  // ── Render Feed ──
  async function renderFeed(filter) {
    const feed = document.getElementById('feed');

    // Fetch from API (or mock)
    const apiVideos = await ApiService.getVideos(filter);
    allVideos = apiVideos;
    ensureVideoState(allVideos);

    // Merge user-uploaded videos
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

    attachCardEvents();
  }

  // ── Card Events ──
  function attachCardEvents() {
    document.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', async function () {
        const id = Number(this.dataset.id);
        if (!state.likes[id]) state.likes[id] = { count: 0, liked: false };
        const ld = state.likes[id];
        ld.liked = !ld.liked;
        ld.count += ld.liked ? 1 : -1;

        // Fire API call (non-blocking)
        if (ld.liked) { ApiService.likeVideo(id); }
        else { ApiService.unlikeVideo(id); }

        saveState();
        this.classList.toggle('liked', ld.liked);
        this.querySelector('span').textContent = ld.count;
      });
    });

    document.querySelectorAll('.btn-comment').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.id;
        const section = document.getElementById('comments-' + id);
        section.classList.toggle('open');
        if (section.classList.contains('open')) {
          document.getElementById('comment-input-' + id).focus();
        }
      });
    });

    document.querySelectorAll('.btn-post-comment').forEach(btn => {
      btn.addEventListener('click', function () {
        postComment(Number(this.dataset.id));
      });
    });

    document.querySelectorAll('[id^="comment-input-"]').forEach(input => {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          postComment(Number(this.id.replace('comment-input-', '')));
        }
      });
    });

    document.querySelectorAll('.btn-share').forEach(btn => {
      btn.addEventListener('click', function () {
        showToast('Link copied to clipboard!');
      });
    });

    document.querySelectorAll('.card-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', function () {
        showToast('Video playback coming soon!');
      });
    });
  }

  async function postComment(videoId) {
    const input = document.getElementById('comment-input-' + videoId);
    const text = input.value.trim();
    if (!text) return;

    // Call API
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

    const btn = document.querySelector(`.btn-comment[data-id="${videoId}"] span`);
    if (btn) btn.textContent = comments.length;

    input.value = '';
    listEl.scrollTop = listEl.scrollHeight;
  }

  // ── Search ──
  let searchTimeout;
  document.getElementById('searchInput').addEventListener('input', function () {
    clearTimeout(searchTimeout);
    const val = this.value;
    searchTimeout = setTimeout(() => renderFeed(val), 250);
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

  // Bind only if elements exist (they may be commented out)
  const btnUploadHeader = document.getElementById('btnUploadHeader');
  const sideNavUpload = document.getElementById('sideNavUpload');
  const bottomNavUpload = document.getElementById('bottomNavUpload');
  const modalClose = document.getElementById('modalClose');
  const uploadForm = document.getElementById('uploadForm');

  if (btnUploadHeader) btnUploadHeader.addEventListener('click', openModal);
  if (sideNavUpload) sideNavUpload.addEventListener('click', e => { e.preventDefault(); openModal(); });
  if (bottomNavUpload) bottomNavUpload.addEventListener('click', e => { e.preventDefault(); openModal(); });
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

  // ── Nav active state ──
  document.querySelectorAll('.side-nav a, .bottom-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.side-nav a, .bottom-nav a').forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`[data-nav="${this.dataset.nav}"]`).forEach(l => l.classList.add('active'));
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  // ── Init ──
  renderFeed();

})();
