"use client";

import { useEffect, useRef } from "react";
import { getScrollFrameIsScrolling } from "@/lib/scroll/frame";

const RIBBON_VERTEX_SHADER = `
  varying vec3 vEC;
  uniform float time;

  float iqhash(float n) {
    return fract(sin(n) * 43758.5453);
  }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(mix(mix(iqhash(n), iqhash(n + 1.0), f.x),
            mix(iqhash(n + 57.0), iqhash(n + 58.0), f.x), f.y),
            mix(mix(iqhash(n + 113.0), iqhash(n + 114.0), f.x),
            mix(iqhash(n + 170.0), iqhash(n + 171.0), f.x), f.y), f.z);
  }

  float xmb_noise2(vec3 x) {
    return cos(x.z * 4.0) * cos(x.z + time / 10.0 + x.x);
  }

  void main() {
    vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 v = vec3(pos.x, 0.0, pos.y);
    vec3 v2 = v;
    vec3 v3 = v;

    v.y = xmb_noise2(v2) / 8.0;

    v3.x -= time / 5.0;
    v3.x /= 4.0;

    v3.z -= time / 10.0;
    v3.y -= time / 100.0;

    v.z -= noise(v3 * 7.0) / 15.0;
    v.y -= noise(v3 * 7.0) / 15.0 + cos(v.x * 2.0 - time / 2.0) / 5.0 - 0.3;

    vEC = v;
    gl_Position = vec4(v, 1.0);
  }
`;

const RIBBON_FRAGMENT_SHADER = `
  uniform float time;
  uniform vec3 ribbonColor;
  varying vec3 vEC;

  void main() {
    const vec3 up = vec3(0.0, 0.0, 1.0);
    vec3 x = dFdx(vEC);
    vec3 y = dFdy(vEC);
    vec3 normal = normalize(cross(x, y));
    float c = 1.0 - dot(normal, up);
    c = (1.0 - cos(c * c)) / 3.0;
    gl_FragColor = vec4(ribbonColor, c * 1.5);
  }
`;

type ThemeMode = "dark" | "light";

function getPixelRatio() {
  return Math.min(window.devicePixelRatio || 1, 1.25);
}

function getParticleCount() {
  return window.matchMedia("(max-width: 768px)").matches ? 900 : 1600;
}

function getThemeMode(): ThemeMode {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThreeBackground() {
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasWrap = canvasWrapRef.current;
    const ribbonContainer = ribbonRef.current;

    if (!canvas || !canvasWrap || !ribbonContainer) {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let disposeScene: (() => void) | undefined;

    const init = async () => {
      const THREE = await import("three");

      if (cancelled) {
        return;
      }

      let rot = 0;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const particleScene = new THREE.Scene();
      const particleFog = new THREE.Fog(0x000000, 50, 2000);
      particleScene.fog = particleFog;

      const particleCamera = new THREE.PerspectiveCamera(70, width / height);
      particleCamera.lookAt(0, 0, 0);

      const particleRenderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        powerPreference: "high-performance",
      });
      particleRenderer.setPixelRatio(getPixelRatio());
      particleRenderer.setSize(width, height);

      const vertices: number[] = [];
      const SIZE = 3000;
      const LENGTH = getParticleCount();

      for (let i = 0; i < LENGTH; i += 1) {
        vertices.push(
          SIZE * (Math.random() - 0.5),
          SIZE * (Math.random() - 0.5),
          SIZE * (Math.random() - 0.5)
        );
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff });
      const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
      particleScene.add(particleMesh);

      const ribbonScene = new THREE.Scene();
      const ribbonCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
      ribbonCamera.position.z = 2;

      const ribbonRenderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      ribbonContainer.appendChild(ribbonRenderer.domElement);

      const ribbonMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          ribbonColor: { value: new THREE.Color(1, 1, 1) },
        },
        vertexShader: RIBBON_VERTEX_SHADER,
        fragmentShader: RIBBON_FRAGMENT_SHADER,
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: false,
      });

      const ribbon = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 64, 64),
        ribbonMaterial
      );
      ribbonScene.add(ribbon);

      const applyTheme = (mode: ThemeMode) => {
        if (mode === "light") {
          particleMaterial.color.set(0x475569);
          particleFog.color.set(0xf8fafc);
          ribbonMaterial.uniforms.ribbonColor.value.set(0.29, 0.34, 0.42);
        } else {
          particleMaterial.color.set(0xffffff);
          particleFog.color.set(0x000000);
          ribbonMaterial.uniforms.ribbonColor.value.set(1, 1, 1);
        }
      };

      const resizeParticles = () => {
        const nextWidth = window.innerWidth;
        const nextHeight = window.innerHeight;
        particleCamera.aspect = nextWidth / nextHeight;
        particleCamera.updateProjectionMatrix();
        particleRenderer.setPixelRatio(getPixelRatio());
        particleRenderer.setSize(nextWidth, nextHeight);
      };

      const resizeRibbon = () => {
        const { offsetWidth, offsetHeight } = ribbonContainer;
        ribbonRenderer.setSize(offsetWidth, offsetHeight);
        ribbonRenderer.setPixelRatio(getPixelRatio());
        ribbonCamera.aspect = offsetWidth / offsetHeight;
        ribbonCamera.updateProjectionMatrix();
        ribbon.scale.set(ribbonCamera.aspect * 1.55, 0.75, 1);
      };

      const handleResize = () => {
        resizeParticles();
        resizeRibbon();
      };

      const renderLoop = () => {
        if (document.hidden) {
          animationId = window.requestAnimationFrame(renderLoop);
          return;
        }

        const isScrolling = getScrollFrameIsScrolling();

        if (!isScrolling) {
          rot += 0.1;
          const radian = (rot * Math.PI) / 180;
          particleCamera.position.x = 1000 * Math.sin(radian);
          particleCamera.position.z = 1000 * Math.cos(radian);
          particleMesh.rotation.y += 0.001;
          particleRenderer.render(particleScene, particleCamera);
        }

        if (!isScrolling) {
          ribbonMaterial.uniforms.time.value += 0.01;
          ribbonRenderer.render(ribbonScene, ribbonCamera);
        }

        animationId = window.requestAnimationFrame(renderLoop);
      };

      const onVisibilityChange = () => {
        if (!document.hidden) {
          resizeParticles();
          resizeRibbon();
        }
      };

      const themeObserver = new MutationObserver(() => {
        applyTheme(getThemeMode());
      });

      applyTheme(getThemeMode());
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      canvasWrap.style.transform = "scale(0)";
      canvasWrap.style.transition = "transform 0.5s ease-out";
      ribbonContainer.style.opacity = "0";
      ribbonContainer.style.transition = "opacity 5s ease 0.7s";

      requestAnimationFrame(() => {
        canvasWrap.style.transform = "scale(1)";
        ribbonContainer.style.opacity = "0.3";
      });

      resizeRibbon();
      renderLoop();
      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", onVisibilityChange);

      disposeScene = () => {
        themeObserver.disconnect();
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.cancelAnimationFrame(animationId);
        particleGeometry.dispose();
        particleMaterial.dispose();
        particleRenderer.dispose();
        ribbon.geometry.dispose();
        ribbon.material.dispose();
        ribbonRenderer.dispose();
        if (ribbonRenderer.domElement.parentNode === ribbonContainer) {
          ribbonContainer.removeChild(ribbonRenderer.domElement);
        }
      };
    };

    void init();

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 z-[2] h-full w-full origin-center"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      <div
        ref={ribbonRef}
        className="absolute top-[20%] right-0 left-0 -z-[1] h-screen w-full overflow-hidden"
      />
    </div>
  );
}
