"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TimeLayer } from "@/lib/content";
import GLBModel from "./GLBModel";

// ----------------------------------------------------------------------------
// Tinh chỉnh đặt model thật vào scene. Model Sketchfab mỗi cái một scale/trục —
// sau khi tải .glb về, chỉnh các số này cho khớp tỉ lệ với sân & bia khác.
// (scale = hệ số phóng; position = dời; rotation = xoay theo radian)
// ----------------------------------------------------------------------------
const MODEL_TUNING = {
  khueVanCac: {
    scale: 1,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  biaTienSi: {
    scale: 1,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
};

// ============================================================================
// HeritageScene — mô hình Văn Miếu cách điệu (low-poly) cho 4D Viewer.
// Không phải mô hình khảo cổ chính xác; là biểu tượng đủ để demo Time Slider.
// Toàn bộ scene nhận `layer` (palette) + `festival` + `recon` để đổi không khí.
// ============================================================================

function lerpColor(a: string, b: string, t: number) {
  return new THREE.Color(a).lerp(new THREE.Color(b), t);
}

// ---------------------------------------------------------------------------
// Hàng ngói ống (âm dương) chạy dọc theo diềm mái — các trụ bán nguyệt nhỏ.
// ---------------------------------------------------------------------------
function TileRow({
  length,
  radius = 0.05,
  gap = 0.13,
  color,
  y,
  z,
}: {
  length: number;
  radius?: number;
  gap?: number;
  color: string;
  y: number;
  z: number;
}) {
  const count = Math.max(2, Math.floor(length / gap));
  const items = Array.from({ length: count }, (_, i) => -length / 2 + i * gap + gap / 2);
  return (
    <group position={[0, y, z]}>
      {items.map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[radius, radius, 0.18, 8, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Đầu đao / kìm nóc cách điệu (đuôi rồng cong vút ở góc mái).
// ---------------------------------------------------------------------------
function RidgeBeast({ color }: { color: string }) {
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.06, 0.16, 0),
      new THREE.Vector3(0.02, 0.3, 0),
      new THREE.Vector3(-0.1, 0.36, 0),
    ];
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  const geom = useMemo(() => new THREE.TubeGeometry(curve, 16, 0.035, 6, false), [curve]);
  return (
    <group>
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* các vây nhỏ trên sống */}
      {[0.12, 0.2, 0.28].map((t, i) => (
        <mesh key={i} position={[0.04 - i * 0.02, t, 0]} rotation={[0, 0, 0.5]} castShadow>
          <coneGeometry args={[0.025, 0.07, 4]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Một mảng chữ Hán cách điệu trên bia — lưới ô vuông nhỏ chìm (gợi cột chữ).
// ---------------------------------------------------------------------------
function CarvedText({
  w,
  h,
  cols,
  rows,
  color,
  z,
}: {
  w: number;
  h: number;
  cols: number;
  rows: number;
  color: string;
  z: number;
}) {
  const cells: [number, number][] = [];
  const cw = w / cols;
  const ch = h / rows;
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) {
      cells.push([-w / 2 + cw * (c + 0.5), -h / 2 + ch * (r + 0.5)]);
    }
  return (
    <group position={[0, 0, z]}>
      {cells.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[cw * 0.62, ch * 0.62, 0.006]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Mái đao cong kiểu Việt — dựng bằng ExtrudeGeometry từ một tiết diện cong
// (đầu đao hếch lên). Bốn cạnh ghép thành mái 4 hướng có đầu đao vút.
// ---------------------------------------------------------------------------

// Tiết diện dốc mái nằm trong mặt phẳng XY: x = từ nóc (0) ra diềm (half+flare),
// y = độ cao. Mặt dưới và mặt trên cách nhau bởi bề dày. Extrude theo trục Z
// (chiều dài cạnh mái). Đầu đao hếch lên ở cuối.
function makeEaveShape(half: number, rise: number, flare: number) {
  const t = 0.08; // bề dày mái
  const s = new THREE.Shape();
  // mặt dưới: nóc -> diềm -> hếch đao
  s.moveTo(0, rise);
  s.quadraticCurveTo(half * 0.5, rise * 0.42, half, 0.04);
  s.quadraticCurveTo(half + flare * 0.55, -0.05, half + flare, flare * 0.55);
  // lên bề dày ở đầu đao
  s.lineTo(half + flare, flare * 0.55 + t);
  // mặt trên: hếch đao -> diềm -> nóc
  s.quadraticCurveTo(half + flare * 0.55, t - 0.02, half, 0.04 + t);
  s.quadraticCurveTo(half * 0.5, rise * 0.42 + t, 0, rise + t);
  s.closePath();
  return s;
}

/** Một tầng mái đao 4 hướng + bờ nóc. */
function FlaredRoof({
  half,
  rise,
  flare,
  side,
  color,
  y,
}: {
  half: number;  // khoảng cách nóc -> diềm (chưa tính đao)
  rise: number;  // độ cao nóc
  flare: number; // độ vươn + hếch đầu đao
  side: number;  // nửa chiều dài cạnh mái (trục extrude)
  color: THREE.Color | string;
  y: number;
}) {
  const shape = useMemo(() => makeEaveShape(half, rise, flare), [half, rise, flare]);
  const geom = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: side * 2,
      bevelEnabled: false,
      steps: 1,
    });
    g.translate(0, 0, -side); // căn giữa theo Z
    g.computeVertexNormals();
    return g;
  }, [shape, side]);

  // 4 tấm mái xoay quanh trục Y, mỗi tấm hướng dốc ra một phía
  const dirs = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  const eaveOut = half + flare;       // vị trí diềm mái (ngói ống)
  const eaveY = flare * 0.55 + 0.06;  // độ cao đầu đao
  return (
    <group position={[0, y, 0]}>
      {dirs.map((rot, i) => (
        <group key={i} rotation={[0, rot, 0]}>
          {/* tấm mái */}
          <mesh geometry={geom} castShadow receiveShadow>
            <meshStandardMaterial color={color} flatShading roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
          {/* hàng ngói ống dọc diềm mái */}
          <TileRow length={side * 1.9} color="#7a2a1e" y={eaveY} z={eaveOut} />
          {/* đầu đao kìm nóc ở 2 góc của cạnh này */}
          <group position={[side * 0.95, eaveY, eaveOut - 0.05]} rotation={[0, -0.4, 0]}>
            <RidgeBeast color="#caa24e" />
          </group>
          <group position={[-side * 0.95, eaveY, eaveOut - 0.05]} rotation={[0, 0.4, 0]}>
            <RidgeBeast color="#caa24e" />
          </group>
        </group>
      ))}
      {/* bờ nóc */}
      <mesh position={[0, rise + 0.06, 0]} castShadow>
        <boxGeometry args={[side * 0.7, 0.14, side * 0.7]} />
        <meshStandardMaterial color="#5e1f14" roughness={0.8} />
      </mesh>
      {/* ngói bờ nóc */}
      <TileRow length={side * 0.7} color="#6e2418" y={rise + 0.14} z={side * 0.35} />
      <TileRow length={side * 0.7} color="#6e2418" y={rise + 0.14} z={-side * 0.35} />
    </group>
  );
}

/** Con sơn / đấu củng đỡ mái — dải khối nhỏ chạy quanh thân lầu. */
function Brackets({ half, y, color }: { half: number; y: number; color: string }) {
  const items: [number, number][] = [];
  const n = 5;
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1) - 0.5) * 2 * (half * 0.8);
    items.push([t, 0]);
  }
  const sides = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  return (
    <group position={[0, y, 0]}>
      {sides.map((rot, si) => (
        <group key={si} rotation={[0, rot, 0]}>
          {items.map(([x], i) => (
            <mesh key={i} position={[x, 0, half + 0.02]} castShadow>
              <boxGeometry args={[0.1, 0.16, 0.22]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Cửa sổ tròn tỏa tia — biểu tượng sao Khuê (mặt trời/sao). */
function StarWindow({ r = 0.34, color }: { r?: number; color: string }) {
  const rays = 16;
  return (
    <group>
      {/* vành ngoài */}
      <mesh>
        <torusGeometry args={[r, 0.05, 12, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* nan tỏa tia */}
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[r * 0.92, 0.035, 0.04]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        );
      })}
      {/* moay-ơ giữa */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Lan can con tiện chạy quanh sàn lầu. */
function Balustrade({ half, y, color }: { half: number; y: number; color: string }) {
  const posts: [number, number][] = [];
  const n = 6;
  for (let i = 0; i <= n; i++) {
    const t = (i / n - 0.5) * 2 * half;
    posts.push([t, half]);
    posts.push([t, -half]);
    posts.push([half, t]);
    posts.push([-half, t]);
  }
  return (
    <group position={[0, y, 0]}>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.24, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
      {/* tay vịn 4 cạnh */}
      {[
        [0, half, 0],
        [0, -half, 0],
        [half, 0, Math.PI / 2],
        [-half, 0, Math.PI / 2],
      ].map(([x, z, rot], i) => (
        <mesh key={`r${i}`} position={[x, 0.26, z]} rotation={[0, rot, 0]} castShadow>
          <boxGeometry args={[half * 2, 0.05, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// KHUÊ VĂN CÁC — phiên bản chi tiết cao
//   • tầng dưới: 4 trụ gạch vuông trên đế đá
//   • tầng lầu: thân gỗ đỏ, 4 cửa sổ tròn tỏa tia, lan can con tiện
//   • mái: 2 tầng 8 đao cong + con sơn + bờ nóc + đôi cá chép/lưỡng long cách điệu
// ---------------------------------------------------------------------------
function KhueVanCac({ roof, wood }: { roof: THREE.Color; wood: THREE.Color }) {
  const brick = "#9a4a3a";      // trụ gạch
  const stone = "#b9ab88";      // đá
  const gold = "#d4a24e";       // đại tự / chi tiết
  const redBody = "#a8281c";    // thân lầu sơn son
  const pillars = [
    [-0.78, -0.78],
    [0.78, -0.78],
    [-0.78, 0.78],
    [0.78, 0.78],
  ] as const;

  return (
    <group position={[0, 0, 0]}>
      {/* ===== Đế đá 2 cấp ===== */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.0, 0.2, 3.0]} />
        <meshStandardMaterial color={stone} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.28, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.6, 0.18, 2.6]} />
        <meshStandardMaterial color="#c8bb98" roughness={0.95} />
      </mesh>

      {/* ===== Tầng dưới: 4 trụ gạch vuông ===== */}
      {pillars.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[0.42, 1.5, 0.42]} />
            <meshStandardMaterial color={brick} roughness={0.9} />
          </mesh>
          {/* chân & đầu trụ bằng đá */}
          <mesh position={[0, 0.34, 0]} castShadow>
            <boxGeometry args={[0.5, 0.14, 0.5]} />
            <meshStandardMaterial color={stone} roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.78, 0]} castShadow>
            <boxGeometry args={[0.5, 0.14, 0.5]} />
            <meshStandardMaterial color={stone} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ===== Sàn lầu ===== */}
      <mesh position={[0, 1.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.16, 2.2]} />
        <meshStandardMaterial color={wood} roughness={0.7} />
      </mesh>
      {/* lan can con tiện quanh sàn */}
      <Balustrade half={1.05} y={2.03} color="#8a3a22" />

      {/* ===== Tầng lầu gỗ đỏ ===== */}
      <mesh position={[0, 2.62, 0]} castShadow>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color={redBody} roughness={0.6} />
      </mesh>
      {/* cột góc lầu */}
      {[
        [-0.78, -0.78],
        [0.78, -0.78],
        [-0.78, 0.78],
        [0.78, 0.78],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.62, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 1.2, 10]} />
          <meshStandardMaterial color="#7a1d14" roughness={0.6} />
        </mesh>
      ))}

      {/* 4 cửa sổ tròn tỏa tia — biểu tượng sao Khuê */}
      <group position={[0, 2.66, 0.81]}>
        <StarWindow color={gold} />
      </group>
      <group position={[0, 2.66, -0.81]} rotation={[0, Math.PI, 0]}>
        <StarWindow color={gold} />
      </group>
      <group position={[0.81, 2.66, 0]} rotation={[0, Math.PI / 2, 0]}>
        <StarWindow color={gold} />
      </group>
      <group position={[-0.81, 2.66, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <StarWindow color={gold} />
      </group>

      {/* khung gỗ vuông ôm quanh mỗi cửa sổ tròn (4 mặt) */}
      {[
        [0, 0.83, 0],
        [0, -0.83, Math.PI],
        [0.83, 0, Math.PI / 2],
        [-0.83, 0, -Math.PI / 2],
      ].map(([x, z, rot], i) => (
        <group key={`fr${i}`} position={[x, 2.66, z]} rotation={[0, rot, 0]}>
          {/* viền khung */}
          {[
            [0, 0.46, 1.0, 0.07],
            [0, -0.46, 1.0, 0.07],
            [0.46, 0, 0.07, 0.99],
            [-0.46, 0, 0.07, 0.99],
          ].map(([fx, fy, fw, fh], j) => (
            <mesh key={j} position={[fx, fy, 0.005]} castShadow>
              <boxGeometry args={[fw, fh, 0.05]} />
              <meshStandardMaterial color="#7a1d14" roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* dải hoa văn chân thân lầu (triện) */}
      <TileRow length={1.5} radius={0.04} gap={0.16} color="#caa24e" y={2.06} z={0.81} />
      <TileRow length={1.5} radius={0.04} gap={0.16} color="#caa24e" y={2.06} z={-0.81} />

      {/* đại tự (hoành phi) phía trước, dưới cửa sổ */}
      <mesh position={[0, 3.34, 0.82]} castShadow>
        <boxGeometry args={[0.95, 0.2, 0.05]} />
        <meshStandardMaterial color={gold} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* 3 chữ trên hoành phi (ô chìm) */}
      <group position={[0, 3.34, 0.845]}>
        <CarvedText w={0.78} h={0.13} cols={3} rows={1} color="#7a4a16" z={0} />
      </group>

      {/* đôi câu đối dọc 2 cột trước */}
      {[0.83, -0.83].map((x, i) => (
        <group key={`cd${i}`} position={[x, 2.9, 0.84]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 1.0, 0.04]} />
            <meshStandardMaterial color="#7a1d14" roughness={0.6} />
          </mesh>
          <CarvedText w={0.08} h={0.82} cols={1} rows={6} color={gold} z={0.025} />
        </group>
      ))}

      {/* ===== Mái tầng 1 (lớn, thấp) ===== */}
      <Brackets half={0.92} y={3.28} color="#6e2418" />
      <FlaredRoof half={1.15} rise={0.6} flare={0.45} side={1.5} color={roof} y={3.42} />

      {/* ===== Cổ diêm giữa 2 mái ===== */}
      <mesh position={[0, 3.95, 0]} castShadow>
        <boxGeometry args={[1.0, 0.45, 1.0]} />
        <meshStandardMaterial color={redBody} roughness={0.6} />
      </mesh>

      {/* ===== Mái tầng 2 (nhỏ, cao) ===== */}
      <Brackets half={0.6} y={4.18} color="#6e2418" />
      <FlaredRoof half={0.85} rise={0.5} flare={0.36} side={1.1} color={roof} y={4.3} />

      {/* ===== Đỉnh nóc: bầu rượu / hồ lô ===== */}
      <mesh position={[0, 4.95, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={gold} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.1, 0]} castShadow>
        <coneGeometry args={[0.07, 0.18, 10]} />
        <meshStandardMaterial color={gold} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Bia Tiến sĩ chi tiết tối đa: rùa (mai chia ô, mắt, móng) + thân khắc chữ + trán hoa văn. */
function SteleFallback({ color }: { color: string }) {
  const shell = "#6f6450";
  const shellDark = "#5b5142";
  const stone = color;
  // toạ độ các ô vảy trên mai rùa
  const scutes: [number, number][] = [
    [0, 0], [0.13, 0], [-0.13, 0], [0, 0.14], [0, -0.14],
    [0.13, 0.13], [-0.13, 0.13], [0.13, -0.13], [-0.13, -0.13],
  ];
  return (
    <group>
      {/* ===== Bệ đá dưới cùng ===== */}
      <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.78, 0.06, 0.62]} />
        <meshStandardMaterial color="#a89878" roughness={0.95} />
      </mesh>

      {/* ===== Rùa ===== */}
      {/* mai rùa */}
      <mesh position={[0, 0.16, 0]} scale={[1.35, 0.6, 1.05]} castShadow>
        <sphereGeometry args={[0.3, 20, 14]} />
        <meshStandardMaterial color={shell} roughness={0.95} flatShading />
      </mesh>
      {/* gờ viền mai */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.38, 0.03, 8, 24]} />
        <meshStandardMaterial color={shellDark} roughness={0.95} />
      </mesh>
      {/* ô vảy trên mai */}
      {scutes.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.27, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.01, 6]} />
          <meshStandardMaterial color={shellDark} roughness={0.95} />
        </mesh>
      ))}
      {/* đầu rùa vươn ra + mắt */}
      <mesh position={[0, 0.13, 0.4]} castShadow>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial color="#7a6f58" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.11, 0.48]} castShadow>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color="#867a62" roughness={0.95} />
      </mesh>
      {[0.04, -0.04].map((ex, i) => (
        <mesh key={i} position={[ex, 0.15, 0.5]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color="#2a2018" roughness={0.5} />
        </mesh>
      ))}
      {/* đuôi */}
      <mesh position={[0, 0.1, -0.42]} rotation={[0.3, 0, 0]} castShadow>
        <coneGeometry args={[0.04, 0.16, 6]} />
        <meshStandardMaterial color="#7a6f58" roughness={0.95} />
      </mesh>
      {/* 4 chân + móng */}
      {[
        [-0.3, 0.34],
        [0.3, 0.34],
        [-0.3, -0.32],
        [0.3, -0.32],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.06, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.13, 0.1, 0.16]} />
            <meshStandardMaterial color="#7a6f58" roughness={0.95} />
          </mesh>
          {/* móng */}
          {[-0.04, 0, 0.04].map((mx, j) => (
            <mesh key={j} position={[mx, -0.03, (z > 0 ? 0.09 : -0.09)]}>
              <coneGeometry args={[0.012, 0.04, 5]} />
              <meshStandardMaterial color="#5b5142" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ===== Bệ bia trên lưng rùa ===== */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.44, 0.1, 0.2]} />
        <meshStandardMaterial color="#8d8064" roughness={0.9} />
      </mesh>

      {/* ===== Thân bia ===== */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.38, 0.86, 0.08]} />
        <meshStandardMaterial color={stone} roughness={0.9} />
      </mesh>
      {/* khung viền chạm quanh thân bia */}
      <mesh position={[0, 0.78, 0.041]}>
        <boxGeometry args={[0.33, 0.78, 0.006]} />
        <meshStandardMaterial color="#8a7d62" roughness={0.85} />
      </mesh>
      {/* chữ khắc trên mặt bia (lưới ô chìm) */}
      <group position={[0, 0.78, 0.046]}>
        <CarvedText w={0.27} h={0.68} cols={4} rows={9} color="#6a5e46" z={0} />
      </group>

      {/* ===== Trán bia bo cong (bán nguyệt) ===== */}
      <mesh position={[0, 1.21, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.08, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={stone} roughness={0.9} />
      </mesh>
      {/* hoa văn lưỡng long chầu cách điệu trên trán bia */}
      <mesh position={[0, 1.22, 0.045]}>
        <torusGeometry args={[0.11, 0.02, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#8a7d62" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.22, 0.045]}>
        <torusGeometry args={[0.06, 0.014, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#8a7d62" roughness={0.85} />
      </mesh>
      {/* mặt nguyệt giữa trán */}
      <mesh position={[0, 1.26, 0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
        <meshStandardMaterial color="#8a7d62" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Hàng bia Tiến sĩ dưới nhà bia có mái che (đặc trưng Văn Miếu). */
function SteleRow({ z, color, roofed = true }: { z: number; color: string; roofed?: boolean }) {
  const items = [-2.6, -1.6, -0.6, 0.6, 1.6, 2.6];
  const span = 6.0;
  return (
    <group position={[0, 0, z]}>
      {items.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <GLBModel
            url="/models/bia-tien-si.glb"
            scale={MODEL_TUNING.biaTienSi.scale}
            position={MODEL_TUNING.biaTienSi.position}
            rotation={MODEL_TUNING.biaTienSi.rotation}
            fallback={<SteleFallback color={color} />}
          />
        </group>
      ))}

      {/* ===== Nhà bia: 4 cột + mái dốc dài ===== */}
      {roofed && (
        <group>
          {/* cột đỡ */}
          {[-2.7, -0.9, 0.9, 2.7].map((cx, i) =>
            [0.55, -0.55].map((cz, j) => (
              <mesh key={`${i}-${j}`} position={[cx, 0.95, cz]} castShadow>
                <cylinderGeometry args={[0.06, 0.07, 1.9, 10]} />
                <meshStandardMaterial color="#7a1d14" roughness={0.65} />
              </mesh>
            ))
          )}
          {/* xà dọc */}
          {[0.55, -0.55].map((bz, i) => (
            <mesh key={i} position={[0, 1.95, bz]} castShadow>
              <boxGeometry args={[span, 0.1, 0.1]} />
              <meshStandardMaterial color="#7a1d14" roughness={0.65} />
            </mesh>
          ))}
          {/* mái dốc 2 phía (2 tấm nghiêng) */}
          {[1, -1].map((dir, i) => (
            <mesh
              key={i}
              position={[0, 2.18, dir * 0.42]}
              rotation={[dir * 0.62, 0, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[span + 0.4, 0.08, 0.95]} />
              <meshStandardMaterial color="#7a2a1e" roughness={0.85} />
            </mesh>
          ))}
          {/* bờ nóc */}
          <mesh position={[0, 2.42, 0]} castShadow>
            <boxGeometry args={[span + 0.5, 0.1, 0.12]} />
            <meshStandardMaterial color="#5e1f14" roughness={0.8} />
          </mesh>
          {/* ngói dọc 2 diềm mái */}
          <TileRow length={span + 0.3} radius={0.045} gap={0.14} color="#6e2418" y={1.96} z={0.88} />
          <TileRow length={span + 0.3} radius={0.045} gap={0.14} color="#6e2418" y={1.96} z={-0.88} />
        </group>
      )}
    </group>
  );
}

/** Cây cổ thụ cách điệu. */
function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.4, 8]} />
        <meshStandardMaterial color="#5b432c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#4f6238" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0.35, 1.3, 0.2]} castShadow>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#5a6b41" flatShading roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Đám đông (festival): các khối người di chuyển nhẹ quanh sân. */
function Crowd({ count, active }: { count: number; active: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 73) % 100) / 100 * 10 - 5,
        z: ((i * 137) % 100) / 100 * 8 - 1,
        phase: (i * 0.7) % (Math.PI * 2),
        speed: 0.3 + ((i * 13) % 7) / 14,
        hue: (i * 37) % 360,
      })),
    [count]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const wobble = active ? Math.sin(t * s.speed + s.phase) * 0.5 : 0;
      dummy.position.set(s.x + wobble, 0.45, s.z + Math.cos(t * s.speed + s.phase) * 0.3);
      dummy.scale.setScalar(active ? 1 : 0.001);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <capsuleGeometry args={[0.13, 0.5, 4, 8]} />
      <meshStandardMaterial color="#c9402c" roughness={0.8} />
    </instancedMesh>
  );
}

/** Đèn lồng treo (festival). */
function Lanterns({ active }: { active: boolean }) {
  const positions = [
    [-3, 3.2, 2],
    [3, 3.2, 2],
    [-2, 3.0, -2],
    [2, 3.0, -2],
    [0, 3.5, 3],
  ] as const;
  return (
    <group visible={active}>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial
              color="#ff5a3c"
              emissive="#ff7a3c"
              emissiveIntensity={active ? 1.4 : 0}
              roughness={0.5}
            />
          </mesh>
          <pointLight color="#ff8a4c" intensity={active ? 0.6 : 0} distance={3} />
        </group>
      ))}
    </group>
  );
}

/** Sương sớm / khói hương — particle nhẹ. */
function Mist({ color, density }: { color: string; density: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, count } = useMemo(() => {
    const c = Math.floor(120 * density);
    const arr = new Float32Array(c * 3);
    for (let i = 0; i < c; i++) {
      arr[i * 3] = (((i * 53) % 100) / 100) * 16 - 8;
      arr[i * 3 + 1] = (((i * 91) % 100) / 100) * 3 + 0.2;
      arr[i * 3 + 2] = (((i * 29) % 100) / 100) * 12 - 5;
    }
    return { positions: arr, count: c };
  }, [density]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      const m = ref.current.material as THREE.PointsMaterial;
      m.opacity = 0.18 * density + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.5} transparent opacity={0.2} depthWrite={false} />
    </points>
  );
}

interface SceneProps {
  layer: TimeLayer;
  prevLayer: TimeLayer;
  /** 0..1 tiến trình crossfade giữa prevLayer -> layer */
  blend: number;
  festival: boolean;
}

export default function HeritageScene({ layer, prevLayer, blend, festival }: SceneProps) {
  // Nội suy palette giữa 2 lớp gần nhất (Time Slider crossfade)
  const p = layer.palette;
  const pp = prevLayer.palette;
  const groundColor = lerpColor(pp.fog, p.fog, blend);
  const roofColor = lerpColor("#7a2a1e", "#7a2a1e", blend); // ngói luôn đỏ nâu
  const woodColor = lerpColor("#8a3a22", "#8a3a22", blend);
  const lightColor = lerpColor(pp.light, p.light, blend);
  const ambient = THREE.MathUtils.lerp(pp.ambient, p.ambient, blend);
  const sun = THREE.MathUtils.lerp(pp.sunIntensity, p.sunIntensity, blend);

  const recon = layer.reconstruction;
  const festivalActive = festival && layer.festivalCapable;
  const mistDensity = layer.id === "dawn" ? 1 : festivalActive ? 0.7 : 0.25;
  const groupRef = useRef<THREE.Group>(null);

  // Lớp phục dựng: hơi "mơ", phủ tông hổ phách → thể hiện đây là quá khứ tái hiện
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = recon ? Math.sin(performance.now() * 0.0005) * 0.02 : 0;
    }
  });

  return (
    <>
      <ambientLight intensity={ambient} color={lightColor} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={sun}
        color={lightColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={[p.skyTop, groundColor.getStyle(), ambient * 0.6]} />

      <group ref={groupRef}>
        {/* Sân nền */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 18]} />
          <meshStandardMaterial color={groundColor} roughness={1} />
        </mesh>
        {/* Lối đi giữa lát đá */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]} receiveShadow>
          <planeGeometry args={[3, 14]} />
          <meshStandardMaterial color="#b9ab88" roughness={0.95} />
        </mesh>

        {/* Cổng / Khuê Văn Các ở trung tâm — model thật nếu có, fallback cách điệu */}
        <group position={[0, 0, -3]}>
          <GLBModel
            url="/models/khue-van-cac.glb"
            scale={MODEL_TUNING.khueVanCac.scale}
            position={MODEL_TUNING.khueVanCac.position}
            rotation={MODEL_TUNING.khueVanCac.rotation}
            fallback={<KhueVanCac roof={roofColor} wood={woodColor} />}
          />
        </group>

        {/* Hai hàng bia Tiến sĩ hai bên hồ */}
        <SteleRow z={2.5} color={recon ? "#cbb78c" : "#8d8064"} />
        <SteleRow z={4.5} color={recon ? "#cbb78c" : "#8d8064"} />

        {/* Cây cổ thụ */}
        <Tree x={-5} z={3} scale={1.2} />
        <Tree x={5.2} z={1.5} />
        <Tree x={-4.5} z={-2} scale={0.9} />

        {/* Đám đông + đèn lồng (festival) */}
        <Crowd count={40} active={festivalActive} />
        <Lanterns active={festivalActive} />

        {/* Sương / khói */}
        <Mist color={layer.id === "dawn" ? "#dfe7ef" : "#e8c79a"} density={mistDensity} />
      </group>

      <fog attach="fog" args={[groundColor.getStyle(), 12, recon ? 26 : 34]} />
    </>
  );
}
