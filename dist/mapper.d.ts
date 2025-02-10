import { RepoStatistics, MapperOptions } from './types';
export declare class RepoMapper {
    private fileStructure;
    statistics: RepoStatistics;
    private options;
    constructor(options?: MapperOptions);
    scanDirectory(dirPath: string, depth?: number): Promise<void>;
    private shouldIgnore;
    private formatSize;
    generateStructureText(): string;
    private updateLargestFiles;
    generateSummary(text: string): string;
    private generateFallbackSummary;
}
