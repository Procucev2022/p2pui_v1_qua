const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const toCrc = Buffer.alloc(4 + len);
  toCrc.write(type, 0, 4, 'ascii');
  data.copy(toCrc, 4);
  const crcVal = crc32(toCrc);
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

const width = 256;
const height = 256;
const raw = Buffer.alloc(height * (1 + width * 4));

function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = y * (1 + width * 4) + 1 + x * 4;
  const srcA = a / 255;
  const dstA = raw[idx + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA > 0) {
    raw[idx] = Math.round((r * srcA + raw[idx] * dstA * (1 - srcA)) / outA);
    raw[idx + 1] = Math.round((g * srcA + raw[idx + 1] * dstA * (1 - srcA)) / outA);
    raw[idx + 2] = Math.round((b * srcA + raw[idx + 2] * dstA * (1 - srcA)) / outA);
    raw[idx + 3] = Math.round(outA * 255);
  }
}

const color = [234, 67, 53]; // #EA4335 Google Red / Email Red

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

function distToRoundedRect(px, py, rx, ry, rw, rh, rad) {
  const cx = Math.max(rx + rad, Math.min(px, rx + rw - rad));
  const cy = Math.max(ry + rad, Math.min(py, ry + rh - rad));
  const d = Math.hypot(px - cx, py - cy);
  if (px >= rx + rad && px <= rx + rw - rad) {
    return Math.min(Math.abs(py - ry), Math.abs(py - (ry + rh)));
  }
  if (py >= ry + rad && py <= ry + rh - rad) {
    return Math.min(Math.abs(px - rx), Math.abs(px - (rx + rw)));
  }
  return Math.abs(d - rad);
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const distToCircle = Math.abs(Math.hypot(x - 128, y - 128) - 114);
    let alpha1 = 0;
    if (distToCircle <= 8) alpha1 = 1;
    else if (distToCircle <= 9.5) alpha1 = 1 - (distToCircle - 8) / 1.5;

    const distToRect = distToRoundedRect(x, y, 56, 80, 144, 96, 14);
    let alpha2 = 0;
    if (x >= 50 && x <= 206 && y >= 74 && y <= 182) {
      if (distToRect <= 7) alpha2 = 1;
      else if (distToRect <= 8.5) alpha2 = 1 - (distToRect - 7) / 1.5;
    }

    const distFlap1 = distToSegment(x, y, 62, 88, 128, 138);
    const distFlap2 = distToSegment(x, y, 128, 138, 194, 88);
    const minFlap = Math.min(distFlap1, distFlap2);
    let alpha3 = 0;
    if (minFlap <= 7) alpha3 = 1;
    else if (minFlap <= 8.5) alpha3 = 1 - (minFlap - 7) / 1.5;

    const distFold1 = distToSegment(x, y, 64, 168, 106, 128);
    const distFold2 = distToSegment(x, y, 192, 168, 150, 128);
    const minFold = Math.min(distFold1, distFold2);
    let alpha4 = 0;
    if (minFold <= 6) alpha4 = 1;
    else if (minFold <= 7.5) alpha4 = 1 - (minFold - 6) / 1.5;

    const maxAlpha = Math.max(alpha1, alpha2, alpha3, alpha4);
    if (maxAlpha > 0) {
      setPixel(x, y, color[0], color[1], color[2], Math.round(maxAlpha * 255));
    }
  }
}

const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;
const ihdrChunk = makeChunk('IHDR', ihdr);

const compressed = zlib.deflateSync(raw, { level: 9 });
const idatChunk = makeChunk('IDAT', compressed);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const png = Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
const dest = path.join(__dirname, '../src/assets/images/new/email.png');
fs.writeFileSync(dest, png);
console.log('Successfully wrote', dest, png.length, 'bytes');
