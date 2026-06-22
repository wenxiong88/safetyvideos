/**
 * Safety Reminder — API Service Layer
 *
 * Set ApiService.BASE_URL to your backend endpoint to switch from mock data to real API.
 * Example: ApiService.BASE_URL = 'https://your-api.azurewebsites.net/api';
 */
const ApiService = (() => {
  let BASE_URL = ''; // empty = local mock mode

  // ── SVG Thumbnail Generators ──
  let _svgId = 0;
  function svg(bg1, bg2, inner) {
    const uid = 'svgbg' + (++_svgId);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
      <defs><linearGradient id="${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/>
      </linearGradient></defs>
      <rect width="400" height="225" fill="url(#${uid})"/>
      ${inner}
    </svg>`;
  }

  const THUMBNAILS = {
    1: svg('#3F51B5','#7986CB', `
      <g opacity="0.9">
        <!-- manhole circle -->
        <ellipse cx="200" cy="130" rx="60" ry="20" fill="none" stroke="#fff" stroke-width="3"/>
        <ellipse cx="200" cy="128" rx="60" ry="20" fill="#2c387e"/>
        <rect x="170" y="70" width="60" height="60" rx="4" fill="none" stroke="#fff" stroke-width="2.5"/>
        <line x1="170" y1="80" x2="230" y2="80" stroke="#FFD54F" stroke-width="3"/>
        <line x1="170" y1="90" x2="230" y2="90" stroke="#333" stroke-width="3"/>
        <line x1="170" y1="100" x2="230" y2="100" stroke="#FFD54F" stroke-width="3"/>
        <line x1="170" y1="110" x2="230" y2="110" stroke="#333" stroke-width="3"/>
        <line x1="170" y1="120" x2="230" y2="120" stroke="#FFD54F" stroke-width="3"/>
        <!-- warning triangle -->
        <polygon points="200,38 218,68 182,68" fill="none" stroke="#FFD54F" stroke-width="2.5"/>
        <text x="200" y="63" text-anchor="middle" fill="#FFD54F" font-size="18" font-weight="bold">!</text>
        <!-- person silhouette going in -->
        <circle cx="148" cy="95" r="8" fill="rgba(255,255,255,0.7)"/>
        <line x1="148" y1="103" x2="148" y2="125" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
        <line x1="148" y1="110" x2="138" y2="118" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
        <line x1="148" y1="110" x2="158" y2="118" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
      </g>
      <text x="200" y="175" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">CONFINED SPACE</text>
    `),

    2: svg('#00796B','#00A19C', `
      <g opacity="0.9">
        <!-- hard hat -->
        <path d="M160,95 Q200,55 240,95 L245,105 Q200,100 155,105 Z" fill="#FFD54F" stroke="#fff" stroke-width="1.5"/>
        <rect x="155" y="102" width="90" height="8" rx="3" fill="#F9A825"/>
        <!-- safety vest -->
        <path d="M170,120 L165,170 Q200,175 235,170 L230,120 Z" fill="#FF8F00" stroke="#fff" stroke-width="1.5"/>
        <line x1="185" y1="120" x2="182" y2="170" stroke="#fff" stroke-width="2.5"/>
        <line x1="215" y1="120" x2="218" y2="170" stroke="#fff" stroke-width="2.5"/>
        <line x1="168" y1="140" x2="232" y2="140" stroke="#fff" stroke-width="2"/>
        <!-- goggles -->
        <ellipse cx="188" cy="82" rx="14" ry="9" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <ellipse cx="212" cy="82" rx="14" ry="9" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="202" y1="82" x2="198" y2="82" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
      </g>
      <text x="200" y="200" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">CORRECT USE OF PPE</text>
    `),

    3: svg('#E65100','#FF9800', `
      <g opacity="0.9">
        <!-- gas detector body -->
        <rect x="165" y="55" width="70" height="110" rx="10" fill="#333" stroke="#fff" stroke-width="2"/>
        <rect x="175" y="65" width="50" height="35" rx="4" fill="#1B5E20"/>
        <!-- screen readings -->
        <text x="200" y="82" text-anchor="middle" fill="#4CAF50" font-family="monospace" font-size="10">O2  20.9%</text>
        <text x="200" y="94" text-anchor="middle" fill="#4CAF50" font-family="monospace" font-size="10">LEL  0.0%</text>
        <!-- sensor dots -->
        <circle cx="180" cy="115" r="5" fill="#546E7A" stroke="#fff" stroke-width="1"/>
        <circle cx="200" cy="115" r="5" fill="#546E7A" stroke="#fff" stroke-width="1"/>
        <circle cx="220" cy="115" r="5" fill="#546E7A" stroke="#fff" stroke-width="1"/>
        <!-- buttons -->
        <circle cx="185" cy="140" r="6" fill="#E53935"/>
        <circle cx="215" cy="140" r="6" fill="#43A047"/>
        <!-- clip -->
        <rect x="192" y="165" width="16" height="12" rx="2" fill="#777" stroke="#fff" stroke-width="1"/>
      </g>
      <text x="200" y="200" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">CSE &mdash; GAS CHECKS</text>
    `),

    4: svg('#F9A825','#FDD835', `
      <g opacity="0.9">
        <!-- lightning bolt -->
        <polygon points="210,40 180,105 200,105 175,170 235,90 210,90 240,40" fill="#fff" stroke="#E65100" stroke-width="2"/>
        <!-- lock -->
        <rect x="265" y="100" width="40" height="35" rx="4" fill="#E53935" stroke="#fff" stroke-width="2"/>
        <path d="M275,100 L275,88 Q285,72 295,88 L295,100" fill="none" stroke="#fff" stroke-width="3"/>
        <circle cx="285" cy="118" r="4" fill="#fff"/>
        <!-- tag -->
        <rect x="95" y="95" width="50" height="70" rx="3" fill="#fff" stroke="#E53935" stroke-width="2"/>
        <text x="120" y="120" text-anchor="middle" fill="#E53935" font-size="10" font-weight="bold">DANGER</text>
        <text x="120" y="135" text-anchor="middle" fill="#333" font-size="8">DO NOT</text>
        <text x="120" y="145" text-anchor="middle" fill="#333" font-size="8">OPERATE</text>
        <circle cx="120" cy="100" r="5" fill="none" stroke="#E53935" stroke-width="1.5"/>
      </g>
      <text x="200" y="205" text-anchor="middle" fill="rgba(0,0,0,0.6)" font-family="sans-serif" font-size="16" font-weight="600">ELECTRICAL SAFETY</text>
    `),

    5: svg('#5D4037','#8D6E63', `
      <g opacity="0.9">
        <!-- trench cross section -->
        <rect x="80" y="60" width="240" height="130" fill="#3E2723" stroke="#fff" stroke-width="1.5"/>
        <rect x="140" y="60" width="120" height="130" fill="#4E342E"/>
        <!-- ground level -->
        <line x1="60" y1="60" x2="340" y2="60" stroke="#8BC34A" stroke-width="4"/>
        <!-- shoring -->
        <rect x="145" y="65" width="6" height="120" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <rect x="249" y="65" width="6" height="120" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <!-- cross braces -->
        <rect x="151" y="80" width="98" height="5" rx="2" fill="#FF8F00" stroke="#fff" stroke-width="1"/>
        <rect x="151" y="120" width="98" height="5" rx="2" fill="#FF8F00" stroke="#fff" stroke-width="1"/>
        <rect x="151" y="160" width="98" height="5" rx="2" fill="#FF8F00" stroke="#fff" stroke-width="1"/>
        <!-- soil texture -->
        <circle cx="110" cy="90" r="3" fill="rgba(255,255,255,0.15)"/>
        <circle cx="290" cy="110" r="4" fill="rgba(255,255,255,0.15)"/>
        <circle cx="105" cy="150" r="2" fill="rgba(255,255,255,0.15)"/>
        <circle cx="300" cy="160" r="3" fill="rgba(255,255,255,0.15)"/>
      </g>
      <text x="200" y="210" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">EXCAVATION</text>
    `),

    6: svg('#0D47A1','#1976D2', `
      <g opacity="0.9">
        <!-- crane boom -->
        <line x1="80" y1="170" x2="80" y2="40" stroke="#FFD54F" stroke-width="5"/>
        <line x1="80" y1="45" x2="250" y2="45" stroke="#FFD54F" stroke-width="4"/>
        <!-- cable -->
        <line x1="220" y1="45" x2="220" y2="90" stroke="#fff" stroke-width="1.5" stroke-dasharray="4,3"/>
        <!-- hook -->
        <path d="M215,90 Q220,100 225,90" fill="none" stroke="#fff" stroke-width="2.5"/>
        <circle cx="220" cy="88" r="4" fill="#FFD54F"/>
        <!-- barricade tape -->
        <line x1="120" y1="130" x2="320" y2="130" stroke="#E53935" stroke-width="3"/>
        <line x1="120" y1="135" x2="320" y2="135" stroke="#fff" stroke-width="1"/>
        <!-- barricade posts -->
        <rect x="118" y="125" width="6" height="40" rx="2" fill="#FF8F00"/>
        <rect x="208" y="125" width="6" height="40" rx="2" fill="#FF8F00"/>
        <rect x="298" y="125" width="6" height="40" rx="2" fill="#FF8F00"/>
        <!-- warning sign -->
        <rect x="280" y="70" width="50" height="40" rx="3" fill="#FFD54F" stroke="#333" stroke-width="1.5"/>
        <text x="305" y="88" text-anchor="middle" fill="#333" font-size="8" font-weight="bold">LIFTING</text>
        <text x="305" y="100" text-anchor="middle" fill="#333" font-size="7">IN PROGRESS</text>
      </g>
      <text x="200" y="195" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="14" font-weight="600">LIFTING &mdash; BARRICADES &amp; SIGNS</text>
    `),

    7: svg('#1565C0','#42A5F5', `
      <g opacity="0.9">
        <!-- crane hook -->
        <line x1="200" y1="20" x2="200" y2="70" stroke="#ccc" stroke-width="2"/>
        <path d="M188,72 Q200,95 212,72" fill="none" stroke="#FFD54F" stroke-width="3.5"/>
        <circle cx="200" cy="70" r="6" fill="#FFD54F" stroke="#fff" stroke-width="1.5"/>
        <!-- load -->
        <rect x="170" y="100" width="60" height="40" rx="4" fill="#546E7A" stroke="#fff" stroke-width="1.5"/>
        <line x1="185" y1="100" x2="195" y2="72" stroke="#999" stroke-width="1.5"/>
        <line x1="215" y1="100" x2="205" y2="72" stroke="#999" stroke-width="1.5"/>
        <!-- tagline rope -->
        <path d="M230,120 Q260,115 280,135 Q300,155 310,150" fill="none" stroke="#FFD54F" stroke-width="3" stroke-linecap="round"/>
        <!-- person holding tagline -->
        <circle cx="315" cy="135" r="8" fill="rgba(255,255,255,0.8)"/>
        <line x1="315" y1="143" x2="315" y2="168" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/>
        <line x1="315" y1="150" x2="305" y2="158" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="315" y1="150" x2="310" y2="148" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="315" y1="168" x2="308" y2="180" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="315" y1="168" x2="322" y2="180" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
      </g>
      <text x="200" y="205" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="14" font-weight="600">LIFTING OPERATION &mdash; TAGLINE</text>
    `),

    8: svg('#37474F','#607D8B', `
      <g opacity="0.9">
        <!-- clipboard -->
        <rect x="145" y="45" width="110" height="140" rx="6" fill="#ECEFF1" stroke="#fff" stroke-width="2"/>
        <rect x="175" y="38" width="50" height="16" rx="8" fill="#90A4AE" stroke="#fff" stroke-width="1.5"/>
        <!-- checklist items -->
        <rect x="162" y="70" width="14" height="14" rx="2" fill="none" stroke="#43A047" stroke-width="2"/>
        <polyline points="165,78 169,82 176,72" fill="none" stroke="#43A047" stroke-width="2"/>
        <rect x="184" y="73" width="55" height="6" rx="3" fill="#B0BEC5"/>
        <rect x="162" y="95" width="14" height="14" rx="2" fill="none" stroke="#43A047" stroke-width="2"/>
        <polyline points="165,103 169,107 176,97" fill="none" stroke="#43A047" stroke-width="2"/>
        <rect x="184" y="98" width="45" height="6" rx="3" fill="#B0BEC5"/>
        <rect x="162" y="120" width="14" height="14" rx="2" fill="none" stroke="#43A047" stroke-width="2"/>
        <polyline points="165,128 169,132 176,122" fill="none" stroke="#43A047" stroke-width="2"/>
        <rect x="184" y="123" width="50" height="6" rx="3" fill="#B0BEC5"/>
        <rect x="162" y="145" width="14" height="14" rx="2" fill="none" stroke="#FF8F00" stroke-width="2"/>
        <rect x="184" y="148" width="40" height="6" rx="3" fill="#B0BEC5"/>
        <!-- pencil -->
        <line x1="270" y1="120" x2="290" y2="80" stroke="#FFD54F" stroke-width="4" stroke-linecap="round"/>
        <polygon points="290,80 293,70 287,70" fill="#FFD54F"/>
      </g>
      <text x="200" y="207" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">TOOL BOX TALK</text>
    `),

    9: svg('#BF360C','#FF7043', `
      <g opacity="0.9">
        <!-- gas flame -->
        <path d="M180,160 Q160,120 175,80 Q185,100 190,70 Q200,110 210,60 Q215,100 225,80 Q240,120 220,160 Z" fill="#FFD54F" opacity="0.8"/>
        <path d="M190,160 Q180,130 190,100 Q200,125 210,95 Q220,130 210,160 Z" fill="#FF8F00" opacity="0.9"/>
        <path d="M195,160 Q190,140 200,120 Q210,140 205,160 Z" fill="#fff" opacity="0.6"/>
        <!-- IS badge -->
        <circle cx="300" cy="100" r="35" fill="#1565C0" stroke="#fff" stroke-width="2.5"/>
        <text x="300" y="95" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold" font-family="sans-serif">IS</text>
        <text x="300" y="112" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8" font-family="sans-serif">CERTIFIED</text>
        <!-- warning stripes at bottom -->
        <rect x="0" y="175" width="400" height="8" fill="#FFD54F"/>
        <line x1="0" y1="175" x2="20" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="20" y1="175" x2="40" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="40" y1="175" x2="60" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="60" y1="175" x2="80" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="80" y1="175" x2="100" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="100" y1="175" x2="120" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="120" y1="175" x2="140" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="140" y1="175" x2="160" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="160" y1="175" x2="180" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="180" y1="175" x2="200" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="200" y1="175" x2="220" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="220" y1="175" x2="240" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="240" y1="175" x2="260" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="260" y1="175" x2="280" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="280" y1="175" x2="300" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="300" y1="175" x2="320" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="320" y1="175" x2="340" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="340" y1="175" x2="360" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="360" y1="175" x2="380" y2="183" stroke="#333" stroke-width="4"/>
        <line x1="380" y1="175" x2="400" y2="183" stroke="#333" stroke-width="4"/>
      </g>
      <text x="200" y="205" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="13" font-weight="600">WORKING IN GAS AREA &mdash; IS EQUIPMENT</text>
    `),

    10: svg('#1B5E20','#43A047', `
      <g opacity="0.9">
        <!-- water waves -->
        <path d="M0,155 Q50,145 100,155 Q150,165 200,155 Q250,145 300,155 Q350,165 400,155 L400,225 L0,225 Z" fill="#0277BD" opacity="0.5"/>
        <path d="M0,165 Q50,155 100,165 Q150,175 200,165 Q250,155 300,165 Q350,175 400,165 L400,225 L0,225 Z" fill="#01579B" opacity="0.4"/>
        <!-- floating platform -->
        <rect x="80" y="100" width="240" height="50" rx="4" fill="#546E7A" stroke="#fff" stroke-width="1.5"/>
        <!-- solar panels -->
        <rect x="95" y="60" width="55" height="38" rx="2" fill="#1A237E" stroke="#42A5F5" stroke-width="1.5"/>
        <line x1="95" y1="73" x2="150" y2="73" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="95" y1="85" x2="150" y2="85" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="113" y1="60" x2="113" y2="98" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="131" y1="60" x2="131" y2="98" stroke="#42A5F5" stroke-width="0.8"/>
        <rect x="170" y="60" width="55" height="38" rx="2" fill="#1A237E" stroke="#42A5F5" stroke-width="1.5"/>
        <line x1="170" y1="73" x2="225" y2="73" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="170" y1="85" x2="225" y2="85" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="188" y1="60" x2="188" y2="98" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="206" y1="60" x2="206" y2="98" stroke="#42A5F5" stroke-width="0.8"/>
        <rect x="245" y="60" width="55" height="38" rx="2" fill="#1A237E" stroke="#42A5F5" stroke-width="1.5"/>
        <line x1="245" y1="73" x2="300" y2="73" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="245" y1="85" x2="300" y2="85" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="263" y1="60" x2="263" y2="98" stroke="#42A5F5" stroke-width="0.8"/>
        <line x1="281" y1="60" x2="281" y2="98" stroke="#42A5F5" stroke-width="0.8"/>
        <!-- sun -->
        <circle cx="55" cy="40" r="18" fill="#FFD54F" opacity="0.8"/>
        <line x1="55" y1="15" x2="55" y2="8" stroke="#FFD54F" stroke-width="2" opacity="0.6"/>
        <line x1="55" y1="65" x2="55" y2="72" stroke="#FFD54F" stroke-width="2" opacity="0.6"/>
        <line x1="30" y1="40" x2="23" y2="40" stroke="#FFD54F" stroke-width="2" opacity="0.6"/>
        <line x1="80" y1="40" x2="87" y2="40" stroke="#FFD54F" stroke-width="2" opacity="0.6"/>
      </g>
      <text x="200" y="205" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="13" font-weight="600">WORKING ON FLOATING SOLAR PLATFORM</text>
    `),

    11: svg('#D84315','#FF8A65', `
      <g opacity="0.9">
        <!-- building cross section -->
        <rect x="60" y="100" width="280" height="90" fill="#5D4037" stroke="#fff" stroke-width="1.5"/>
        <!-- rooftop surface -->
        <rect x="50" y="90" width="300" height="14" rx="2" fill="#795548" stroke="#fff" stroke-width="1.5"/>
        <!-- edge protection railing -->
        <line x1="50" y1="90" x2="50" y2="60" stroke="#FFD54F" stroke-width="3"/>
        <line x1="350" y1="90" x2="350" y2="60" stroke="#FFD54F" stroke-width="3"/>
        <line x1="50" y1="65" x2="350" y2="65" stroke="#FFD54F" stroke-width="2.5"/>
        <line x1="50" y1="78" x2="350" y2="78" stroke="#FFD54F" stroke-width="2"/>
        <!-- mid posts -->
        <line x1="125" y1="90" x2="125" y2="60" stroke="#FFD54F" stroke-width="2"/>
        <line x1="200" y1="90" x2="200" y2="60" stroke="#FFD54F" stroke-width="2"/>
        <line x1="275" y1="90" x2="275" y2="60" stroke="#FFD54F" stroke-width="2"/>
        <!-- harness anchor point -->
        <circle cx="200" cy="85" r="6" fill="#E53935" stroke="#fff" stroke-width="2"/>
        <circle cx="200" cy="85" r="2" fill="#fff"/>
        <!-- person with harness -->
        <circle cx="240" cy="50" r="8" fill="rgba(255,255,255,0.8)"/>
        <line x1="240" y1="58" x2="240" y2="82" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/>
        <line x1="240" y1="65" x2="228" y2="75" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="240" y1="65" x2="252" y2="75" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <!-- harness line to anchor -->
        <path d="M240,62 Q225,55 206,85" fill="none" stroke="#43A047" stroke-width="2" stroke-dasharray="4,2"/>
      </g>
      <text x="200" y="210" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">WORKING ON ROOFTOP</text>
    `)
  };

  // ── Default SVG for user-uploaded videos ──
  function defaultThumbnail(title) {
    return svg('#546E7A','#90A4AE', `
      <g opacity="0.7">
        <rect x="160" y="65" width="80" height="55" rx="6" fill="none" stroke="#fff" stroke-width="2.5"/>
        <polygon points="190,78 190,108 215,93" fill="#fff"/>
      </g>
      <text x="200" y="155" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-size="13" font-weight="600">${title.toUpperCase().slice(0, 30)}</text>
    `);
  }

  // ── Mock Video Data ──
  const MOCK_VIDEOS = [
    {
      id: 1,
      title: 'Confined Space',
      desc: 'Entry procedures, atmospheric testing, and rescue planning for confined space operations. Covers permit requirements and ventilation protocols.',
      author: 'Ahmad Razak',
      category: 'confined',
      duration: '4:12',
      timestamp: '2026-06-20T09:15:00',
      defaultLikes: 87,
      defaultComments: [
        { author: 'Sarah K.', text: 'The atmospheric monitoring section is very thorough.', time: '2h ago' },
        { author: 'Wei Ming', text: 'We use this for all new hires onboarding now.', time: '5h ago' }
      ]
    },
    {
      id: 2,
      title: 'Correct Use of PPE',
      desc: 'Proper selection, inspection, and wearing of personal protective equipment including hard hats, safety glasses, gloves, and high-visibility vests.',
      author: 'Priya Nair',
      category: 'ppe',
      duration: '3:28',
      timestamp: '2026-06-19T14:30:00',
      defaultLikes: 124,
      defaultComments: [
        { author: 'Dave R.', text: 'Good reminder to check PPE before every shift.', time: '1d ago' },
        { author: 'Lina T.', text: 'The glove selection chart is really helpful.', time: '8h ago' }
      ]
    },
    {
      id: 3,
      title: 'CSE - Gas Checks',
      desc: 'Confined Space Entry gas detection procedures. How to calibrate and use 4-gas monitors, interpret readings, and respond to alarms.',
      author: 'Ahmad Razak',
      category: 'gas',
      duration: '2:45',
      timestamp: '2026-06-18T11:00:00',
      defaultLikes: 63,
      defaultComments: [
        { author: 'Tom H.', text: 'The calibration walkthrough is much clearer than the manual.', time: '2d ago' }
      ]
    },
    {
      id: 4,
      title: 'Electrical Safety',
      desc: 'Lockout/tagout procedures, arc flash awareness, and safe working distances for electrical installations and maintenance tasks.',
      author: 'Raj Kumar',
      category: 'electrical',
      duration: '4:35',
      timestamp: '2026-06-17T08:45:00',
      defaultLikes: 91,
      defaultComments: [
        { author: 'Jenny L.', text: 'The LOTO step-by-step demo is excellent.', time: '3d ago' },
        { author: 'Mark S.', text: 'Should be mandatory viewing before any electrical work.', time: '2d ago' }
      ]
    },
    {
      id: 5,
      title: 'Excavation',
      desc: 'Safe excavation practices including trench shoring, soil classification, underground service detection, and edge protection requirements.',
      author: 'Carlos Rivera',
      category: 'excavation',
      duration: '3:50',
      timestamp: '2026-06-16T16:20:00',
      defaultLikes: 56,
      defaultComments: [
        { author: 'Alex F.', text: 'The soil classification section cleared up a lot of confusion for our team.', time: '4d ago' }
      ]
    },
    {
      id: 6,
      title: 'Lifting - Barricades & Signs',
      desc: 'Correct placement of barricades and safety signage during lifting operations. Covers exclusion zones, warning signs, and traffic management.',
      author: 'Linda Chen',
      category: 'lifting',
      duration: '2:38',
      timestamp: '2026-06-15T10:30:00',
      defaultLikes: 72,
      defaultComments: [
        { author: 'Pat O.', text: 'The exclusion zone diagram is very clear.', time: '5d ago' },
        { author: 'Wei Ming', text: 'Sharing this with all our riggers.', time: '4d ago' }
      ]
    },
    {
      id: 7,
      title: 'Lifting Operation - Tagline',
      desc: 'Proper use of taglines during crane and lifting operations. Demonstrates correct handling techniques, positioning, and communication signals.',
      author: 'Linda Chen',
      category: 'lifting',
      duration: '2:55',
      timestamp: '2026-06-14T13:15:00',
      defaultLikes: 68,
      defaultComments: [
        { author: 'Steve C.', text: 'The hand signal reference at the end is a great quick guide.', time: '1w ago' }
      ]
    },
    {
      id: 8,
      title: 'Tool Box Talk',
      desc: 'How to conduct effective toolbox talks: preparation, engagement techniques, documentation, and follow-up actions for daily safety briefings.',
      author: 'Aisha Johnson',
      category: 'general',
      duration: '4:10',
      timestamp: '2026-06-13T07:50:00',
      defaultLikes: 105,
      defaultComments: [
        { author: 'Brian T.', text: 'The engagement techniques really work. Our participation is up.', time: '1w ago' },
        { author: 'Helen W.', text: 'We use the question-first approach from this video every morning.', time: '6d ago' }
      ]
    },
    {
      id: 9,
      title: 'Working in Gas Area - IS Equipment',
      desc: 'Intrinsically safe equipment requirements for gas hazard areas. Covers zone classifications, equipment certification, and prohibited items.',
      author: 'Raj Kumar',
      category: 'gas',
      duration: '28:15',
      timestamp: '2026-06-12T15:00:00',
      defaultLikes: 47,
      defaultComments: [
        { author: 'Nina R.', text: 'Very comprehensive. The zone classification map is bookmarked.', time: '1w ago' },
        { author: 'Ahmad Razak', text: 'Essential for anyone working on our gas facilities.', time: '6d ago' }
      ]
    },
    {
      id: 10,
      title: 'Working on Floating Solar Platform',
      desc: 'Safety procedures specific to floating solar farm operations including water hazards, fall protection, electrical isolation, and emergency rescue on water.',
      author: 'Priya Nair',
      category: 'solar',
      duration: '28:40',
      timestamp: '2026-06-11T09:30:00',
      defaultLikes: 93,
      defaultComments: [
        { author: 'Dan K.', text: 'Great coverage of the water rescue procedures.', time: '1w ago' },
        { author: 'Rosa M.', text: 'The PFD inspection checklist is very useful.', time: '10d ago' }
      ]
    },
    {
      id: 11,
      title: 'Working on Rooftop',
      desc: 'Rooftop work safety including fall protection systems, edge protection, fragile roof awareness, and weather condition assessments.',
      author: 'Carlos Rivera',
      category: 'wah',
      duration: '28:30',
      timestamp: '2026-06-10T12:00:00',
      defaultLikes: 81,
      defaultComments: [
        { author: 'Lina T.', text: 'The harness anchor point selection guide is really practical.', time: '2w ago' },
        { author: 'Chris B.', text: 'Good reminder about weather checks before going up.', time: '12d ago' }
      ]
    }
  ];

  // Attach thumbnails
  MOCK_VIDEOS.forEach(v => { v.thumbnail = THUMBNAILS[v.id]; });

  // ── API Methods ──
  async function apiGet(path) {
    if (!BASE_URL) return null;
    const res = await fetch(BASE_URL + path);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async function apiPost(path, body) {
    if (!BASE_URL) return null;
    const res = await fetch(BASE_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  return {
    get BASE_URL() { return BASE_URL; },
    set BASE_URL(url) { BASE_URL = url; },

    async getVideos(filter) {
      if (BASE_URL) {
        const params = filter ? `?q=${encodeURIComponent(filter)}` : '';
        return apiGet('/videos' + params);
      }
      let videos = MOCK_VIDEOS.map(v => ({ ...v }));
      if (filter) {
        const q = filter.toLowerCase();
        videos = videos.filter(v =>
          v.title.toLowerCase().includes(q) ||
          v.desc.toLowerCase().includes(q) ||
          v.author.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
        );
      }
      return videos;
    },

    async likeVideo(id) {
      if (BASE_URL) return apiPost(`/videos/${id}/like`);
      return { success: true };
    },

    async unlikeVideo(id) {
      if (BASE_URL) return apiPost(`/videos/${id}/unlike`);
      return { success: true };
    },

    async getComments(videoId) {
      if (BASE_URL) return apiGet(`/videos/${videoId}/comments`);
      const v = MOCK_VIDEOS.find(x => x.id === videoId);
      return v ? v.defaultComments.map(c => ({ ...c })) : [];
    },

    async postComment(videoId, text) {
      if (BASE_URL) return apiPost(`/videos/${videoId}/comments`, { text });
      return { author: 'You', text, time: 'just now' };
    },

    async uploadVideo(data) {
      if (BASE_URL) {
        const res = await fetch(BASE_URL + '/videos', {
          method: 'POST',
          body: data // FormData
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      }
      return {
        id: Date.now(),
        title: data.get ? data.get('title') : data.title,
        desc: data.get ? data.get('description') : data.desc,
        author: 'You',
        category: data.get ? data.get('category') : data.category,
        duration: '0:00',
        timestamp: new Date().toISOString(),
        thumbnail: defaultThumbnail(data.get ? data.get('title') : data.title),
        defaultLikes: 0,
        defaultComments: []
      };
    },

    CATEGORIES: {
      confined:     { label: 'Confined Space', cssClass: 'cat-confined' },
      ppe:          { label: 'PPE',            cssClass: 'cat-ppe' },
      gas:          { label: 'Gas Safety',     cssClass: 'cat-gas' },
      electrical:   { label: 'Electrical',     cssClass: 'cat-electrical' },
      excavation:   { label: 'Excavation',     cssClass: 'cat-excavation' },
      lifting:      { label: 'Lifting',        cssClass: 'cat-lifting' },
      general:      { label: 'General Safety', cssClass: 'cat-general' },
      hazard:       { label: 'Hazard Zone',    cssClass: 'cat-hazard' },
      solar:        { label: 'Solar',          cssClass: 'cat-solar' },
      wah:          { label: 'Work at Height', cssClass: 'cat-wah' }
    },

    defaultThumbnail
  };
})();
