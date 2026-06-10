# Vistara4D — Văn Miếu in Motion

Web 4D demo trải nghiệm di sản theo dòng thời gian. **Sống cùng di sản Việt.**

Cùng một góc Văn Miếu được xem qua 4 lớp thời gian: sáng sớm, giờ tham quan,
mùa thi (lễ hội) và lớp phục dựng khoa cử xưa — kéo Time Slider để chuyển cảnh.

## Tính năng

- **4D Viewer** — Khuê Văn Các + bia Tiến sĩ dựng bằng React Three Fiber, xoay/zoom.
- **Time Slider** — chuyển mượt 4 lớp thời gian, nội suy ánh sáng & không khí.
- **Then & Now** — so sánh hiện trạng ↔ phục dựng, kèm nguồn tư liệu + độ tin cậy.
- **Story Layer** — thuyết minh từng lớp, caption văn hóa.
- **Festival Mode** — đám đông, đèn lồng, khói hương mùa lễ hội.
- **Song ngữ** VN / EN, **QR Experience** tại điểm đến, **Share/Export** clip.
- Hỗ trợ **model GLB thật** (Sketchfab) với fallback low-poly — xem `public/models/README.md`.

## Chạy thử

```bash
npm install
npm run dev
# mở http://localhost:3000
```

## Tech stack

Next.js 14 (App Router) · React Three Fiber / Three.js · Tailwind CSS · TypeScript.
Mobile-first, web-based, không cần cài app.
