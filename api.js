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
        <ellipse cx="200" cy="130" rx="60" ry="20" fill="none" stroke="#fff" stroke-width="3"/>
        <ellipse cx="200" cy="128" rx="60" ry="20" fill="#2c387e"/>
        <rect x="170" y="70" width="60" height="60" rx="4" fill="none" stroke="#fff" stroke-width="2.5"/>
        <line x1="170" y1="80" x2="230" y2="80" stroke="#FFD54F" stroke-width="3"/>
        <line x1="170" y1="90" x2="230" y2="90" stroke="#333" stroke-width="3"/>
        <line x1="170" y1="100" x2="230" y2="100" stroke="#FFD54F" stroke-width="3"/>
        <line x1="170" y1="110" x2="230" y2="110" stroke="#333" stroke-width="3"/>
        <line x1="170" y1="120" x2="230" y2="120" stroke="#FFD54F" stroke-width="3"/>
        <polygon points="200,38 218,68 182,68" fill="none" stroke="#FFD54F" stroke-width="2.5"/>
        <text x="200" y="63" text-anchor="middle" fill="#FFD54F" font-size="18" font-weight="bold">!</text>
        <circle cx="148" cy="95" r="8" fill="rgba(255,255,255,0.7)"/>
        <line x1="148" y1="103" x2="148" y2="125" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
        <line x1="148" y1="110" x2="138" y2="118" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
        <line x1="148" y1="110" x2="158" y2="118" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
      </g>
      <text x="200" y="175" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">CONFINED SPACE</text>
    `),

    2: svg('#00796B','#00A19C', `
      <g opacity="0.9">
        <path d="M160,95 Q200,55 240,95 L245,105 Q200,100 155,105 Z" fill="#FFD54F" stroke="#fff" stroke-width="1.5"/>
        <rect x="155" y="102" width="90" height="8" rx="3" fill="#F9A825"/>
        <path d="M170,120 L165,170 Q200,175 235,170 L230,120 Z" fill="#FF8F00" stroke="#fff" stroke-width="1.5"/>
        <line x1="185" y1="120" x2="182" y2="170" stroke="#fff" stroke-width="2.5"/>
        <line x1="215" y1="120" x2="218" y2="170" stroke="#fff" stroke-width="2.5"/>
        <line x1="168" y1="140" x2="232" y2="140" stroke="#fff" stroke-width="2"/>
        <ellipse cx="188" cy="82" rx="14" ry="9" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <ellipse cx="212" cy="82" rx="14" ry="9" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="202" y1="82" x2="198" y2="82" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
      </g>
      <text x="200" y="200" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">CORRECT USE OF PPE</text>
    `),

    3: svg('#E65100','#FF9800', `
      <g opacity="0.9">
        <rect x="165" y="55" width="70" height="110" rx="10" fill="#333" stroke="#fff" stroke-width="2"/>
        <rect x="175" y="65" width="50" height="35" rx="4" fill="#1B5E20"/>
        <text x="200" y="82" text-anchor="middle" fill="#4CAF50" font-family="monospace" font-size="10">O2  20.9%</text>
        <text x="200" y="94" text-anchor="middle" fill="#4CAF50" font-family="monospace" font-size="10">LEL  0.0%</text>
        <circle cx="180" cy="115" r="5" fill="#546E7A" stroke="#fff" stroke-width="1"/>
        <circle cx="200" cy="115" r="5" fill="#546E7A" stroke="#fff" stroke-width="1"/>
        <circle cx="220" cy="115" r="5" fill="#546E7A" stroke="#fff" stroke-width="1"/>
        <circle cx="185" cy="140" r="6" fill="#E53935"/>
        <circle cx="215" cy="140" r="6" fill="#43A047"/>
        <rect x="192" y="165" width="16" height="12" rx="2" fill="#777" stroke="#fff" stroke-width="1"/>
      </g>
      <text x="200" y="200" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">CSE &mdash; GAS CHECKS</text>
    `),

    4: svg('#F9A825','#FDD835', `
      <g opacity="0.9">
        <polygon points="210,40 180,105 200,105 175,170 235,90 210,90 240,40" fill="#fff" stroke="#E65100" stroke-width="2"/>
        <rect x="265" y="100" width="40" height="35" rx="4" fill="#E53935" stroke="#fff" stroke-width="2"/>
        <path d="M275,100 L275,88 Q285,72 295,88 L295,100" fill="none" stroke="#fff" stroke-width="3"/>
        <circle cx="285" cy="118" r="4" fill="#fff"/>
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
        <rect x="80" y="60" width="240" height="130" fill="#3E2723" stroke="#fff" stroke-width="1.5"/>
        <rect x="140" y="60" width="120" height="130" fill="#4E342E"/>
        <line x1="60" y1="60" x2="340" y2="60" stroke="#8BC34A" stroke-width="4"/>
        <rect x="145" y="65" width="6" height="120" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <rect x="249" y="65" width="6" height="120" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <rect x="151" y="80" width="98" height="5" rx="2" fill="#FF8F00" stroke="#fff" stroke-width="1"/>
        <rect x="151" y="120" width="98" height="5" rx="2" fill="#FF8F00" stroke="#fff" stroke-width="1"/>
        <rect x="151" y="160" width="98" height="5" rx="2" fill="#FF8F00" stroke="#fff" stroke-width="1"/>
        <circle cx="110" cy="90" r="3" fill="rgba(255,255,255,0.15)"/>
        <circle cx="290" cy="110" r="4" fill="rgba(255,255,255,0.15)"/>
        <circle cx="105" cy="150" r="2" fill="rgba(255,255,255,0.15)"/>
        <circle cx="300" cy="160" r="3" fill="rgba(255,255,255,0.15)"/>
      </g>
      <text x="200" y="210" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">EXCAVATION</text>
    `),

    6: svg('#0D47A1','#1976D2', `
      <g opacity="0.9">
        <line x1="80" y1="170" x2="80" y2="40" stroke="#FFD54F" stroke-width="5"/>
        <line x1="80" y1="45" x2="250" y2="45" stroke="#FFD54F" stroke-width="4"/>
        <line x1="220" y1="45" x2="220" y2="90" stroke="#fff" stroke-width="1.5" stroke-dasharray="4,3"/>
        <path d="M215,90 Q220,100 225,90" fill="none" stroke="#fff" stroke-width="2.5"/>
        <circle cx="220" cy="88" r="4" fill="#FFD54F"/>
        <line x1="120" y1="130" x2="320" y2="130" stroke="#E53935" stroke-width="3"/>
        <line x1="120" y1="135" x2="320" y2="135" stroke="#fff" stroke-width="1"/>
        <rect x="118" y="125" width="6" height="40" rx="2" fill="#FF8F00"/>
        <rect x="208" y="125" width="6" height="40" rx="2" fill="#FF8F00"/>
        <rect x="298" y="125" width="6" height="40" rx="2" fill="#FF8F00"/>
        <rect x="280" y="70" width="50" height="40" rx="3" fill="#FFD54F" stroke="#333" stroke-width="1.5"/>
        <text x="305" y="88" text-anchor="middle" fill="#333" font-size="8" font-weight="bold">LIFTING</text>
        <text x="305" y="100" text-anchor="middle" fill="#333" font-size="7">IN PROGRESS</text>
      </g>
      <text x="200" y="195" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="14" font-weight="600">LIFTING &mdash; BARRICADES &amp; SIGNS</text>
    `),

    7: svg('#1565C0','#42A5F5', `
      <g opacity="0.9">
        <line x1="200" y1="20" x2="200" y2="70" stroke="#ccc" stroke-width="2"/>
        <path d="M188,72 Q200,95 212,72" fill="none" stroke="#FFD54F" stroke-width="3.5"/>
        <circle cx="200" cy="70" r="6" fill="#FFD54F" stroke="#fff" stroke-width="1.5"/>
        <rect x="170" y="100" width="60" height="40" rx="4" fill="#546E7A" stroke="#fff" stroke-width="1.5"/>
        <line x1="185" y1="100" x2="195" y2="72" stroke="#999" stroke-width="1.5"/>
        <line x1="215" y1="100" x2="205" y2="72" stroke="#999" stroke-width="1.5"/>
        <path d="M230,120 Q260,115 280,135 Q300,155 310,150" fill="none" stroke="#FFD54F" stroke-width="3" stroke-linecap="round"/>
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
        <rect x="145" y="45" width="110" height="140" rx="6" fill="#ECEFF1" stroke="#fff" stroke-width="2"/>
        <rect x="175" y="38" width="50" height="16" rx="8" fill="#90A4AE" stroke="#fff" stroke-width="1.5"/>
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
        <line x1="270" y1="120" x2="290" y2="80" stroke="#FFD54F" stroke-width="4" stroke-linecap="round"/>
        <polygon points="290,80 293,70 287,70" fill="#FFD54F"/>
      </g>
      <text x="200" y="207" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="16" font-weight="600">TOOL BOX TALK</text>
    `),

    9: svg('#BF360C','#FF7043', `
      <g opacity="0.9">
        <path d="M180,160 Q160,120 175,80 Q185,100 190,70 Q200,110 210,60 Q215,100 225,80 Q240,120 220,160 Z" fill="#FFD54F" opacity="0.8"/>
        <path d="M190,160 Q180,130 190,100 Q200,125 210,95 Q220,130 210,160 Z" fill="#FF8F00" opacity="0.9"/>
        <path d="M195,160 Q190,140 200,120 Q210,140 205,160 Z" fill="#fff" opacity="0.6"/>
        <circle cx="300" cy="100" r="35" fill="#1565C0" stroke="#fff" stroke-width="2.5"/>
        <text x="300" y="95" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold" font-family="sans-serif">IS</text>
        <text x="300" y="112" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8" font-family="sans-serif">CERTIFIED</text>
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
        <path d="M0,155 Q50,145 100,155 Q150,165 200,155 Q250,145 300,155 Q350,165 400,155 L400,225 L0,225 Z" fill="#0277BD" opacity="0.5"/>
        <path d="M0,165 Q50,155 100,165 Q150,175 200,165 Q250,155 300,165 Q350,175 400,165 L400,225 L0,225 Z" fill="#01579B" opacity="0.4"/>
        <rect x="80" y="100" width="240" height="50" rx="4" fill="#546E7A" stroke="#fff" stroke-width="1.5"/>
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
        <rect x="60" y="100" width="280" height="90" fill="#5D4037" stroke="#fff" stroke-width="1.5"/>
        <rect x="50" y="90" width="300" height="14" rx="2" fill="#795548" stroke="#fff" stroke-width="1.5"/>
        <line x1="50" y1="90" x2="50" y2="60" stroke="#FFD54F" stroke-width="3"/>
        <line x1="350" y1="90" x2="350" y2="60" stroke="#FFD54F" stroke-width="3"/>
        <line x1="50" y1="65" x2="350" y2="65" stroke="#FFD54F" stroke-width="2.5"/>
        <line x1="50" y1="78" x2="350" y2="78" stroke="#FFD54F" stroke-width="2"/>
        <line x1="125" y1="90" x2="125" y2="60" stroke="#FFD54F" stroke-width="2"/>
        <line x1="200" y1="90" x2="200" y2="60" stroke="#FFD54F" stroke-width="2"/>
        <line x1="275" y1="90" x2="275" y2="60" stroke="#FFD54F" stroke-width="2"/>
        <circle cx="200" cy="85" r="6" fill="#E53935" stroke="#fff" stroke-width="2"/>
        <circle cx="200" cy="85" r="2" fill="#fff"/>
        <circle cx="240" cy="50" r="8" fill="rgba(255,255,255,0.8)"/>
        <line x1="240" y1="58" x2="240" y2="82" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/>
        <line x1="240" y1="65" x2="228" y2="75" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <line x1="240" y1="65" x2="252" y2="75" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
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

  // ── Scene illustration SVGs for discover posts ──
  const SCENE_THUMBNAILS = {
    aus_site: svg('#2196F3','#64B5F6', `
      <g opacity="0.9">
        <!-- Clean site with Mt Fuji backdrop -->
        <path d="M150,100 L200,30 L250,100" fill="#fff" opacity="0.3" stroke="#fff" stroke-width="1"/>
        <path d="M180,100 L200,55 L220,100" fill="#E3F2FD" opacity="0.4"/>
        <!-- construction fence, clean & organized -->
        <rect x="40" y="110" width="320" height="4" fill="#FF8F00"/>
        <rect x="60" y="90" width="4" height="24" fill="#FF8F00"/>
        <rect x="160" y="90" width="4" height="24" fill="#FF8F00"/>
        <rect x="260" y="90" width="4" height="24" fill="#FF8F00"/>
        <rect x="340" y="90" width="4" height="24" fill="#FF8F00"/>
        <!-- clean ground -->
        <rect x="40" y="114" width="320" height="80" fill="#E8F5E9" opacity="0.3"/>
        <!-- organized cones -->
        <polygon points="90,190 80,160 100,160" fill="#FF5722" stroke="#fff" stroke-width="1"/>
        <polygon points="200,190 190,160 210,160" fill="#FF5722" stroke="#fff" stroke-width="1"/>
        <polygon points="310,190 300,160 320,160" fill="#FF5722" stroke="#fff" stroke-width="1"/>
        <!-- sparkle effects -->
        <text x="130" y="145" fill="#FFD54F" font-size="16">&#10022;</text>
        <text x="250" y="135" fill="#FFD54F" font-size="12">&#10022;</text>
        <text x="320" y="150" fill="#FFD54F" font-size="14">&#10022;</text>
      </g>
      <text x="200" y="215" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="12" font-weight="600">CLEAN SITE &mdash; AUSTRALIA STANDARDS</text>
    `),
    scaffolding: svg('#455A64','#78909C', `
      <g opacity="0.9">
        <!-- scaffolding structure -->
        <rect x="100" y="40" width="8" height="160" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <rect x="200" y="40" width="8" height="160" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <rect x="292" y="40" width="8" height="160" fill="#FFB74D" stroke="#fff" stroke-width="1"/>
        <!-- horizontal bars -->
        <rect x="100" y="60" width="200" height="5" fill="#FFA726"/>
        <rect x="100" y="100" width="200" height="5" fill="#FFA726"/>
        <rect x="100" y="140" width="200" height="5" fill="#FFA726"/>
        <!-- cross braces -->
        <line x1="108" y1="60" x2="200" y2="100" stroke="#FFD54F" stroke-width="2"/>
        <line x1="200" y1="60" x2="108" y2="100" stroke="#FFD54F" stroke-width="2"/>
        <!-- person with harness -->
        <circle cx="250" cy="80" r="8" fill="rgba(255,255,255,0.8)"/>
        <line x1="250" y1="88" x2="250" y2="115" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/>
        <line x1="250" y1="95" x2="240" y2="105" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
        <!-- green check -->
        <circle cx="330" cy="50" r="18" fill="#43A047"/>
        <polyline points="322,50 328,56 340,44" fill="none" stroke="#fff" stroke-width="3"/>
      </g>
      <text x="200" y="215" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="13" font-weight="600">PROPER SCAFFOLDING SETUP</text>
    `),
    toolbox: svg('#00695C','#00897B', `
      <g opacity="0.9">
        <!-- circle of people (top view) -->
        <circle cx="200" cy="105" r="70" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="8,4"/>
        <circle cx="200" cy="45" r="12" fill="rgba(255,255,255,0.8)"/>
        <circle cx="260" cy="65" r="12" fill="rgba(255,255,255,0.7)"/>
        <circle cx="270" cy="120" r="12" fill="rgba(255,255,255,0.6)"/>
        <circle cx="240" cy="165" r="12" fill="rgba(255,255,255,0.7)"/>
        <circle cx="160" cy="165" r="12" fill="rgba(255,255,255,0.6)"/>
        <circle cx="130" cy="120" r="12" fill="rgba(255,255,255,0.7)"/>
        <circle cx="140" cy="65" r="12" fill="rgba(255,255,255,0.8)"/>
        <!-- clipboard in center -->
        <rect x="183" y="85" width="34" height="42" rx="3" fill="#fff" opacity="0.9"/>
        <rect x="193" y="82" width="14" height="8" rx="4" fill="#90A4AE"/>
        <line x1="189" y1="98" x2="211" y2="98" stroke="#43A047" stroke-width="2"/>
        <line x1="189" y1="105" x2="208" y2="105" stroke="#43A047" stroke-width="2"/>
        <line x1="189" y1="112" x2="205" y2="112" stroke="#B0BEC5" stroke-width="2"/>
        <line x1="189" y1="119" x2="207" y2="119" stroke="#B0BEC5" stroke-width="2"/>
      </g>
      <text x="200" y="210" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="13" font-weight="600">MORNING TOOLBOX TALK</text>
    `),
    night_work: svg('#1A237E','#311B92', `
      <g opacity="0.9">
        <!-- moon -->
        <circle cx="320" cy="50" r="22" fill="#FFF9C4"/>
        <circle cx="330" cy="42" r="18" fill="#1A237E"/>
        <!-- stars -->
        <circle cx="80" cy="30" r="2" fill="#fff"/>
        <circle cx="150" cy="50" r="1.5" fill="#fff" opacity="0.7"/>
        <circle cx="250" cy="25" r="2" fill="#fff"/>
        <circle cx="370" cy="70" r="1.5" fill="#fff" opacity="0.6"/>
        <!-- construction light -->
        <rect x="170" y="80" width="8" height="80" fill="#546E7A"/>
        <circle cx="174" cy="80" r="15" fill="#FFEE58" opacity="0.3"/>
        <circle cx="174" cy="80" r="8" fill="#FFEE58" opacity="0.6"/>
        <path d="M155,80 L130,170 L218,170 L193,80" fill="#FFEE58" opacity="0.1"/>
        <!-- reflective vest worker -->
        <circle cx="270" cy="130" r="10" fill="rgba(255,255,255,0.7)"/>
        <path d="M255,145 L250,185 Q270,190 290,185 L285,145 Z" fill="#FF8F00" stroke="#FFEE58" stroke-width="2"/>
        <line x1="262" y1="145" x2="260" y2="185" stroke="#FFEE58" stroke-width="2"/>
        <line x1="278" y1="145" x2="280" y2="185" stroke="#FFEE58" stroke-width="2"/>
      </g>
      <text x="200" y="215" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="13" font-weight="600">NIGHT SHIFT VISIBILITY</text>
    `),
    hydration: svg('#0288D1','#03A9F4', `
      <g opacity="0.9">
        <!-- sun -->
        <circle cx="320" cy="50" r="30" fill="#FFD54F" opacity="0.6"/>
        <circle cx="320" cy="50" r="20" fill="#FFD54F" opacity="0.8"/>
        <!-- heat waves -->
        <path d="M60,180 Q90,170 120,180 Q150,190 180,180 Q210,170 240,180 Q270,190 300,180 Q330,170 360,180" fill="none" stroke="#FF8A65" stroke-width="2" opacity="0.4"/>
        <path d="M60,190 Q90,180 120,190 Q150,200 180,190 Q210,180 240,190 Q270,200 300,190 Q330,180 360,190" fill="none" stroke="#FF8A65" stroke-width="2" opacity="0.3"/>
        <!-- water bottle -->
        <rect x="170" y="70" width="60" height="95" rx="8" fill="#E3F2FD" stroke="#1565C0" stroke-width="2.5"/>
        <rect x="182" y="58" width="36" height="16" rx="4" fill="#1565C0"/>
        <rect x="175" y="100" width="50" height="60" rx="5" fill="#42A5F5" opacity="0.5"/>
        <!-- water drops -->
        <path d="M140,110 Q145,100 150,110 Q145,118 140,110" fill="#42A5F5"/>
        <path d="M250,95 Q255,85 260,95 Q255,103 250,95" fill="#42A5F5"/>
        <!-- thermometer -->
        <rect x="90" y="75" width="12" height="70" rx="6" fill="#fff" stroke="#E53935" stroke-width="1.5"/>
        <rect x="93" y="105" width="6" height="37" rx="3" fill="#E53935"/>
        <circle cx="96" cy="150" r="10" fill="#E53935" stroke="#fff" stroke-width="1.5"/>
      </g>
      <text x="200" y="210" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="14" font-weight="600">STAY HYDRATED</text>
    `)
  };

  // ── Mock Video Data ──
  const MOCK_VIDEOS = [
    { id: 1, title: 'Confined Space', desc: 'Entry procedures, atmospheric testing, and rescue planning for confined space operations. Covers permit requirements and ventilation protocols.', author: 'Ahmad Razak', category: 'confined', duration: '4:12', timestamp: '2026-06-20T09:15:00', defaultLikes: 87, defaultComments: [{ author: 'Sarah K.', text: 'The atmospheric monitoring section is very thorough.', time: '2h ago' }, { author: 'Wei Ming', text: 'We use this for all new hires onboarding now.', time: '5h ago' }] },
    { id: 2, title: 'Correct Use of PPE', desc: 'Proper selection, inspection, and wearing of personal protective equipment including hard hats, safety glasses, gloves, and high-visibility vests.', author: 'Priya Nair', category: 'ppe', duration: '3:28', timestamp: '2026-06-19T14:30:00', defaultLikes: 124, defaultComments: [{ author: 'Dave R.', text: 'Good reminder to check PPE before every shift.', time: '1d ago' }, { author: 'Lina T.', text: 'The glove selection chart is really helpful.', time: '8h ago' }] },
    { id: 3, title: 'CSE - Gas Checks', desc: 'Confined Space Entry gas detection procedures. How to calibrate and use 4-gas monitors, interpret readings, and respond to alarms.', author: 'Ahmad Razak', category: 'gas', duration: '2:45', timestamp: '2026-06-18T11:00:00', defaultLikes: 63, defaultComments: [{ author: 'Tom H.', text: 'The calibration walkthrough is much clearer than the manual.', time: '2d ago' }] },
    { id: 4, title: 'Electrical Safety', desc: 'Lockout/tagout procedures, arc flash awareness, and safe working distances for electrical installations and maintenance tasks.', author: 'Raj Kumar', category: 'electrical', duration: '4:35', timestamp: '2026-06-17T08:45:00', defaultLikes: 91, defaultComments: [{ author: 'Jenny L.', text: 'The LOTO step-by-step demo is excellent.', time: '3d ago' }, { author: 'Mark S.', text: 'Should be mandatory viewing before any electrical work.', time: '2d ago' }] },
    { id: 5, title: 'Excavation', desc: 'Safe excavation practices including trench shoring, soil classification, underground service detection, and edge protection requirements.', author: 'Carlos Rivera', category: 'excavation', duration: '3:50', timestamp: '2026-06-16T16:20:00', defaultLikes: 56, defaultComments: [{ author: 'Alex F.', text: 'The soil classification section cleared up a lot of confusion for our team.', time: '4d ago' }] },
    { id: 6, title: 'Lifting - Barricades & Signs', desc: 'Correct placement of barricades and safety signage during lifting operations. Covers exclusion zones, warning signs, and traffic management.', author: 'Linda Chen', category: 'lifting', duration: '2:38', timestamp: '2026-06-15T10:30:00', defaultLikes: 72, defaultComments: [{ author: 'Pat O.', text: 'The exclusion zone diagram is very clear.', time: '5d ago' }, { author: 'Wei Ming', text: 'Sharing this with all our riggers.', time: '4d ago' }] },
    { id: 7, title: 'Lifting Operation - Tagline', desc: 'Proper use of taglines during crane and lifting operations. Demonstrates correct handling techniques, positioning, and communication signals.', author: 'Linda Chen', category: 'lifting', duration: '2:55', timestamp: '2026-06-14T13:15:00', defaultLikes: 68, defaultComments: [{ author: 'Steve C.', text: 'The hand signal reference at the end is a great quick guide.', time: '1w ago' }] },
    { id: 8, title: 'Tool Box Talk', desc: 'How to conduct effective toolbox talks: preparation, engagement techniques, documentation, and follow-up actions for daily safety briefings.', author: 'Aisha Johnson', category: 'general', duration: '4:10', timestamp: '2026-06-13T07:50:00', defaultLikes: 105, defaultComments: [{ author: 'Brian T.', text: 'The engagement techniques really work. Our participation is up.', time: '1w ago' }, { author: 'Helen W.', text: 'We use the question-first approach from this video every morning.', time: '6d ago' }] },
    { id: 9, title: 'Working in Gas Area - IS Equipment', desc: 'Intrinsically safe equipment requirements for gas hazard areas. Covers zone classifications, equipment certification, and prohibited items.', author: 'Raj Kumar', category: 'gas', duration: '28:15', timestamp: '2026-06-12T15:00:00', defaultLikes: 47, defaultComments: [{ author: 'Nina R.', text: 'Very comprehensive. The zone classification map is bookmarked.', time: '1w ago' }, { author: 'Ahmad Razak', text: 'Essential for anyone working on our gas facilities.', time: '6d ago' }] },
    { id: 10, title: 'Working on Floating Solar Platform', desc: 'Safety procedures specific to floating solar farm operations including water hazards, fall protection, electrical isolation, and emergency rescue on water.', author: 'Priya Nair', category: 'solar', duration: '28:40', timestamp: '2026-06-11T09:30:00', defaultLikes: 93, defaultComments: [{ author: 'Dan K.', text: 'Great coverage of the water rescue procedures.', time: '1w ago' }, { author: 'Rosa M.', text: 'The PFD inspection checklist is very useful.', time: '10d ago' }] },
    { id: 11, title: 'Working on Rooftop', desc: 'Rooftop work safety including fall protection systems, edge protection, fragile roof awareness, and weather condition assessments.', author: 'Carlos Rivera', category: 'wah', duration: '28:30', timestamp: '2026-06-10T12:00:00', defaultLikes: 81, defaultComments: [{ author: 'Lina T.', text: 'The harness anchor point selection guide is really practical.', time: '2w ago' }, { author: 'Chris B.', text: 'Good reminder about weather checks before going up.', time: '12d ago' }] }
  ];

  // Attach thumbnails
  MOCK_VIDEOS.forEach(v => { v.thumbnail = THUMBNAILS[v.id]; });

  // ── Discover Mock Posts — free-form safety observations ──
  const MOCK_DISCOVER_POSTS = [
    {
      id: 'd1',
      author: 'James Mitchell',
      text: 'Visited a construction site in Melbourne today. Absolutely spotless! Every tool in its place, walkways clear, waste sorted into colour-coded bins. Even the temporary hoarding had artwork from local schools on it. This is the standard we should all aspire to. Australia really sets the bar for site housekeeping.',
      tag: 'goodpractice',
      hasVideo: false,
      thumbnail: SCENE_THUMBNAILS.aus_site,
      hasImage: true,
      timestamp: '2026-06-23T08:30:00',
      defaultLikes: 234,
      defaultComments: [
        { author: 'Ahmad Razak', text: 'This is incredible! We need to adopt this culture. Cleanliness IS safety.', time: '1h ago' },
        { author: 'Priya Nair', text: 'The flower pots on fences is such a nice touch. Shows they take pride in their work.', time: '45m ago' },
        { author: 'Carlos Rivera', text: 'I saw the same in Sydney last year. Even the crane operators keep their cabs spotless!', time: '30m ago' }
      ]
    },
    {
      id: 'd2',
      author: 'Dave R.',
      text: 'Near miss this morning. A pipe wrench slipped from the second level and landed exactly where someone was standing 5 seconds earlier. No tool lanyard was used. This is a reminder that gravity never takes a day off. Always tether your tools when working at height. It takes 2 seconds to clip on, but a lifetime to regret not doing it.',
      tag: 'nearmiss',
      hasVideo: false,
      hasImage: false,
      timestamp: '2026-06-22T11:20:00',
      defaultLikes: 187,
      defaultComments: [
        { author: 'Linda Chen', text: 'This gave me chills. Glad everyone is safe. Sharing with my team right now.', time: '5h ago' },
        { author: 'Mark S.', text: 'We had a similar incident at our site. Tool lanyards should be non-negotiable.', time: '4h ago' },
        { author: 'Raj Kumar', text: 'Already added this to tomorrow\'s toolbox talk agenda. Thank you for sharing.', time: '3h ago' }
      ]
    },
    {
      id: 'd3',
      author: 'Priya Nair',
      text: 'Proud moment! Our scaffolding team just passed the client audit with ZERO non-conformances. Every tag current, every board secured, every guardrail at the right height. Hard work pays off. Safety excellence is not an accident - it\'s a choice we make every single day.',
      tag: 'goodpractice',
      hasVideo: false,
      thumbnail: SCENE_THUMBNAILS.scaffolding,
      hasImage: true,
      timestamp: '2026-06-21T15:00:00',
      defaultLikes: 156,
      defaultComments: [
        { author: 'Tom H.', text: 'Huge congratulations to the team! This sets such a great example.', time: '1d ago' },
        { author: 'Steve C.', text: 'Zero NCRs is no joke on a scaffold audit. Well done!', time: '20h ago' },
        { author: 'Aisha Johnson', text: 'This deserves recognition at the next all-hands meeting!', time: '18h ago' }
      ]
    },
    {
      id: 'd4',
      author: 'Aisha Johnson',
      text: 'Today\'s morning toolbox talk: we asked everyone to share one unsafe act they personally stopped this week. The stories were eye-opening. One guy stopped a colleague from using a damaged extension cord. Another prevented someone from entering a confined space without the permit. Small actions, big impact. Be that person who speaks up.',
      tag: 'observation',
      hasVideo: false,
      thumbnail: SCENE_THUMBNAILS.toolbox,
      hasImage: true,
      timestamp: '2026-06-21T08:15:00',
      defaultLikes: 203,
      defaultComments: [
        { author: 'Helen W.', text: 'Love this approach! Making it personal really drives the message home.', time: '1d ago' },
        { author: 'Brian T.', text: 'We tried the same format and it was the best TBT we\'ve had in months.', time: '22h ago' },
        { author: 'Wei Ming', text: 'The courage to stop someone takes practice. Great way to reinforce it.', time: '18h ago' }
      ]
    },
    {
      id: 'd5',
      author: 'Carlos Rivera',
      text: 'Quick tip for night shift workers: make sure your reflective strips are CLEAN. Covered in dust or mud they lose up to 80% of their visibility. I carry a damp cloth in my bag and wipe down my vest before every night shift. Simple habit that could save your life in low-light conditions.',
      tag: 'tip',
      hasVideo: false,
      thumbnail: SCENE_THUMBNAILS.night_work,
      hasImage: true,
      timestamp: '2026-06-20T22:30:00',
      defaultLikes: 142,
      defaultComments: [
        { author: 'Alex F.', text: 'Never thought about this but it makes total sense! Adding a cloth to my kit.', time: '2d ago' },
        { author: 'Nina R.', text: 'Great tip Carlos. I\'ve seen some vests that are practically invisible because of the grime.', time: '2d ago' },
        { author: 'Lina T.', text: 'Our site should provide cleaning wipes at the sign-in station for night shift.', time: '1d ago' }
      ]
    },
    {
      id: 'd6',
      author: 'Sarah K.',
      text: 'Walked past a site in Singapore where they have a digital display showing "Days Since Last Incident: 847". Almost 2.5 years without an incident! Behind that number is discipline, training, and a culture where everyone looks out for everyone. That number isn\'t luck - it\'s leadership.',
      tag: 'goodpractice',
      hasVideo: false,
      hasImage: false,
      timestamp: '2026-06-20T12:00:00',
      defaultLikes: 298,
      defaultComments: [
        { author: 'Ahmad Razak', text: '847 days. That\'s remarkable. Every single person on that site deserves credit.', time: '2d ago' },
        { author: 'Raj Kumar', text: 'We\'re at 156 days currently. Stories like this motivate us to keep going.', time: '2d ago' },
        { author: 'James Mitchell', text: 'Culture eats strategy for breakfast. This proves it.', time: '1d ago' },
        { author: 'Pat O.', text: 'I want that digital board for our site entrance. Anyone know the supplier?', time: '1d ago' }
      ]
    },
    {
      id: 'd7',
      author: 'Wei Ming',
      text: 'This heat wave is no joke. Saw a worker looking dizzy near the solar panel array today. Immediately got him to shade, gave him water, and called the medic. He was showing early signs of heat exhaustion. Know the signs: heavy sweating, weak pulse, nausea, dizziness. Don\'t wait until it\'s too late. Your buddy\'s life might depend on what you know.',
      tag: 'observation',
      hasVideo: false,
      thumbnail: SCENE_THUMBNAILS.hydration,
      hasImage: true,
      timestamp: '2026-06-19T16:45:00',
      defaultLikes: 176,
      defaultComments: [
        { author: 'Dan K.', text: 'Well done Wei Ming. Quick thinking saves lives. Is the worker okay now?', time: '3d ago' },
        { author: 'Wei Ming', text: 'He\'s fully recovered! Was back on site the next day after medical clearance.', time: '3d ago' },
        { author: 'Rosa M.', text: 'We need mandatory rest breaks every hour in this heat. No exceptions.', time: '2d ago' }
      ]
    },
    {
      id: 'd8',
      author: 'Raj Kumar',
      text: 'Friendly reminder: if you see something, say something. It doesn\'t matter if it\'s the CEO or a new apprentice doing something unsafe. Safety has no hierarchy. The bravest thing you can do on a work site is to stop someone and say "hey, that doesn\'t look safe." You might feel awkward for 10 seconds, but you could prevent a lifetime of regret.',
      tag: 'tip',
      hasVideo: false,
      hasImage: false,
      timestamp: '2026-06-18T09:00:00',
      defaultLikes: 312,
      defaultComments: [
        { author: 'Jenny L.', text: 'This should be on a poster at every site entrance. Powerful message.', time: '4d ago' },
        { author: 'Dave R.', text: 'I once stopped a manager from walking under a suspended load. He thanked me later.', time: '4d ago' },
        { author: 'Aisha Johnson', text: 'Safety has no hierarchy - love that. Adding it to our safety charter.', time: '3d ago' },
        { author: 'Tom H.', text: '10 seconds of awkwardness vs a lifetime of regret. That\'s a quote right there.', time: '3d ago' }
      ]
    }
  ];

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
        const res = await fetch(BASE_URL + '/videos', { method: 'POST', body: data });
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

    async getDiscoverPosts() {
      if (BASE_URL) return apiGet('/discover');
      return MOCK_DISCOVER_POSTS.map(p => ({ ...p }));
    },

    async createDiscoverPost(data) {
      if (BASE_URL) return apiPost('/discover', data);
      return {
        id: 'd' + Date.now(),
        author: 'You',
        text: data.text,
        tag: null,
        hasVideo: data.hasVideo || false,
        hasImage: false,
        videoTitle: data.videoTitle || '',
        duration: data.hasVideo ? '0:00' : '',
        timestamp: new Date().toISOString(),
        thumbnail: data.hasVideo ? defaultThumbnail(data.videoTitle || 'My Video') : null,
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

    TAGS: {
      nearmiss:     { label: 'Near Miss',      cssClass: 'tag-nearmiss',     icon: '&#9888;' },
      goodpractice: { label: 'Good Practice',  cssClass: 'tag-goodpractice', icon: '&#10004;' },
      observation:  { label: 'Observation',    cssClass: 'tag-observation',  icon: '&#128065;' },
      tip:          { label: 'Tips',           cssClass: 'tag-tip',          icon: '&#128161;' }
    },

    defaultThumbnail
  };
})();
