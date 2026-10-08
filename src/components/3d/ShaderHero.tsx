"use client";

import React, { useEffect, useRef, useState } from "react";

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_reduced_motion;

  // Dither hash to eliminate 8-bit banding on dark gradients
  float hash(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p + 19.19);
    return fract((p.x + p.y) * p.x);
  }

  void main() {
    // Normalized coordinates with aspect correction
    vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Smooth time evaluation
    float t = u_reduced_motion > 0.5 ? 4.2 : u_time * 0.4;

    // Interactive pointer warp: creates dynamic fluid displacement near cursor
    vec2 mouseOffset = (u_mouse - 0.5) * 1.2;
    vec2 p = st * 1.3 - mouseOffset * 0.4;

    // Domain-warped harmonic wave equations (creates silk folds & ribbons)
    for (float i = 1.0; i < 5.0; i++) {
      p.x += 0.3 / i * sin(i * 3.0 * p.y + t * 0.6 + mouseOffset.x * 2.0) + 0.5;
      p.y += 0.3 / i * cos(i * 3.0 * p.x + t * 0.5 + mouseOffset.y * 2.0) - 0.3;
    }

    // Surface wave density & specular ridge calculations
    float wave1 = sin(p.x * 2.5 + t * 0.5);
    float wave2 = cos(p.y * 2.5 - t * 0.4);
    float flow = (wave1 + wave2) * 0.5;

    // Color definitions
    vec3 bgBase     = vec3(0.02, 0.04, 0.08); // Obsidian Deep Space
    vec3 cyanGlow   = vec3(0.00, 0.85, 0.95); // High-luminance Electric Cyan
    vec3 violetGlow = vec3(0.49, 0.23, 0.98); // Vivid Ultraviolet
    vec3 whiteLight = vec3(0.95, 0.98, 1.00); // Specular Glint

    // Color interpolation along flow ridges
    vec3 col = bgBase;
    col = mix(col, violetGlow, smoothstep(-0.6, 0.7, flow));
    col = mix(col, cyanGlow, smoothstep(0.2, 0.95, sin(p.x + p.y + t * 0.3)));

    // Dynamic mouse spotlight reflection
    float mouseDist = length(st - (u_mouse - 0.5) * 1.5);
    float mouseGlint = exp(-mouseDist * 2.2);
    col += whiteLight * (mouseGlint * 0.25);

    // Sharp luminous caustic highlights along the ribbon crests
    float crest = pow(clamp(1.0 - abs(flow), 0.0, 1.0), 4.0);
    col += cyanGlow * (crest * 0.35);

    // Deep radial vignette to preserve 100% legibility on center hero headline
    float centerDist = length(st * vec2(0.7, 0.9));
    col *= clamp(1.25 - centerDist * 0.75, 0.15, 1.0);

    // Organic fine grain
    float grain = (hash(gl_FragCoord.xy + fract(t)) - 0.5) * 0.025;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Compile shader helper
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Fullscreen quad positions
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uReducedLoc = gl.getUniformLocation(program, "u_reduced_motion");

    let mouseX = 0.5;
    let mouseY = 0.5;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handlePointerMove);

    // Reduced motion & visibility checks
    let isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Resize handling with DPR clamp (1 to 2)
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Render loop
    let animId: number;
    let startTime = performance.now();

    const render = () => {
      if (isVisible) {
        const currentTime = (performance.now() - startTime) / 1000.0;
        gl.uniform1f(uTimeLoc, currentTime);
        gl.uniform2f(uResLoc, canvas.width, canvas.height);
        gl.uniform2f(uMouseLoc, mouseX, mouseY);
        gl.uniform1f(uReducedLoc, isReducedMotion ? 1.0 : 0.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="shader-canvas"
      className="fixed inset-0 w-screen h-screen pointer-events-none -z-10"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}