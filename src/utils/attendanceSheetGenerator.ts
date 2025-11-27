import { Program } from '../types';

type AttendeeEntry = { name: string; remark?: string };

// Configuration constants
const SHEET_CONFIG = {
  PAGE: {
    WIDTH: 990,
    HEIGHT: 1400,
  },
  MARGIN: {
    OUTER: 24,
    SIDE: 60,
  },
  COLORS: {
    BACKGROUND: '#ffffff',
    PRIMARY: '#1e40af',
    SECONDARY: '#059669',
    TEXT_DARK: '#111827',
    TEXT_MEDIUM: '#374151',
    TEXT_LIGHT: '#6b7280',
    BORDER_LIGHT: '#e5e7eb',
    ROW_ALT: '#f9fafb',
  },
  FONTS: {
    HEADER_MAIN: 'bold 31px serif',
    HEADER_SUB: 'bold 22px sans-serif',
    TITLE: 'bold 26px serif',
    META: '16px serif',
    TABLE_HEADER: 'bold 16px sans-serif',
    TABLE_BODY: '15px serif',
    FOOTER: '14px serif',
  },
  LOGO: {
    COLLEGE_DIAMETER: 180,
    NSS_DIAMETER: 144,
  },
  TABLE: {
    COL_NUM_WIDTH: 50,
    COL_REMARK_WIDTH: 200,
    ROW_HEIGHT: 40,
  },
};

const INSTITUTION = {
  NAME: 'MAMO COLLEGE, MANASSERY',
  SUBTITLE: 'National Service Scheme',
  FOOTER: 'NSS MAMO COLLEGE',
};

const LOGO_SOURCES = {
  NSS: ['/download.png', '/nss-logo.png'],
  COLLEGE: ['/mamo-logo.png', '/mamo%20logo.png', '/college-logo.png'],
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const tryLoadImage = async (sources: string[]): Promise<HTMLImageElement | null> => {
  for (const src of sources) {
    try {
      return await loadImage(src);
    } catch (error) {
      console.warn(`Failed to load image from ${src}`, error);
    }
  }
  return null;
};

const drawCircularLogo = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  diameter: number
): void => {
  if (!img) return;
  const radius = diameter / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x - radius, y - radius, diameter, diameter);
  ctx.restore();
};

const drawPage = async (
  ctx: CanvasRenderingContext2D,
  params: { departmentName: string; program: Program; attendees: AttendeeEntry[] },
  startIndex: number,
  count: number
) => {
  const { departmentName, program, attendees } = params;
  const { PAGE, MARGIN, COLORS, FONTS, LOGO, TABLE } = SHEET_CONFIG;

  // Background
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, PAGE.WIDTH, PAGE.HEIGHT);

  // Simple border
  ctx.strokeStyle = COLORS.PRIMARY;
  ctx.lineWidth = 3;
  ctx.strokeRect(MARGIN.OUTER, MARGIN.OUTER, PAGE.WIDTH - 2 * MARGIN.OUTER, PAGE.HEIGHT - 2 * MARGIN.OUTER);

  // Load logos
  const [collegeImg, nssImg] = await Promise.all([
    tryLoadImage(LOGO_SOURCES.COLLEGE),
    tryLoadImage(LOGO_SOURCES.NSS),
  ]);

  const centerX = PAGE.WIDTH / 2;
  let currentY = 70;

  // Header section with logos at the edges - different sizes
  const logoY = currentY;
  const minMargin = 50; // Minimum distance from border
  
  // College logo (left) - larger
  const leftLogoX = MARGIN.OUTER + minMargin + LOGO.COLLEGE_DIAMETER / 2;
  
  // NSS logo (right) - smaller
  const rightLogoX = PAGE.WIDTH - MARGIN.OUTER - minMargin - LOGO.NSS_DIAMETER / 2;
  
  drawCircularLogo(ctx, collegeImg, leftLogoX, logoY + 60, LOGO.COLLEGE_DIAMETER);
  drawCircularLogo(ctx, nssImg, rightLogoX, logoY + 60, LOGO.NSS_DIAMETER);

  // Institution name (centered)
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.PRIMARY;
  ctx.font = FONTS.HEADER_MAIN;
  ctx.fillText(INSTITUTION.NAME, centerX, logoY + 45);

  ctx.fillStyle = COLORS.SECONDARY;
  ctx.font = FONTS.HEADER_SUB;
  ctx.fillText(INSTITUTION.SUBTITLE, centerX, logoY + 68);

  currentY = logoY + 120 + 30;

  // Title with underline (matching the image)
  ctx.fillStyle = COLORS.TEXT_DARK;
  ctx.font = FONTS.TITLE;
  ctx.fillText('ATTENDANCE SHEET', centerX, currentY);

  // Underline for title
  ctx.strokeStyle = COLORS.SECONDARY;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 200, currentY + 8);
  ctx.lineTo(centerX + 200, currentY + 8);
  ctx.stroke();

  currentY += 40;

  // Program details in a clean box
  const boxY = currentY;
  const boxHeight = 120;
  ctx.fillStyle = COLORS.ROW_ALT;
  ctx.fillRect(MARGIN.SIDE, boxY, PAGE.WIDTH - 2 * MARGIN.SIDE, boxHeight);
  ctx.strokeStyle = COLORS.BORDER_LIGHT;
  ctx.lineWidth = 1;
  ctx.strokeRect(MARGIN.SIDE, boxY, PAGE.WIDTH - 2 * MARGIN.SIDE, boxHeight);

  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.TEXT_DARK;
  ctx.font = FONTS.META;

  const detailsX = MARGIN.SIDE + 20;
  ctx.fillText(`Department: ${departmentName}`, detailsX, boxY + 30);
  ctx.fillText(`Program: ${program.title}`, detailsX, boxY + 55);

  const programDate = new Date(program.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.fillText(`Date: ${programDate}  |  Time: ${program.time}`, detailsX, boxY + 80);
  ctx.fillText(`Venue: ${program.venue}`, detailsX, boxY + 105);

  currentY = boxY + boxHeight + 35;

  // Table header with background
  const tableStartY = currentY;
  const tableX = MARGIN.SIDE;
  const tableWidth = PAGE.WIDTH - 2 * MARGIN.SIDE;
  const colNumW = TABLE.COL_NUM_WIDTH;
  const colRemarkW = TABLE.COL_REMARK_WIDTH;
  const colNameW = tableWidth - colNumW - colRemarkW;

  ctx.fillStyle = COLORS.PRIMARY;
  ctx.fillRect(tableX, tableStartY, tableWidth, 35);

  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.font = FONTS.TABLE_HEADER;
  ctx.textAlign = 'center';
  ctx.fillText('No.', tableX + colNumW / 2, tableStartY + 22);
  ctx.textAlign = 'left';
  ctx.fillText('Student Name', tableX + colNumW + 15, tableStartY + 22);
  ctx.fillText('Remark', tableX + colNumW + colNameW + 15, tableStartY + 22);

  currentY = tableStartY + 35;

  // Table rows with alternating colors
  ctx.font = FONTS.TABLE_BODY;

  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const attendee = attendees[idx];
    const rowY = currentY + TABLE.ROW_HEIGHT * i;

    // Alternating row background
    if (i % 2 === 0) {
      ctx.fillStyle = COLORS.ROW_ALT;
      ctx.fillRect(tableX, rowY, tableWidth, TABLE.ROW_HEIGHT);
    }

    // Row border
    ctx.strokeStyle = COLORS.BORDER_LIGHT;
    ctx.lineWidth = 1;
    ctx.strokeRect(tableX, rowY, tableWidth, TABLE.ROW_HEIGHT);

    const textY = rowY + 25;

    // Serial number
    ctx.fillStyle = COLORS.TEXT_DARK;
    ctx.textAlign = 'center';
    ctx.fillText(String(idx + 1), tableX + colNumW / 2, textY);

    // Student name
    ctx.textAlign = 'left';
    ctx.fillText(attendee.name, tableX + colNumW + 15, textY);

    // Remark
    if (attendee.remark) {
      ctx.fillStyle = COLORS.TEXT_MEDIUM;
      ctx.fillText(attendee.remark, tableX + colNumW + colNameW + 15, textY);
    }
  }

  // Watermark
  ctx.save();
  ctx.translate(centerX, PAGE.HEIGHT / 2);
  ctx.rotate(-Math.PI / 6);
  ctx.fillStyle = 'rgba(30, 64, 175, 0.03)';
  ctx.font = 'bold 72px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const watermarkText = 'MUHAMMED ABDURAHIMAN MEMORIAL ORPHANAGE COLLEGE';
  ctx.fillText(watermarkText, 0, -150);
  ctx.fillText(watermarkText, 0, 0);
  ctx.fillText(watermarkText, 0, 150);
  ctx.restore();

  // Signature area
  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.TEXT_MEDIUM;
  ctx.font = FONTS.FOOTER;
  const signY = PAGE.HEIGHT - 100;
  ctx.fillText('NSS Program Officer', PAGE.WIDTH - MARGIN.SIDE, signY);
  ctx.strokeStyle = COLORS.TEXT_LIGHT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAGE.WIDTH - 220, signY + 10);
  ctx.lineTo(PAGE.WIDTH - MARGIN.SIDE, signY + 10);
  ctx.stroke();

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.TEXT_LIGHT;
  ctx.fillText(INSTITUTION.FOOTER, centerX, PAGE.HEIGHT - 40);
};

export const generateAttendanceSheetDataUrl = async (
  params: {
    departmentName: string;
    program: Program;
    attendees: AttendeeEntry[];
  }
): Promise<string | string[]> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { PAGE, TABLE } = SHEET_CONFIG;

  canvas.width = PAGE.WIDTH;
  canvas.height = PAGE.HEIGHT;

  // Calculate rows per page
  const headerSpace = 380;
  const footerSpace = 150;
  const availableHeight = PAGE.HEIGHT - headerSpace - footerSpace;
  const rowsPerPage = Math.max(10, Math.floor(availableHeight / TABLE.ROW_HEIGHT));

  // Single page
  if (params.attendees.length <= rowsPerPage) {
    await drawPage(ctx, params, 0, params.attendees.length);
    return canvas.toDataURL('image/png');
  }

  // Multiple pages
  const pages: string[] = [];
  for (let start = 0; start < params.attendees.length; start += rowsPerPage) {
    const count = Math.min(rowsPerPage, params.attendees.length - start);
    await drawPage(ctx, params, start, count);
    pages.push(canvas.toDataURL('image/png'));
  }
  return pages;
};

export const downloadAttendanceSheet = async (params: {
  departmentName: string;
  program: Program;
  attendees: AttendeeEntry[];
}) => {
  const result = await generateAttendanceSheetDataUrl(params);
  const sanitizeFilename = (str: string) => str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
  const baseName = `${sanitizeFilename(params.departmentName)}_${sanitizeFilename(params.program.title)}_Attendance`;

  if (typeof result === 'string') {
    const link = document.createElement('a');
    link.download = `${baseName}.png`;
    link.href = result;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    result.forEach((url, i) => {
      const link = document.createElement('a');
      link.download = `${baseName}_page_${i + 1}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};

export type { AttendeeEntry };