"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoMapper = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const DEFAULT_OPTIONS = {
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
class RepoMapper {
    constructor(options = {}) {
        this.fileStructure = [];
        this.statistics = {
            totalFiles: 0,
            totalDirs: 0,
            fileTypes: {},
            largestFiles: []
        };
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }
    async scanDirectory(dirPath, depth = 0) {
        if (depth > this.options.maxDepth)
            return;
        try {
            const items = await fs_1.promises.readdir(dirPath);
            for (const item of items) {
                if (this.shouldIgnore(item))
                    continue;
                const fullPath = path.join(dirPath, item);
                const stats = await fs_1.promises.stat(fullPath);
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
                }
                else {
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
        }
        catch (error) {
            console.error(`Error scanning ${dirPath}:`, error);
        }
    }
    shouldIgnore(item) {
        return this.options.ignorePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                return regex.test(item);
            }
            return item === pattern;
        });
    }
    formatSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0)
            return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
    }
    generateStructureText() {
        return this.fileStructure
            .map(item => {
            const indent = '  '.repeat(item.depth);
            const prefix = item.type === 'directory' ? '📁 ' : '📄 ';
            const size = item.type === 'file' ? ` (${item.size})` : '';
            return `${indent}${prefix}${item.name}${size}`;
        })
            .join('\n');
    }
    updateLargestFiles(file) {
        this.statistics.largestFiles.push(file);
        this.statistics.largestFiles.sort((a, b) => b.size - a.size);
        if (this.statistics.largestFiles.length > 5) {
            this.statistics.largestFiles.pop();
        }
    }
    generateSummary(text) {
        return this.generateFallbackSummary();
    }
    generateFallbackSummary() {
        const { totalFiles, totalDirs, fileTypes } = this.statistics;
        const topFileTypes = Object.entries(fileTypes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([ext, count]) => `${ext || 'no-extension'}: ${count}`)
            .join(', ');
        return `Repository contains ${totalFiles} files in ${totalDirs} directories. ` +
            `Most common file types: ${topFileTypes}.`;
    }
}
exports.RepoMapper = RepoMapper;
