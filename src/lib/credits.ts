// Credit tác giả model 3D (Sketchfab). Cập nhật khi tải model thật.
// Nếu model là CC-BY, BẮT BUỘC hiển thị credit này trong app.

export interface ModelCredit {
  file: string; // tên file trong public/models/
  title: string;
  author: string; // điền tên tác giả Sketchfab
  url: string;
  license: string; // ví dụ: "CC-BY 4.0"
}

export const MODEL_CREDITS: ModelCredit[] = [
  {
    file: "khue-van-cac.glb",
    title: "Khuê Văn các - Khue Van pavilion",
    author: "Heli Ton",
    url: "https://sketchfab.com/3d-models/khue-van-cac-khue-van-pavilion-bd978368dc0444058c6c61336ed8f2d0",
    license: "— (kiểm tra trên Sketchfab: CC-BY / CC0 / …)",
  },
  {
    file: "bia-tien-si.glb",
    title: "Bia Tiến sĩ 1442 · Văn Miếu - Quốc Tử Giám",
    author: "— (điền tác giả Sketchfab)",
    url: "https://sketchfab.com/3d-models/bia-tien-si-nam-1442-van-mieu-quoc-tu-giam-7aac2b6d65764a519fdbc71ceb03227f",
    license: "— (kiểm tra trên Sketchfab)",
  },
];
