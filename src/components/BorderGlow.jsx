import { useRef, useCallback, useEffect } from 'react';
import './BorderGlow.css';
function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}
function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = h + 'deg ' + s + '% ' + l + '%';
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars['--glow-color' + keys[i]] = 'hsl(' + base + ' / ' + Math.min(opacities[i] * intensity, 100) + '%)';
  }
  return vars;
}
function buildGradientVars(colors) {
  const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  const keys = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
  const colorIdx = [0, 1, 2, 0, 1, 2, 1];
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(colorIdx[i], colors.length - 1)];
    vars[keys[i]] = 'radial-gradient(at ' + positions[i] + ', ' + c + ' 0px, transparent 50%)';
  }
  vars['--gradient-base'] = 'linear-gradient(' + colors[0] + ' 0 100%)';
  return vars;
}
const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 16,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const getCenter = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);
  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx, dy = y - cy;
    return Math.min(Math.max(1 / Math.min(
      dx !== 0 ? cx / Math.abs(dx) : Infinity,
      dy !== 0 ? cy / Math.abs(dy) : Infinity
    ), 0), 1);
  }, [getCenter]);
  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx, dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    return degrees < 0 ? degrees + 360 : degrees;
  }, [getCenter]);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--cursor-angle', getCursorAngle(el, x, y) + 'deg');
      el.style.setProperty('--edge-proximity', getEdgeProximity(el, x, y) * 100);
    };
    const onLeave = () => el.style.setProperty('--edge-proximity', '0');
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    if (animated) {
      el.style.setProperty('--edge-proximity', '100');
      let start = 100;
      const step = () => {
        start -= 100 / 60 * 1.5;
        if (start <= 0) { el.style.setProperty('--edge-proximity', '0'); return; }
        el.style.setProperty('--edge-proximity', start);
        requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 300);
    }
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [getCursorAngle, getEdgeProximity, animated]);
  const styleVars = {
    ...buildGlowVars(glowColor, glowIntensity),
    ...buildGradientVars(colors),
    '--edge-sensitivity': edgeSensitivity,
    '--bg-color': backgroundColor,
    '--card-radius': borderRadius + 'px',
    '--glow-padding': glowRadius + 'px',
    '--cone-spread': coneSpread,
    '--fill-opacity': fillOpacity,
  };
  return (
    React.createElement('div', { ref: cardRef, className: 'border-glow-card ' + className, style: styleVars },
      React.createElement('div', { className: 'edge-light' }),
      React.createElement('div', { className: 'border-glow-inner' }, children)
    )
  );
};
export default BorderGlow;