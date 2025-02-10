export interface FileStats {
    type: 'file' | 'directory';
    path: string;
    name: string;
    depth: number;
    size: string;
  }
  
  export interface RepoStatistics {
    totalFiles: number;
    totalDirs: number;
    fileTypes: Record<string, number>;
    largestFiles: Array<{
      name: string;
      size: number;
      path: string;
    }>;
  }
  
  export interface MapResult {
    structure: string;
    summary: string;
    statistics: RepoStatistics;
  }
  
  export interface MapperOptions {
    maxDepth?: number;
    ignorePatterns?: string[];
  }