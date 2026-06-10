// ============================================================================
// Vistara4D — Văn Miếu in Motion
// Trung tâm nội dung: i18n (VN/EN) + dữ liệu 4 lớp thời gian (Time Capsule)
// ============================================================================

export type Lang = "vi" | "en";

export type LayerId = "dawn" | "visit" | "festival" | "imperial";

/** Một lớp thời gian = một "Time Capsule" trong Time Slider. */
export interface TimeLayer {
  id: LayerId;
  /** Mốc giờ hiển thị trên slider (24h cảm quan, không phải thời gian thực) */
  clock: string;
  /** Bảng màu scene 3D theo lớp này */
  palette: {
    skyTop: string;
    skyBottom: string;
    fog: string;
    light: string;
    ambient: number;
    sunIntensity: number;
  };
  /** Lớp này có hỗ trợ chế độ lễ hội (đám đông + âm thanh nghi lễ)? */
  festivalCapable: boolean;
  /** Đây là lớp phục dựng lịch sử (cần gắn nhãn nguồn + độ chắc chắn)? */
  reconstruction: boolean;
  vi: {
    name: string;
    tagline: string;
    /** Thuyết minh 60–90s rút gọn (Story Layer) */
    story: string;
    captions: string[];
  };
  en: {
    name: string;
    tagline: string;
    story: string;
    captions: string[];
  };
  /** Chỉ dùng cho lớp phục dựng — phục vụ Then & Now có kiểm chứng */
  evidence?: {
    /** 0–100: điểm tin cậy tổng hợp */
    confidence: number;
    sources: { vi: string; en: string }[];
    /** Chú giải mức độ chắc chắn theo từng phần */
    breakdown: { label: { vi: string; en: string }; level: "data" | "infer" | "illustrate" }[];
    author: string;
    version: string;
    updated: string;
  };
}

export const LAYERS: TimeLayer[] = [
  {
    id: "dawn",
    clock: "05:30",
    palette: {
      skyTop: "#1f2d4d",
      skyBottom: "#c9a36a",
      fog: "#9fb0c0",
      light: "#ffd9a0",
      ambient: 0.35,
      sunIntensity: 0.7,
    },
    festivalCapable: false,
    reconstruction: false,
    vi: {
      name: "Sáng sớm",
      tagline: "Tĩnh lặng & trang nghiêm",
      story:
        "Khi sương còn đọng trên mái ngói, Văn Miếu hiện ra trong trẻo và vắng lặng. Đây là khoảnh khắc cảm nhận di tích không chỉ là kiến trúc, mà là một bầu không khí văn hóa đang thức giấc.",
      captions: ["Sương sớm trên Khuê Văn Các", "Nhịp sống chậm, ít người", "Ánh nắng đầu tiên chạm mái đao"],
    },
    en: {
      name: "Early Dawn",
      tagline: "Still & solemn",
      story:
        "As mist still clings to the tiled roofs, the Temple of Literature emerges crisp and quiet. A moment to feel the site not merely as architecture, but as a cultural atmosphere awakening.",
      captions: ["Dawn mist over Khue Van Cac", "Slow rhythm, few visitors", "First light on the eave tips"],
    },
  },
  {
    id: "visit",
    clock: "10:00",
    palette: {
      skyTop: "#5fa8e8",
      skyBottom: "#cfe9ff",
      fog: "#dcebf5",
      light: "#fff6e0",
      ambient: 0.6,
      sunIntensity: 1.2,
    },
    festivalCapable: true,
    reconstruction: false,
    vi: {
      name: "Giờ tham quan",
      tagline: "Hiện trạng sống động",
      story:
        "Ban ngày, Văn Miếu đông khách tham quan, có dòng người di chuyển và âm thanh môi trường. Đây là lớp 'hiện trạng' để bạn đối chiếu với các thời điểm khác trên dòng thời gian.",
      captions: ["Khách tham quan và hướng dẫn viên", "Điểm chạm thông tin ngắn", "Hiện trạng thực tế của di tích"],
    },
    en: {
      name: "Visiting Hours",
      tagline: "The living present",
      story:
        "By day the temple fills with visitors, moving crowds and ambient sound. This 'present-state' layer is your baseline to compare against other moments along the timeline.",
      captions: ["Visitors and guides", "Short info touchpoints", "The site as it stands today"],
    },
  },
  {
    id: "festival",
    clock: "18:30",
    palette: {
      skyTop: "#3a1d4d",
      skyBottom: "#e8702a",
      fog: "#b06a55",
      light: "#ffb066",
      ambient: 0.5,
      sunIntensity: 0.9,
    },
    festivalCapable: true,
    reconstruction: false,
    vi: {
      name: "Mùa thi · cầu may",
      tagline: "Cảm xúc & lan tỏa",
      story:
        "Mùa thi, sĩ tử và phụ huynh tìm về Văn Miếu cầu may. Không gian rực rỡ với hoạt cảnh văn hóa, dòng người đông và nhịp trải nghiệm giàu cảm xúc — khoảnh khắc đáng chia sẻ nhất.",
      captions: ["Đèn lồng và sắc đỏ", "Sĩ tử cầu may trước kỳ thi", "Khói hương và dòng người"],
    },
    en: {
      name: "Exam Season",
      tagline: "Emotion & sharing",
      story:
        "During exam season, students and parents return to pray for luck. The space glows with cultural vignettes, dense crowds and an emotional rhythm — the most shareable moment of all.",
      captions: ["Lanterns and crimson", "Students praying before exams", "Incense smoke and crowds"],
    },
  },
  {
    id: "imperial",
    clock: "Khoa cử xưa",
    palette: {
      skyTop: "#2a241a",
      skyBottom: "#9c7b3f",
      fog: "#7d6b4a",
      light: "#e8c074",
      ambient: 0.4,
      sunIntensity: 0.8,
    },
    festivalCapable: true,
    reconstruction: true,
    vi: {
      name: "Khoa cử xưa",
      tagline: "Time Travel · phục dựng",
      story:
        "Bước vào một thời đại khác: lớp phục dựng tinh thần khoa cử xưa, khi Văn Miếu là trung tâm học vấn của quốc gia. Đây là phục dựng dựa trên tư liệu lịch sử — không phải bản ghi hình thực tế.",
      captions: ["Lễ xướng danh tân khoa", "Bia Tiến sĩ được khắc tên", "Phục dựng dựa trên tư liệu"],
    },
    en: {
      name: "Imperial Examination",
      tagline: "Time Travel · reconstruction",
      story:
        "Step into another era: a reconstruction of the imperial examination spirit, when the temple was the nation's center of learning. This is a reconstruction based on historical sources — not actual footage.",
      captions: ["Roll-call of new laureates", "Names carved on doctoral steles", "Reconstruction based on sources"],
    },
    evidence: {
      confidence: 72,
      sources: [
        { vi: "Bản vẽ kiến trúc EFEO (đầu thế kỷ 20)", en: "EFEO architectural drawings (early 20th c.)" },
        { vi: "82 bia Tiến sĩ (1442–1779) · di sản tư liệu UNESCO", en: "82 doctoral steles (1442–1779) · UNESCO heritage" },
        { vi: "Ghi chép Đại Việt sử ký toàn thư", en: "Records from Dai Viet su ky toan thu" },
      ],
      breakdown: [
        { label: { vi: "Bố cục sân & bia", en: "Courtyard & stele layout" }, level: "data" },
        { label: { vi: "Trang phục & nghi lễ", en: "Costumes & ceremony" }, level: "infer" },
        { label: { vi: "Ánh sáng & đám đông", en: "Lighting & crowd" }, level: "illustrate" },
      ],
      author: "Vistara4D Heritage Team",
      version: "v0.3",
      updated: "2026-06",
    },
  },
];

// ----------------------------------------------------------------------------
// Chuỗi giao diện (UI strings) song ngữ
// ----------------------------------------------------------------------------
export interface UIStrings {
  brandTagline: string;
  heroTitle: string;
  heroSub: string;
  enterDemo: string;
  demoOptions: string;
  demosTitle: string;
  demosSub: string;
  demosNoteTitle: string;
  demosNote: string;
  openSource: string;
  demosConstruction: string;
  scanQR: string;
  subscribe: string;
  share: string;
  aboutTitle: string;
  aboutBody: string;
  timeline: string;
  thenNow: string;
  thenNowHint: string;
  then: string;
  now: string;
  festival: string;
  festivalOn: string;
  festivalOff: string;
  story: string;
  sources: string;
  confidence: string;
  author: string;
  legendData: string;
  legendInfer: string;
  legendIllustrate: string;
  reconBadge: string;
  dragHint: string;
  shareTitle: string;
  shareDesc: string;
  exportClip: string;
  copyLink: string;
  copied: string;
  qrTitle: string;
  qrDesc: string;
  close: string;
  backHome: string;
  // onboarding / intro
  introTitle: string;
  introSub: string;
  introStart: string;
  tipDrag: string;
  tipSlider: string;
  tipModes: string;
  gotIt: string;
}

export const UI: Record<Lang, UIStrings> = {
  vi: {
    brandTagline: "Sống cùng di sản Việt",
    heroTitle: "Vietnam Heritage in Motion",
    heroSub: "Văn Miếu không chỉ để nhìn — mà để trải nghiệm qua không gian, chuyển động và thời gian.",
    enterDemo: "Vào trải nghiệm 4D",
    demoOptions: "Demo Options",
    demosTitle: "Scene-based 4D demos",
    demosSub:
      "10 hình động thiên về cảnh quan, không gian và camera di chuyển — minh họa hướng công nghệ 4D Gaussian khả thi cho khu du lịch, bảo tàng và di tích.",
    demosNoteTitle: "Cách dùng khi pitch",
    demosNote:
      "Đây là demo nghiên cứu công khai từ Google DeepMind và các nhóm 4DGS, dùng để chứng minh hướng công nghệ khả thi. Vistara4D sẽ pilot dữ liệu thật tại di tích sau — không trình bày đây là sản phẩm đã tự scan của nhóm.",
    openSource: "Mở nguồn",
    demosConstruction:
      "🚧 Đang phát triển — Vistara4D đang hoàn thiện để đạt chất lượng 4D như các demo nghiên cứu dưới đây.",
    scanQR: "Quét QR tại di tích",
    subscribe: "Nhận thông tin",
    share: "Chia sẻ",
    aboutTitle: "Văn Miếu in Motion",
    aboutBody:
      "MVP đầu tiên của Vistara4D: một web 4D mô phỏng trải nghiệm di sản theo dòng thời gian. Kéo thanh thời gian để thấy cùng một góc Văn Miếu biến đổi qua sáng sớm, giờ tham quan, mùa lễ hội và lớp phục dựng khoa cử xưa.",
    timeline: "Dòng thời gian",
    thenNow: "Then & Now",
    thenNowHint: "Kéo để so sánh hiện trạng ↔ phục dựng",
    then: "Hiện trạng",
    now: "Phục dựng",
    festival: "Chế độ lễ hội",
    festivalOn: "Đang bật lễ hội",
    festivalOff: "Lễ hội: tắt",
    story: "Câu chuyện",
    sources: "Nguồn tư liệu",
    confidence: "Độ tin cậy phục dựng",
    author: "Tác giả & phiên bản",
    legendData: "Dựa trên dữ liệu",
    legendInfer: "Suy luận hợp lý",
    legendIllustrate: "Minh họa",
    reconBadge: "Phục dựng dựa trên tư liệu",
    dragHint: "Kéo để xoay · Cuộn để phóng to",
    shareTitle: "Chia sẻ khoảnh khắc",
    shareDesc: "Xuất clip 10–15s mang thương hiệu Vistara4D để đăng TikTok / Reels / Shorts.",
    exportClip: "Xuất clip 15s",
    copyLink: "Sao chép liên kết",
    copied: "Đã sao chép!",
    qrTitle: "QR Experience",
    qrDesc: "Quét mã này tại Văn Miếu để mở đúng Time Capsule khu vực bạn đang đứng.",
    close: "Đóng",
    backHome: "Trang chủ",
    introTitle: "Văn Miếu in Motion",
    introSub: "Kéo dòng thời gian để thấy di tích vận hành như một không gian sống.",
    introStart: "Bắt đầu trải nghiệm",
    tipDrag: "Kéo để xoay, cuộn để phóng to không gian 3D.",
    tipSlider: "Kéo thanh thời gian để chuyển 4 lớp: sáng sớm → khoa cử xưa.",
    tipModes: "Bật Then & Now để so sánh, Lễ hội để thêm không khí.",
    gotIt: "Đã hiểu",
  },
  en: {
    brandTagline: "Living with Vietnam's heritage",
    heroTitle: "Vietnam Heritage in Motion",
    heroSub: "The Temple of Literature is not just to look at — but to experience through space, motion and time.",
    enterDemo: "Enter the 4D experience",
    demoOptions: "Demo Options",
    demosTitle: "Scene-based 4D demos",
    demosSub:
      "10 short clips focused on landscape, space and moving cameras — showing the feasible 4D Gaussian direction for tourism sites, museums and monuments.",
    demosNoteTitle: "How to use when pitching",
    demosNote:
      "These are public research demos from Google DeepMind and 4DGS teams, used to prove the technology direction is feasible. Vistara4D will pilot real data on-site later — do not present these as the team's own scans.",
    openSource: "Open source",
    demosConstruction:
      "🚧 We're in construction — Vistara4D is being built to reach the 4D quality shown in the research demos below.",
    scanQR: "Scan QR on-site",
    subscribe: "Get updates",
    share: "Share",
    aboutTitle: "Văn Miếu in Motion",
    aboutBody:
      "Vistara4D's first MVP: a 4D web demo of heritage experienced along a timeline. Drag the time slider to watch the same corner of the Temple of Literature shift through dawn, visiting hours, the festival season and the imperial-examination reconstruction.",
    timeline: "Timeline",
    thenNow: "Then & Now",
    thenNowHint: "Drag to compare present ↔ reconstruction",
    then: "Present",
    now: "Reconstruction",
    festival: "Festival mode",
    festivalOn: "Festival on",
    festivalOff: "Festival: off",
    story: "Story",
    sources: "Sources",
    confidence: "Reconstruction confidence",
    author: "Author & version",
    legendData: "Based on data",
    legendInfer: "Reasoned inference",
    legendIllustrate: "Illustrative",
    reconBadge: "Reconstruction based on sources",
    dragHint: "Drag to rotate · Scroll to zoom",
    shareTitle: "Share your moment",
    shareDesc: "Export a 10–15s Vistara4D-branded clip for TikTok / Reels / Shorts.",
    exportClip: "Export 15s clip",
    copyLink: "Copy link",
    copied: "Copied!",
    qrTitle: "QR Experience",
    qrDesc: "Scan this on-site at the Temple of Literature to open the Time Capsule for where you stand.",
    close: "Close",
    backHome: "Home",
    introTitle: "Văn Miếu in Motion",
    introSub: "Drag the timeline to see the monument behave as a living space.",
    introStart: "Start the experience",
    tipDrag: "Drag to rotate, scroll to zoom the 3D space.",
    tipSlider: "Drag the time slider through 4 layers: dawn → imperial era.",
    tipModes: "Toggle Then & Now to compare, Festival for atmosphere.",
    gotIt: "Got it",
  },
};
