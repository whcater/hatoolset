const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 确保public目录存在
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sizes = [16, 32, 48, 128, 192, 512];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 绘制深色现代渐变背景
  const bgGradient = ctx.createLinearGradient(0, 0, size, size);
  bgGradient.addColorStop(0, '#1e293b');
  bgGradient.addColorStop(0.3, '#334155');
  bgGradient.addColorStop(0.7, '#475569');
  bgGradient.addColorStop(1, '#64748b');

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, size, size);

  // 绘制圆角
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.18);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // 绘制主要的六边形容器 - 代表工具集合的结构化
  const centerX = size * 0.5;
  const centerY = size * 0.5;
  const hexRadius = size * 0.32;

  // 六边形主体
  const hexGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, hexRadius);
  hexGradient.addColorStop(0, '#06b6d4');
  hexGradient.addColorStop(0.6, '#0891b2');
  hexGradient.addColorStop(1, '#0e7490');

  ctx.fillStyle = hexGradient;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = centerX + Math.cos(angle) * hexRadius;
    const y = centerY + Math.sin(angle) * hexRadius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // 六边形高光
  const highlightGradient = ctx.createLinearGradient(centerX - hexRadius * 0.5, centerY - hexRadius * 0.5, centerX, centerY);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.fillStyle = highlightGradient;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = centerX + Math.cos(angle) * hexRadius;
    const y = centerY + Math.sin(angle) * hexRadius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // 绘制中心连接节点 - 象征工具协同
  const nodeRadius = size * 0.08;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, nodeRadius, 0, Math.PI * 2);
  ctx.fill();

  // 绘制周围的小节点 - 代表不同工具
  const smallNodeRadius = size * 0.04;
  const nodeDistance = size * 0.18;
  
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const nodeX = centerX + Math.cos(angle) * nodeDistance;
    const nodeY = centerY + Math.sin(angle) * nodeDistance;
    
    // 节点渐变
    const nodeGradient = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, smallNodeRadius);
    nodeGradient.addColorStop(0, '#f0f9ff');
    nodeGradient.addColorStop(1, '#e0f2fe');
    
    ctx.fillStyle = nodeGradient;
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, smallNodeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 连接线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = Math.max(1, size / 80);
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * nodeRadius, centerY + Math.sin(angle) * nodeRadius);
    ctx.lineTo(nodeX - Math.cos(angle) * smallNodeRadius, nodeY - Math.sin(angle) * smallNodeRadius);
    ctx.stroke();
  }

  // 添加现代几何装饰元素
  const cornerSize = size * 0.12;
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = Math.max(1, size / 64);
  
  // 左上角
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.08);
  ctx.lineTo(size * 0.15, size * 0.15);
  ctx.lineTo(size * 0.08, size * 0.15);
  ctx.stroke();
  
  // 右下角
  ctx.beginPath();
  ctx.moveTo(size * 0.85, size * 0.92);
  ctx.lineTo(size * 0.85, size * 0.85);
  ctx.lineTo(size * 0.92, size * 0.85);
  ctx.stroke();

  return canvas;
}

// 生成所有尺寸的图标
sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  
  let filename;
  if (size === 16) {
    filename = 'favicon-16x16.png';
  } else if (size === 32) {
    filename = 'favicon-32x32.png';
  } else if (size === 192) {
    filename = 'android-chrome-192x192.png';
  } else if (size === 512) {
    filename = 'android-chrome-512x512.png';
  } else {
    filename = `icon-${size}x${size}.png`;
  }
  
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Generated ${filename}`);
});

// 生成favicon.ico (使用32x32)
const canvas32 = generateIcon(32);
const buffer32 = canvas32.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer32);
console.log('Generated favicon.ico');

console.log('All icons generated successfully!');