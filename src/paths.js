import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const CONTENT_DIR = path.join(ROOT, 'content');
export const DS_DIR = path.join(ROOT, 'Intello Design System');
