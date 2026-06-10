"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import HeritageScene from "./HeritageScene";
import type { Lang, TimeLayer } from "@/lib/content";

// Gradient bầu trời theo palette của lớp hiện tại (CSS, sau Canvas)
function skyStyle(layer: TimeLayer): React.CSSProperties {
  return {
    background: `linear-gradient(180deg, ${layer.palette.skyTop} 0%, ${layer.palette.skyBottom} 100%)`,
  };
}

interface Props {
  layer: TimeLayer;
  prevLayer: TimeLayer;
  blend: number;
  festival: boolean;
  /** Then & Now: lớp phục dựng để overlay so sánh (nếu đang bật) */
  compareLayer?: TimeLayer | null;
  compareSplit?: number; // 0..1
  lang: Lang;
}

export default function Viewer4D({
  layer,
  prevLayer,
  blend,
  festival,
  compareLayer,
  compareSplit = 0.5,
  lang,
}: Props) {
  return (
    <div className="absolute inset-0">
      {/* Nền trời CSS chuyển mượt theo lớp */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={skyStyle(layer)}
        aria-hidden
      />

      {/* Canvas chính (hiện trạng / lớp đang chọn) */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [9, 6, 12], fov: 45 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <HeritageScene layer={layer} prevLayer={prevLayer} blend={blend} festival={festival} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableRotate={!compareLayer}
          enableZoom={!compareLayer}
          minDistance={6}
          maxDistance={20}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={!compareLayer}
          autoRotateSpeed={0.4}
          target={[0, 2.2, -1]}
        />
      </Canvas>

      {/* Lớp phục dựng overlay cho Then & Now (clip theo split) */}
      {compareLayer && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${compareSplit * 100}%)` }}
        >
          <div className="absolute inset-0" style={skyStyle(compareLayer)} aria-hidden />
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [9, 6, 12], fov: 45 }}
            className="absolute inset-0"
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <HeritageScene
                layer={compareLayer}
                prevLayer={compareLayer}
                blend={1}
                festival={festival}
              />
            </Suspense>
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
              target={[0, 2.2, -1]}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
}
