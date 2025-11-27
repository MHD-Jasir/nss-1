import { Certificate } from '../types';

// Configuration constants
const CANVAS_CONFIG = {
  WIDTH: 1200,
  HEIGHT: 850,
  MARGIN: {
    OUTER: 30,
    INNER: 60,
    CONTENT: 80,
  },
  COLORS: {
    BACKGROUND: '#ffffff',
    PRIMARY: '#1e40af',
    SECONDARY: '#059669',
    TEXT_DARK: '#374151',
    TEXT_LIGHT: '#6b7280',
    TEXT_LIGHTER: '#9ca3af',
    HEADER_BG: '#f8fafc',
  },
  FONTS: {
    HEADER_MAIN: 'bold 24px serif',
    HEADER_SUB: 'bold 18px sans-serif',
    TITLE: 'bold 44px serif',
    NAME: 'bold 34px serif',
    PROGRAM: 'bold 26px serif',
    BODY: '22px serif',
    BODY_MEDIUM: '20px serif',
    DETAILS: '18px serif',
    SIGNATURE: '16px serif',
    SEAL: 'bold 12px sans-serif',
  },
  LOGO: {
    COLLEGE_DIAMETER: 160,
    NSS_DIAMETER: 110,
    MIN_GAP: 16,
  },
  HEADER: {
    Y: 100,
    HEIGHT: 160,
  },
  BORDERS: {
    OUTER_WIDTH: 12,
    INNER_WIDTH: 4,
    DECORATIVE_WIDTH: 3,
  },
};

interface InstitutionConfig {
  name: string;
  subtitle: string;
  programOfficerName: string;
  collegeLogo?: string;
  nssLogo?: string;
}

const DEFAULT_INSTITUTION: InstitutionConfig = {
  name: 'MUHAMMED ABDURAHIMAN MEMORIAL ORPHANAGE COLLEGE',
  subtitle: 'National Service Scheme (NSS)',
  programOfficerName: 'Amrutha P',
  nssLogo: '/download.png',
  collegeLogo: '/mamo-logo.png',
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

const tryLoadImages = async (logoPath?: string, fallbackPaths: string[] = []): Promise<HTMLImageElement | null> => {
  const paths = logoPath ? [logoPath, ...fallbackPaths] : fallbackPaths;
  
  for (const path of paths) {
    try {
      return await loadImage(path);
    } catch {
      continue;
    }
  }
  return null;
};

const drawCircularImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  diameter: number
): void => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, diameter / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x - diameter / 2, y - diameter / 2, diameter, diameter);
  ctx.restore();
};

const drawSeal = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  line1: string,
  line2: string
): void => {
  const radius = 40;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.fillStyle = color;
  ctx.font = CANVAS_CONFIG.FONTS.SEAL;
  ctx.textAlign = 'center';
  ctx.fillText(line1, x, y - 5);
  ctx.fillText(line2, x, y + 10);
};

export const generateCertificateData = async (
  certificate: Certificate,
  institutionConfig: InstitutionConfig = DEFAULT_INSTITUTION
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  const { WIDTH, HEIGHT, MARGIN, COLORS, FONTS, LOGO, HEADER, BORDERS } = CANVAS_CONFIG;

  // Set canvas dimensions
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Background
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Outer border
  ctx.strokeStyle = COLORS.PRIMARY;
  ctx.lineWidth = BORDERS.OUTER_WIDTH;
  ctx.strokeRect(MARGIN.OUTER, MARGIN.OUTER, WIDTH - 2 * MARGIN.OUTER, HEIGHT - 2 * MARGIN.OUTER);

  // Inner border
  ctx.strokeStyle = COLORS.SECONDARY;
  ctx.lineWidth = BORDERS.INNER_WIDTH;
  ctx.strokeRect(MARGIN.INNER, MARGIN.INNER, WIDTH - 2 * MARGIN.INNER, HEIGHT - 2 * MARGIN.INNER);

  // Header background
  ctx.fillStyle = COLORS.HEADER_BG;
  ctx.fillRect(MARGIN.CONTENT, HEADER.Y, WIDTH - 2 * MARGIN.CONTENT, HEADER.HEIGHT);

  // Load logos
  const [collegeImg, nssImg] = await Promise.all([
    tryLoadImages(institutionConfig.collegeLogo, ['/mamo%20logo.png', '/college-logo.png']),
    tryLoadImages(institutionConfig.nssLogo, ['/download.png', '/nss-logo.png']),
  ]);

  // Calculate logo positions
  const centerX = WIDTH / 2;
  const headerCenterY = HEADER.Y + HEADER.HEIGHT / 2;

  ctx.font = FONTS.HEADER_MAIN;
  const textWidth = ctx.measureText(institutionConfig.name).width;
  const textLeft = centerX - textWidth / 2;
  const textRight = centerX + textWidth / 2;

  const leftLogoX = MARGIN.INNER + LOGO.COLLEGE_DIAMETER / 2 + 20;
  const leftLogoRight = leftLogoX + LOGO.COLLEGE_DIAMETER / 2;
  const logoTextGap = Math.max(textLeft - leftLogoRight, LOGO.MIN_GAP);

  const rightLogoX = textRight + logoTextGap + LOGO.NSS_DIAMETER / 2;

  // Draw logos
  if (collegeImg) {
    drawCircularImage(ctx, collegeImg, leftLogoX, headerCenterY, LOGO.COLLEGE_DIAMETER);
  }
  if (nssImg) {
    drawCircularImage(ctx, nssImg, rightLogoX, headerCenterY, LOGO.NSS_DIAMETER);
  }

  // Header text
  ctx.fillStyle = COLORS.PRIMARY;
  ctx.textAlign = 'center';
  ctx.font = FONTS.HEADER_MAIN;
  ctx.fillText(institutionConfig.name, centerX, headerCenterY - 8);

  ctx.fillStyle = COLORS.SECONDARY;
  ctx.font = FONTS.HEADER_SUB;
  ctx.fillText(institutionConfig.subtitle, centerX, headerCenterY + 18);

  // Certificate title
  const titleY = HEADER.Y + HEADER.HEIGHT + 30;
  ctx.fillStyle = COLORS.PRIMARY;
  ctx.font = FONTS.TITLE;
  ctx.fillText('CERTIFICATE OF PARTICIPATION', centerX, titleY);

  // Decorative line
  ctx.strokeStyle = COLORS.SECONDARY;
  ctx.lineWidth = BORDERS.DECORATIVE_WIDTH;
  ctx.beginPath();
  ctx.moveTo(300, titleY + 20);
  ctx.lineTo(WIDTH - 300, titleY + 20);
  ctx.stroke();

  // Certificate content
  const contentY = titleY + 60;
  
  ctx.fillStyle = COLORS.TEXT_DARK;
  ctx.font = FONTS.BODY;
  ctx.fillText('This is to certify that', centerX, contentY);

  ctx.fillStyle = COLORS.PRIMARY;
  ctx.font = FONTS.NAME;
  ctx.fillText(certificate.studentName, centerX, contentY + 50);

  ctx.fillStyle = COLORS.SECONDARY;
  ctx.font = FONTS.DETAILS;
  ctx.fillText(`Department of ${certificate.studentDepartment}`, centerX, contentY + 80);

  ctx.fillStyle = COLORS.TEXT_DARK;
  ctx.font = FONTS.BODY_MEDIUM;
  ctx.fillText('has successfully participated in', centerX, contentY + 120);

  ctx.fillStyle = COLORS.SECONDARY;
  ctx.font = FONTS.PROGRAM;
  ctx.fillText(certificate.programTitle, centerX, contentY + 165);

  ctx.fillStyle = COLORS.TEXT_DARK;
  ctx.font = FONTS.DETAILS;
  const programDate = new Date(certificate.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.fillText(`held on ${programDate} at ${certificate.time}`, centerX, contentY + 200);
  ctx.fillText(`Venue: ${certificate.venue}`, centerX, contentY + 230);

  // Signatures
  ctx.fillStyle = COLORS.TEXT_LIGHT;
  ctx.font = FONTS.SIGNATURE;
  ctx.textAlign = 'left';

  const signatureY = HEIGHT - 170;
  const signatureLineY = HEIGHT - 120;

  // Left signature - Dr. Riyas K
  ctx.fillText('Amrutha P', 180, signatureY);
  ctx.fillText('NSS Program Officer', 180, signatureY + 30);
  ctx.beginPath();
  ctx.moveTo(160, signatureLineY);
  ctx.lineTo(340, signatureLineY);
  ctx.strokeStyle = COLORS.TEXT_LIGHTER;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Right signature - Amrutha P
  ctx.fillText('Dr. Riyas K', WIDTH - 360, signatureY);
  ctx.fillText('NSS Program Officer', WIDTH - 360, signatureY + 30);
  ctx.beginPath();
  ctx.moveTo(WIDTH - 380, signatureLineY);
  ctx.lineTo(WIDTH - 200, signatureLineY);
  ctx.stroke();

  // Seals
  drawSeal(ctx, 250, HEIGHT - 200, COLORS.PRIMARY, 'OFFICIAL', 'SEAL');
  drawSeal(ctx, WIDTH - 250, HEIGHT - 200, COLORS.SECONDARY, 'COLLEGE', 'SEAL');

  // Diagonal Watermark
  ctx.save();
  ctx.translate(centerX, HEIGHT / 2);
  ctx.rotate(-Math.PI / 6); // -30 degrees
  ctx.fillStyle = 'rgba(30, 64, 175, 0.03)'; // Very subtle blue
  ctx.font = 'bold 72px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw multiple overlapping watermarks for better coverage
  const watermarkText = institutionConfig.name;
  ctx.fillText(watermarkText, 0, -150);
  ctx.fillText(watermarkText, 0, 0);
  ctx.fillText(watermarkText, 0, 150);
  
  ctx.restore();

  // Date of issue
  ctx.fillStyle = COLORS.TEXT_LIGHT;
  ctx.font = FONTS.SIGNATURE;
  ctx.textAlign = 'center';
  const issueDate = new Date().toLocaleDateString('en-IN');
  ctx.fillText(`Date of Issue: ${issueDate}`, centerX, HEIGHT - 50);

  return canvas.toDataURL('image/png');
};

export const downloadCertificate = async (
  certificate: Certificate,
  institutionConfig?: InstitutionConfig
): Promise<void> => {
  try {
    const dataUrl = await generateCertificateData(certificate, institutionConfig);
    const link = document.createElement('a');
    const filename = `${certificate.studentName}_${certificate.programTitle}_Certificate.png`
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');
    
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download certificate:', error);
    throw new Error('Certificate download failed');
  }
};
