// 10 demo 4D Gaussian / scene-based tham khảo (nguồn nghiên cứu công khai).
// Dùng làm phụ lục kỹ thuật khi pitch — KHÔNG phải dữ liệu tự scan của nhóm.

export interface DemoItem {
  title: string;
  source: string;
  mode: "gif" | "video";
  media: string;
  link: string;
  point: string;
  desc: { vi: string; en: string };
}

export const DEMOS: DemoItem[] = [
  {
    title: "Shape of Motion — horse jump tracking",
    source: "Shape of Motion",
    mode: "video",
    media: "https://shape-of-motion.github.io/static/videos/horsejump-high.mp4",
    link: "https://shape-of-motion.github.io/",
    point: "Motion 4D",
    desc: {
      vi: "Tái dựng chuyển động 4D của đối tượng động (ngựa nhảy) từ video đơn — minh họa lớp chuyển động sống động cho không gian di sản.",
      en: "4D motion reconstruction of a dynamic subject (jumping horse) from a single video — illustrating a living motion layer for heritage spaces.",
    },
  },
  {
    title: "Google D4RT — scene capability",
    source: "Google D4RT",
    mode: "gif",
    media: "https://storage.googleapis.com/d4rt_assets/D4RT_capabilities_left.gif",
    link: "https://d4rt-paper.github.io/",
    point: "Google proof",
    desc: {
      vi: "GIF gốc từ D4RT, mở đầu rằng AI có thể tái dựng không gian theo thời gian.",
      en: "Original D4RT GIF, opening proof that AI can reconstruct space over time.",
    },
  },
  {
    title: "Google D4RT — time tracking",
    source: "Google D4RT",
    mode: "gif",
    media: "https://storage.googleapis.com/d4rt_assets/D4RT_capabilities_right.gif",
    link: "https://d4rt-paper.github.io/",
    point: "Tracking",
    desc: {
      vi: "Minh họa tracking qua thời gian, hợp để giải thích lớp chuyển động trong không gian di sản.",
      en: "Time-tracking illustration, good for explaining the motion layer in heritage spaces.",
    },
  },
  {
    title: "MegaSAM — market public space",
    source: "MegaSAM",
    mode: "video",
    media: "https://mega-sam.github.io/static/videos/gallery/codec/market_5_sgd_cvd_hr.mp4",
    link: "https://mega-sam.github.io/gallery",
    point: "Public space",
    desc: {
      vi: "Không gian công cộng ngoài trời, gần với tuyến du lịch, lễ hội và điểm tham quan.",
      en: "Outdoor public space, close to tourism routes, festivals and visiting spots.",
    },
  },
  {
    title: "MegaSAM — mountain landscape",
    source: "MegaSAM",
    mode: "video",
    media: "https://mega-sam.github.io/static/videos/gallery/codec/mountain_1_sgd_cvd_hr.mp4",
    link: "https://mega-sam.github.io/gallery",
    point: "Landscape",
    desc: {
      vi: "Cảnh quan ngoài trời, hợp hướng du lịch trải nghiệm và truyền thông điểm đến.",
      en: "Outdoor landscape, fits experiential tourism and destination marketing.",
    },
  },
  {
    title: "4DGS — free-view scene",
    source: "4D Gaussian Splatting",
    mode: "video",
    media: "https://fudan-zvg.github.io/4d-gaussian-splatting/static/videos/free_view.mp4",
    link: "https://fudan-zvg.github.io/4d-gaussian-splatting/",
    point: "Free view",
    desc: {
      vi: "Cho thấy có thể đổi góc nhìn quanh cảnh động, sát với trải nghiệm du lịch số.",
      en: "Shows free viewpoint around a dynamic scene, close to digital tourism.",
    },
  },
  {
    title: "4DGS — scene depth layers",
    source: "4D Gaussian Splatting",
    mode: "video",
    media:
      "https://fudan-zvg.github.io/4d-gaussian-splatting/static/videos/concat_with_depth_horizontal.mp4",
    link: "https://fudan-zvg.github.io/4d-gaussian-splatting/",
    point: "Depth",
    desc: {
      vi: "Nói về lớp chiều sâu và tách lớp không gian cho bảo tàng/di tích.",
      en: "About depth layers and spatial separation for museums/monuments.",
    },
  },
  {
    title: "4DGS — urban site capture",
    source: "4D Gaussian Splatting",
    mode: "video",
    media: "https://fudan-zvg.github.io/4d-gaussian-splatting/static/videos/0100160_FRONT.mp4",
    link: "https://fudan-zvg.github.io/4d-gaussian-splatting/",
    point: "Urban scene",
    desc: {
      vi: "Cảnh quy mô địa điểm, gần bài toán số hóa một tuyến tham quan hoặc không gian di tích.",
      en: "Site-scale scene, close to digitizing a visiting route or monument space.",
    },
  },
  {
    title: "4DGS — urban depth + segmentation",
    source: "4D Gaussian Splatting",
    mode: "video",
    media:
      "https://fudan-zvg.github.io/4d-gaussian-splatting/static/videos/0100160_FRONT_with_depth_seg_new.mp4",
    link: "https://fudan-zvg.github.io/4d-gaussian-splatting/",
    point: "Site layers",
    desc: {
      vi: "Có depth và phân lớp, hợp để nói về hotspot, khu thuyết minh và lớp phục dựng.",
      en: "Has depth and segmentation, good for hotspots, info zones and reconstruction layers.",
    },
  },
  {
    title: "MegaSAM — drone site capture",
    source: "MegaSAM",
    mode: "video",
    media: "https://mega-sam.github.io/static/videos/gallery/codec/drone_sgd_cvd_hr.mp4",
    link: "https://mega-sam.github.io/gallery",
    point: "Site capture",
    desc: {
      vi: "Cảnh quay ngoài trời góc nhìn di chuyển, dễ liên hệ với khảo sát khu du lịch/di tích.",
      en: "Moving-camera outdoor capture, relates to surveying tourism/heritage sites.",
    },
  },
  {
    title: "MegaSAM — rice field landscape",
    source: "MegaSAM",
    mode: "video",
    media: "https://mega-sam.github.io/static/videos/gallery/codec/rice-field_sgd_cvd_hr.mp4",
    link: "https://mega-sam.github.io/gallery",
    point: "Landscape",
    desc: {
      vi: "Cảnh ngoài trời, phù hợp hướng du lịch văn hóa và trải nghiệm địa phương.",
      en: "Outdoor scene, fits cultural tourism and local experiences.",
    },
  },
];
