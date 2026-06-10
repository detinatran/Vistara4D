// Demo 4D / scene-based tham khảo (nguồn nghiên cứu công khai).
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
    title: "Shape of Motion — dancer by the fountain",
    source: "Shape of Motion",
    mode: "video",
    media: "https://shape-of-motion.github.io/static/videos/schoolgirls-tracks.mp4",
    link: "https://shape-of-motion.github.io/",
    point: "3D tracks + novel view",
    desc: {
      vi: "Từ một video đơn → tái dựng 3D Tracks và Novel View của cô gái múa cạnh đài phun nước. Đúng tinh thần Vistara4D: biến cảnh quay thành không gian 4D đổi được góc nhìn.",
      en: "From a single video → 3D Tracks and a Novel View of a dancer by the fountain. Exactly the Vistara4D idea: turn footage into a 4D space with free viewpoint.",
    },
  },
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
];
