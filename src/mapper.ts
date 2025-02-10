import { FileStats, RepoStatistics, MapResult, MapperOptions } from './types';
import { promises as fs } from 'fs';
import * as path from 'path';
const DEFAULT_OPTIONS: Required<MapperOptions> = {
  maxDepth: 4,
  ignorePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.env',
    '*.log',
    '.next',
    'coverage'
  ],
};

export class RepoMapper {
  private fileStructure: FileStats[] = [];
  public statistics: RepoStatistics = {
    totalFiles: 0,
    totalDirs: 0,
    fileTypes: {},
    largestFiles: []
  };
  private options: Required<MapperOptions>;


  constructor(options: MapperOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async scanDirectory(dirPath: string, depth = 0): Promise<void> {
    if (depth > this.options.maxDepth) return;

    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        if (this.shouldIgnore(item)) continue;

        const fullPath = path.join(dirPath, item);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          this.statistics.totalDirs++;
          this.fileStructure.push({
            type: 'directory',
            path: fullPath,
            name: item,
            depth,
            size: this.formatSize(stats.size)
          });
          await this.scanDirectory(fullPath, depth + 1);
        } else {
          this.statistics.totalFiles++;
          const fileExt = path.extname(item).toLowerCase();
          this.statistics.fileTypes[fileExt] = (this.statistics.fileTypes[fileExt] || 0) + 1;
          
          this.fileStructure.push({
            type: 'file',
            path: fullPath,
            name: item,
            depth,
            size: this.formatSize(stats.size)
          });

          this.updateLargestFiles({ name: item, size: stats.size, path: fullPath });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error);
    }
  }

  private shouldIgnore(item: string): boolean {
    return this.options.ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(item);
      }
      return item === pattern;
    });
  }

  private formatSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  }

  generateStructureText(): string {
    return this.fileStructure
      .map(item => {
        const indent = '  '.repeat(item.depth);
        const prefix = item.type === 'directory' ? '📁 ' : '📄 ';
        const size = item.type === 'file' ? ` (${item.size})` : '';
        return `${indent}${prefix}${item.name}${size}`;
      })
      .join('\n');
  }

  private updateLargestFiles(file: { name: string; size: number; path: string }): void {
    this.statistics.largestFiles.push(file);
    this.statistics.largestFiles.sort((a, b) => b.size - a.size);
    if (this.statistics.largestFiles.length > 5) {
      this.statistics.largestFiles.pop();
    }
  }

  generateSummary(text: string): string{
      return this.generateFallbackSummary();
  }

  private generateFallbackSummary(): string {
    const { totalFiles, totalDirs, fileTypes } = this.statistics;
    const topFileTypes = Object.entries(fileTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([ext, count]) => `${ext || 'no-extension'}: ${count}`)
      .join(', ');

    return `Repository contains ${totalFiles} files in ${totalDirs} directories. ` +
           `Most common file types: ${topFileTypes}.`;
  }
}

