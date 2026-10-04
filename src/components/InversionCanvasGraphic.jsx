import React, { useEffect, useRef } from 'react';

export default function InversionCanvasGraphic({
  pblHeight = 350,
  stubbleFlux = 80,
  activeMitigation = 'none' // 'none' | 'smog-gun' | 'thermal-cannon' | 'rain'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Particle system
    const numParticles = Math.min(180, Math.round(30 + stubbleFlux * 1.5));
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.45) * 0.8,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.8 + 1.2,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    let t = 0;

    const render = () => {
      t += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // PBL ceiling Y position: 900m is top (~30px from top), 180m is bottom (~60px above ground)
      const groundY = height - 40;
      const pblFraction = (pblHeight - 180) / (900 - 180);
      let pblY = groundY - (pblFraction * (groundY - 60));

      if (activeMitigation === 'thermal-cannon') {
        pblY -= 50; // Inversion lid pushed higher by artificial convection
      }

      // 1. Sky Gradient (Upper free troposphere vs Trapped inversion layer)
      // Upper clear layer
      const upperSky = ctx.createLinearGradient(0, 0, 0, pblY);
      upperSky.addColorStop(0, '#537895');
      upperSky.addColorStop(1, '#90b4ce');
      ctx.fillStyle = upperSky;
      ctx.fillRect(0, 0, width, pblY);

      // Trapped smoggy air below inversion layer
      const smogLayer = ctx.createLinearGradient(0, pblY, 0, groundY);
      smogLayer.addColorStop(0, 'rgba(180, 160, 140, 0.75)');
      smogLayer.addColorStop(0.5, 'rgba(140, 110, 90, 0.85)');
      smogLayer.addColorStop(1, 'rgba(95, 75, 60, 0.92)');
      ctx.fillStyle = smogLayer;
      ctx.fillRect(0, pblY, width, groundY - pblY);

      // 2. Sunlight Rays reflecting/blocking on the smog lid
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 235, 150, 0.35)';
      ctx.lineWidth = 14;
      for (let rx = 30; rx < width; rx += 70) {
        ctx.beginPath();
        ctx.moveTo(rx + 40, 0);
        // Sunlight penetrates upper layer but scatters at pblY
        ctx.lineTo(rx - 20, pblY + 15);
        ctx.stroke();

        // Reflected scattered ray bounces back up
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 220, 120, 0.2)';
        ctx.lineWidth = 6;
        ctx.moveTo(rx - 20, pblY + 15);
        ctx.lineTo(rx - 80, 0);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Inversion Thermal Boundary Line (The "Lid")
      ctx.save();
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, pblY);
      ctx.lineTo(width, pblY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inversion Lid label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillText(`THERMAL INVERSION LID: ${pblHeight}m ALTITUDE (WARMER AIR CEILING)`, 14, pblY - 8);
      ctx.fillStyle = '#d97724';
      ctx.fillText(`COLD TRAPPED SMOG (NO VERTICAL MIXING)`, 14, pblY + 18);
      ctx.restore();

      // 4. Floating PM2.5 / Stubble Smoke Particulates (Trapped below pblY)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce horizontally
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Inversion boundary: particles cannot cross pblY!
        if (p.y < pblY + 4) {
          p.y = pblY + 4;
          p.vy = Math.abs(p.vy); // bounce downwards
        }
        if (p.y > groundY - 5) {
          p.y = groundY - 5;
          p.vy = -Math.abs(p.vy);
        }

        // Active mitigation effects on particles
        if (activeMitigation === 'smog-gun' || activeMitigation === 'rain') {
          p.vy += 0.08; // settling down due to water droplet cohesion
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(50, 30, 20, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Active Mitigation Visualizer Overlays
      if (activeMitigation === 'smog-gun') {
        // Water mist cannons spraying upwards from ground
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
        ctx.lineWidth = 2;
        for (let gx = 80; gx < width; gx += 160) {
          for (let m = 0; m < 6; m++) {
            ctx.beginPath();
            const sprayAngle = (Math.sin(t * 3 + m) * 0.4) - Math.PI / 2;
            const sprayDist = 60 + Math.sin(t * 4 + m) * 20;
            ctx.moveTo(gx, groundY);
            ctx.lineTo(gx + Math.cos(sprayAngle) * sprayDist, groundY + Math.sin(sprayAngle) * sprayDist);
            ctx.stroke();
          }
        }
        ctx.fillStyle = '#0f62fe';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('💧 ANTI-SMOG WATER CANNONS ACTIVE (DEPOSITION ACCELERATION)', width - 360, 24);
        ctx.restore();
      } else if (activeMitigation === 'thermal-cannon') {
        // Hot air updraft breaking the inversion lid
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 100, 50, 0.7)';
        ctx.lineWidth = 4;
        const centerX = width / 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 40, groundY);
        ctx.quadraticCurveTo(centerX, pblY - 30, centerX + 40, groundY);
        ctx.stroke();
        ctx.fillStyle = '#ff6b4a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('🔥 ARTIFICIAL THERMAL CONVECTION (INVERSION PUNCTURE)', width - 340, 24);
        ctx.restore();
      }

      // 6. Ground & Delhi Silhouette
      ctx.fillStyle = '#1c1f22';
      ctx.fillRect(0, groundY, width, height - groundY);

      // Draw stylized Delhi skyline silhouette (India Gate, towers, power plant chimneys)
      ctx.fillStyle = '#121517';
      // India gate shape around x=140
      ctx.fillRect(120, groundY - 35, 12, 35);
      ctx.fillRect(158, groundY - 35, 12, 35);
      ctx.fillRect(115, groundY - 42, 60, 8);
      ctx.fillRect(125, groundY - 47, 40, 5);

      // High rise buildings
      ctx.fillRect(240, groundY - 55, 30, 55);
      ctx.fillRect(280, groundY - 40, 25, 40);
      ctx.fillRect(320, groundY - 65, 35, 65);
      ctx.fillRect(400, groundY - 30, 45, 30);

      // Industrial chimney with smoke puff at x=520
      ctx.fillRect(520, groundY - 60, 16, 60);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(80, 60, 50, 0.7)';
      ctx.arc(528 + Math.sin(t * 2) * 6, groundY - 68, 8, 0, Math.PI * 2);
      ctx.fill();

      // Ground grass / road line
      ctx.fillStyle = '#3a3f44';
      ctx.fillRect(0, groundY, width, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pblHeight, stubbleFlux, activeMitigation]);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <canvas
        ref={canvasRef}
        width={780}
        height={340}
        style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: '#333' }}
      />
    </div>
  );
}
