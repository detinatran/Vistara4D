# Model 3D — Văn Miếu

App sẽ **tự động** dùng model thật nếu các file dưới đây tồn tại, ngược lại
dùng model cách điệu (low-poly) làm fallback. Bỏ file vào đúng tên là chạy.

## File cần tải

| Tên file đặt vào đây | Dùng cho | Nguồn Sketchfab |
|---|---|---|
| `khue-van-cac.glb` | Khuê Văn Các (cổng trung tâm) | https://sketchfab.com/3d-models/khue-van-cac-khue-van-pavilion-bd978368dc0444058c6c61336ed8f2d0 *(hoặc bản 2: …/khue-van-cac-e448a20cb453475ab52b7a6486eae671)* |
| `bia-tien-si.glb` | Bia Tiến sĩ 1442 | https://sketchfab.com/3d-models/bia-tien-si-nam-1442-van-mieu-quoc-tu-giam-7aac2b6d65764a519fdbc71ceb03227f |

## Cách tải từ Sketchfab

1. Mở link model → đăng nhập tài khoản Sketchfab (miễn phí).
2. Bấm **Download 3D Model**.
3. Chọn format **glTF (.glb)** — bản binary, nhẹ, tối ưu web.
   (Nếu chỉ có `.gltf` + thư mục textures, dùng công cụ như
   https://gltf.report hoặc `gltf-pipeline` để gộp thành `.glb`.)
4. Đổi tên file đúng như bảng trên, đặt vào thư mục `public/models/` này.
5. Reload trang `/experience` — model thật sẽ thay model cách điệu.

## ⚠️ License — BẮT BUỘC kiểm tra

Mỗi model Sketchfab có license riêng (thường **CC-BY** = phải ghi công tác giả).
Trước khi dùng công khai:
- Mở tab license trên trang Sketchfab, đọc điều khoản.
- Nếu là CC-BY: ghi tên tác giả + link model trong phần credit của app.
- Một số model không cho tải / chỉ xem — khi đó không dùng được, giữ fallback.

> File credit gợi ý: cập nhật tên tác giả vào `src/lib/credits.ts`.

## Tối ưu (khuyến nghị)

Model Sketchfab có thể nặng. Nén lại cho web mượt:

```bash
npx gltf-pipeline -i khue-van-cac.glb -o khue-van-cac.glb --draco.compressionLevel 7
```

App đã bật sẵn DRACO decoder nên file nén Draco vẫn load được.
