import fs from 'fs';
import path from 'path';

const downloads = [
  // GFX: Posters
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'coming-soon.jpg',
    id: '1hkcvKPSMEDkJv8oJuJDIR-E5Mo2HXN_X',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'prizepool.jpg',
    id: '11x4lVgdLL2Ot-2dslGpv-3qHB-xVUtQ-',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'registrations-live.jpg',
    id: '1b1HDAm8GKC9a65QDC1_LPGrjw3CY1jlh',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'all-you-need-to-know-1.png',
    id: '1GNlq6JmQ6AAGAWnLg7O9VnptAaYNcQ3l',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'all-you-need-to-know-2.png',
    id: '1gtMWg9TRvv4vgMs9LsgJl8qBKgDfvyk5',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'all-you-need-to-know-3.png',
    id: '1IlcQyx44M4lKhb0BBhktT6_6fggu1j_m',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/posters',
    filename: 'all-you-need-to-know-4.png',
    id: '1losiaB7_-XFrkg7p2SVUpxHU8ssCH_Wn',
    type: 'image'
  },

  // GFX: Thumbnails
  {
    folder: 'public/media/infinix/gfx/thumbnails',
    filename: 'group-stage-group-a.png',
    id: '1wbpilL5RacCVNf6xHnvy9_060neFZhch',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/thumbnails',
    filename: 'group-stage-group-b.png',
    id: '1bd26F4OlfWbC6C9JIfOe2f52kt8_aqOU',
    type: 'image'
  },

  // GFX: Stories
  {
    folder: 'public/media/infinix/gfx/stories',
    filename: 'grand-finals-begins.png',
    id: '1ee6N1nNXzfqyg7U6ZVn_YNvPdfyMfJYs',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/stories',
    filename: 'semi-finals-begins.png',
    id: '1Sy4uIwcQUxEpmrjiCEXUmNY8oiJWlS4q',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/stories',
    filename: 'round-1-begins.png',
    id: '1_mmY_bcGHoCXjfJ0zHr-AN4xfrN-YBmO',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/stories',
    filename: 'round-2-begins.png',
    id: '1ZDZwWs4ZaZE5Wa859C39lSSaKFlRhNDE',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/stories',
    filename: 'registration-ends-today.png',
    id: '1_FjgC0goy1w2VDSD82qVqSQxO290D48S',
    type: 'image'
  },

  // GFX: Broadcast HUD / Stream Pack
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'points-table.png',
    id: '1jgwbGQ67H0TQSOifON3zgCnY0vyyfQtW',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'stream-prizepool.png',
    id: '1srFfusLDzXzg8TUfrr0PTB0C8tVN2dc9',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'reel-overlay.png',
    id: '1Ul9UOEjX40NpcnSWpHUdgNDZMAFkVnKw',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'l-band-1.png',
    id: '1C7r-dZ17K3Uu_6vW50bDkIocJ8fzgzEf',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'l-band-2.png',
    id: '1TUJ3fxUdzkPFNo4VXLfrdZWhP4eKYYg1',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'l-band-1-no-char.png',
    id: '12q37l3plOj3aK93bu-QPRZEOdePSj0Pn',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'l-band-2-no-char.png',
    id: '1hAAz-bmg7YlkB9a0X_xR0B_0wV3yl2BC',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'ticker-1.png',
    id: '1ZlqfxNQOvsd3PZW4vwqoY6LrvwQC1dTo',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'ticker-2.png',
    id: '10OK4NbkOz8MiyIYjVmfBx_oaFXkbS5Do',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'ticker-3.png',
    id: '1qqt7PKcQo75bmoDN5ansiQexScdB5SA2',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'ticker-register-now.png',
    id: '1q48o8PkP7m6JfGayvpiVE75JZ4_awqIo',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: '144hz-badge.png',
    id: '11Xk4UDRC_0DLUZ1pfhNJPiGItK3Vg1RS',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'mediatek-badge.png',
    id: '12znOXugyqewqpEJ7hP5TxiotXHPTL0vd',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'hot-badge.png',
    id: '1D-v-qgjUpy_ws44s49BXvUZvATgCwo0-',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'hot-70-pro-logo.png',
    id: '15jY2X_62uHKq0Z6rlqqV_MP07vAxIUiK',
    type: 'image'
  },
  {
    folder: 'public/media/infinix/gfx/broadcast',
    filename: 'infinix-play-logo.png',
    id: '1hn8ZqouMTfW_F4Lnhfn1nxlsh-R8D14T',
    type: 'image'
  },

  // VFX: Videos
  {
    folder: 'public/media/infinix/vfx',
    filename: 'infinix-teaser-trailer.mp4',
    id: '13cD6szLX2VhGiEkP2PqmmYwfHrQx9y5p',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'caster-desk-motion.mp4',
    id: '1nc5j6pdmes9I5Aam4C7O6i4YcQLDe9kA',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'l-band-animated.mp4',
    id: '1jyxaW_djGJ1Vlah-Ayu1AnYECp-kOjkG',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'broadcast-motion-comp24.mp4',
    id: '1b4nVk2BJ1eby0JnxdXJiiElEvIfqShkJ',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'broadcast-motion-comp25.mp4',
    id: '1ZU6hEm8XMbVABxtxCt20AF3HV1EslxeH',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'broadcast-motion-comp26.mp4',
    id: '12q8GZhfiISBBS65dF8fjsKiizkJ-CGZR',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'broadcast-motion-comp28.mp4',
    id: '1MLDein_PJrEzjsRHCsPIY4Jl90kBBwIX',
    type: 'video'
  },
  {
    folder: 'public/media/infinix/vfx',
    filename: 'broadcast-motion-comp31.mp4',
    id: '1y4sJynClFxmm3-CEBeDbwBtDEX3OVjTw',
    type: 'video'
  }
];

async function downloadFile(item) {
  const targetDir = path.resolve(item.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const filePath = path.join(targetDir, item.filename);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.size > 1000) {
      console.log(`[ALREADY EXISTS] ${item.filename} (${stat.size} bytes)`);
      return;
    }
  }

  console.log(`[DOWNLOADING] ${item.filename} (ID: ${item.id})...`);
  let url;
  if (item.type === 'image') {
    url = `https://lh3.googleusercontent.com/d/${item.id}`;
  } else {
    url = `https://drive.usercontent.google.com/download?id=${item.id}&export=download&authuser=0`;
  }

  let res = await fetch(url);
  if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
    // fallback to alternate download url
    url = `https://drive.usercontent.google.com/download?id=${item.id}&export=download&authuser=0`;
    res = await fetch(url);
  }

  if (res.ok) {
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`[SAVED] ${item.filename} (${buffer.length} bytes)`);
  } else {
    console.error(`[FAILED] ${item.filename}: status ${res.status}`);
  }
}

async function run() {
  console.log(`Starting download of ${downloads.length} Infinix assets...`);
  for (const item of downloads) {
    try {
      await downloadFile(item);
    } catch (err) {
      console.error(`Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('Finished downloading all assets!');
}

run();
