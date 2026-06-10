"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// GLBModel — load model .glb thật từ public/models/ với fallback an toàn.
//
// Luồng:
//   1. HEAD request kiểm tra file có tồn tại không (tránh useGLTF throw khi 404).
//   2. Nếu có  -> render <Gltf> (Suspense lo phần tải).
//   3. Nếu không -> render `fallback` (model cách điệu primitive).
//   4. ErrorBoundary bọc ngoài: file hỏng/parse lỗi vẫn rơi về fallback.
//
// Model thật là kiến trúc TĨNH; ánh sáng/sương/đám đông/palette do scene phủ
// lên (lớp 4D động) — nên model không cần biết gì về Time Slider.
// ============================================================================

type Status = "checking" | "present" | "absent";

function useFileExists(url: string): Status {
  const [status, setStatus] = useState<Status>("checking");
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((r) => {
        if (cancelled) return;
        setStatus(r.ok ? "present" : "absent");
      })
      .catch(() => {
        if (!cancelled) setStatus("absent");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return status;
}

class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[GLBModel] load failed, using fallback:", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// DRACO decoder (CDN của Google) — để load được model nén bằng gltf-pipeline.
const DRACO_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

function GltfInner({
  url,
  scale,
  position,
  rotation,
}: {
  url: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const { scene } = useGLTF(url, DRACO_PATH);
  // clone để dùng được nhiều instance (vd nhiều bia) mà không share material state
  const cloned = React.useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return <primitive object={cloned} scale={scale} position={position} rotation={rotation} />;
}

export interface GLBModelProps {
  /** đường dẫn từ public, vd "/models/khue-van-cac.glb" */
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** model cách điệu dùng khi chưa có file thật */
  fallback: React.ReactNode;
}

export default function GLBModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  fallback,
}: GLBModelProps) {
  const status = useFileExists(url);

  // Trong lúc kiểm tra hoặc khi không có file -> hiện fallback luôn
  if (status !== "present") return <>{fallback}</>;

  return (
    <ModelErrorBoundary fallback={<>{fallback}</>}>
      <Suspense fallback={fallback}>
        <GltfInner url={url} scale={scale} position={position} rotation={rotation} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
