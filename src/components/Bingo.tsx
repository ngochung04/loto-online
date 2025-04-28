import React, { useEffect, useRef } from "react";
import { useUserInfo } from "../stores/userStore";
import Ticket from "./Ticket";
import { TICKET_COLORS } from "../constance";

const canvasStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: "none",
  zIndex: 1000,
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  shape: "circle" | "star" | "ball" | "flag";
  size: number;
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) => {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0 - r);
  for (let i = 0; i < 5; i++) {
    ctx.rotate(Math.PI / 5);
    ctx.lineTo(0, 0 - r * 0.5);
    ctx.rotate(Math.PI / 5);
    ctx.lineTo(0, 0 - r);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
};

const drawFlag = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y + h * 0.2);
  ctx.lineTo(x, y + h * 0.4);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
};

const Bingo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playerBingo } = useUserInfo();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    function randomColor() {
      const colors = [
        "#ff512f",
        "#dd2476",
        "#2563eb",
        "#f68b1d",
        "#fced00",
        "#009e4f",
        "#00aac3",
        "#732982",
        "#ffea00",
        "#00eaff",
        "#ff00ea",
        "#00ffea",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    function randomShape(): Particle["shape"] {
      const shapes: Particle["shape"][] = ["circle", "star", "ball", "flag"];
      return shapes[Math.floor(Math.random() * shapes.length)];
    }
    function createFirework(x: number, y: number): Particle[] {
      const particles: Particle[] = [];
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40;
        const speed = Math.random() * 4 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: randomColor(),
          shape: randomShape(),
          size: Math.random() * 8 + 8,
        });
      }
      return particles;
    }
    let fireworks: Particle[] = [];
    function launchFirework() {
      const x =
        Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
      const y =
        Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.1;
      fireworks.push(...createFirework(x, y));
    }
    let frame = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      fireworks.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        if (p.shape === "circle" || p.shape === "ball") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, p.size / 2, p.color);
        } else if (p.shape === "flag") {
          drawFlag(ctx, p.x, p.y, p.size, p.size * 0.6, p.color);
        }
      });
      fireworks.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha -= 0.012;
      });
      fireworks = fireworks.filter((p) => p.alpha > 0);
      if (frame % 20 === 0) launchFirework();
      frame++;
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <canvas ref={canvasRef} style={canvasStyle}></canvas>
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "48px 32px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            textAlign: "center",
            minWidth: "1080px",
            margin: "32px",
          }}
        >
          <h1
            style={{
              fontSize: 48,
              color: "#dd2476",
              marginBottom: 16,
              fontWeight: 900,
              letterSpacing: 2,
              textShadow: "0 2px 8px #fff, 0 4px 32px #dd2476aa",
            }}
          >
            🎉 Bingo! 🎉
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <img
                key={i}
                src="/image.gif"
                alt="emoji dance"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                  animation: `dance 0.1s ${i * 0.1}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            {playerBingo.map((x) => {
              return (
                <div style={{ margin: "auto", width: "fit-content" }}>
                  <div
                    style={{
                      margin: "16px auto",
                      fontSize: "32px",
                      textTransform: "uppercase",
                      width: "fit-content",
                      color: TICKET_COLORS[x.id as keyof typeof TICKET_COLORS],
                      fontWeight: "bold",
                    }}
                  >
                    {x.name}
                  </div>
                  <Ticket ticketId={x.id as any} bingoSelection={x.selection} />
                </div>
              );
            })}
          </div>
          <style>{`
          @keyframes dance {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-20px) scale(1.15); }
          }
        `}</style>
        </div>
      </div>
    </>
  );
};

export default Bingo;
