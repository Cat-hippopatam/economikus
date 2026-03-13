#!/usr/bin/env node
/**
 * 📦 Economikus Project Structure Scanner
 * Генерирует дерево файлов проекта для отправки в контекст ИИ
 * 
 * Запуск:
 *   npx tsx scan-project.ts
 *   или
 *   node --loader ts-node/esm scan-project.ts
 */

import fs from 'fs';
import path from 'path';

// === НАСТРОЙКИ СКАНИРОВАНИЯ ===
const CONFIG = {
  // Папки для исключения (всегда)
  excludeDirs: [
    'node_modules', '.git', '.next', 'dist', 'build', 'coverage',
    '.vscode', '.idea', '.cache', '.turbo', 'public'
  ],
  
  // Расширения файлов для исключения
  excludeExtensions: ['.log', '.cache', '.tmp', '.lock'],
  
  // Файлы для включения несмотря на правила (важные конфиги)
  alwaysInclude: [
    'package.json', 'tsconfig.json', 'vite.config.ts', 
    '.env.example', 'README.md', 'prisma/schema.prisma'
  ],
  
  // Максимальная глубина сканирования
  maxDepth: 4,
  
  // Показывать скрытые файлы (начинающиеся с .)
  showHidden: false,
  
  // Выводить размер файлов в байтах
  showFileSize: false,
  
  // Формат вывода: 'tree' | 'json' | 'yaml'
  outputFormat: 'tree' as const,
  
  // Имя выходного файла
  outputFile: 'project-structure.txt'
};

// === ИКОНКИ ДЛЯ ВИЗУАЛИЗАЦИИ ===
const ICONS: Record<string, string> = {
  // Папки
  dir: '📁',
  
  // TypeScript/JavaScript
  '.ts': '🔷', '.tsx': '⚛️', '.js': '📜', '.jsx': '⚛️', '.mjs': '📦',
  
  // Конфигурация
  'package.json': '📦', 'tsconfig.json': '⚙️', 'vite.config.ts': '⚡',
  '.env': '🔐', '.gitignore': '🔒', 'eslint.config.js': '🔍',
  
  // Стили
  '.css': '🎨', '.scss': '🎨', '.sass': '🎨', '.less': '🎨',
  
  // Документация
  '.md': '📝', '.txt': '📄', '.json': '📋', '.yaml': '📋', '.yml': '📋',
  
  // Медиа
  '.png': '🖼️', '.jpg': '🖼️', '.svg': '🎨', '.webp': '🖼️',
  '.mp4': '🎬', '.mp3': '🎵', '.wav': '🎵',
  
  // База данных
  '.sql': '🗄️', '.prisma': '🗃️',
  
  // По умолчанию
  default: '📄'
};

// === УТИЛИТЫ ===

/**
 * Получить иконку для файла/папки
 */
function getIcon(name: string, isDir: boolean): string {
  if (isDir) return ICONS.dir;
  const ext = path.extname(name).toLowerCase();
  return ICONS[name] || ICONS[ext] || ICONS.default;
}

/**
 * Проверить, нужно ли исключить файл/папку
 */
function shouldExclude(name: string, isDir: boolean, fullPath: string): boolean {
  // Всегда включать важные файлы
  if (CONFIG.alwaysInclude.includes(name)) return false;
  
  // Исключить папки
  if (isDir && CONFIG.excludeDirs.includes(name)) return true;
  
  // Исключить расширения
  if (!isDir && CONFIG.excludeExtensions.includes(path.extname(name).toLowerCase())) {
    return true;
  }
  
  // Скрытые файлы
  if (!CONFIG.showHidden && name.startsWith('.') && !CONFIG.alwaysInclude.includes(name)) {
    return true;
  }
  
  return false;
}

/**
 * Рекурсивная генерация дерева
 */
function buildTree(
  dirPath: string,
  level: number = 0,
  prefix: string = ''
): string {
  if (level > CONFIG.maxDepth) return '';
  
  let output = '';
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // Сортировка: папки первыми, затем по алфавиту
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
    
    entries.forEach((entry, index) => {
      if (shouldExclude(entry.name, entry.isDirectory(), path.join(dirPath, entry.name))) {
        return;
      }
      
      const isLast = index === entries.filter(e => 
        !shouldExclude(e.name, e.isDirectory(), path.join(dirPath, e.name))
      ).length - 1;
      
      const connector = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      const icon = getIcon(entry.name, entry.isDirectory());
      
      // Формирование строки
      let line = `${prefix}${connector}${icon} ${entry.name}`;
      
      if (entry.isDirectory()) {
        line += '/';
        output += line + '\n';
        output += buildTree(path.join(dirPath, entry.name), level + 1, nextPrefix);
      } else {
        if (CONFIG.showFileSize) {
          try {
            const size = fs.statSync(path.join(dirPath, entry.name)).size;
            line += ` (${formatBytes(size)})`;
          } catch {}
        }
        output += line + '\n';
      }
    });
  } catch (error) {
    // Тихо пропускаем ошибки доступа
  }
  
  return output;
}

/**
 * Форматирование размера файла
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Генерация заголовка отчёта
 */
function generateHeader(projectName: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `# 📊 Project Structure: ${projectName}
# Generated: ${timestamp}
# Purpose: Context for AI-assisted development

## Project Info
- Name: ${projectName}
- Root: ${process.cwd()}
- Max Depth: ${CONFIG.maxDepth}
- Format: ${CONFIG.outputFormat}

---

## Directory Tree
\`\`\`
`;
}

/**
 * Основная функция
 */
function main() {
  const projectPath = process.cwd();
  const projectName = path.basename(projectPath);
  
  console.log(`\n🔍 Сканирование проекта: ${projectName}`);
  console.log(`📍 Путь: ${projectPath}\n`);
  
  // Генерация дерева
  const tree = buildTree(projectPath);
  
  // Формирование полного отчёта
  const report = CONFIG.outputFormat === 'tree' 
    ? generateHeader(projectName) + tree + '\n```\n'
    : tree;
  
  // Вывод в консоль
  console.log(report);
  
  // Сохранение в файл
  const outputPath = path.join(projectPath, CONFIG.outputFile);
  fs.writeFileSync(outputPath, report, 'utf-8');
  
  console.log(`\n✅ Структура сохранена: ${CONFIG.outputFile}`);
  console.log(`📤 Отправьте этот файл мне для продолжения работы!\n`);
}

// Запуск
main();