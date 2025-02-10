
# repo-mapper 🗺️

A powerful Node.js package that generates detailed repository maps, summaries, and statistics. Perfect for documentation, codebase understanding, and AI prompts.

## Features ✨

- 📁 Generate clear, hierarchical repository structure
- 📊 Collect detailed statistics about your codebase
- 📝 Create concise summaries of repository content
- ⚡ Fast and efficient directory scanning
- 🤖 AI-prompt friendly output format

## Installation

```bash
npm install repo-mapper
```


## Project Structure

```
root/
├── src/
│   ├── index.ts       # Main entry point
│   ├── mapper.ts      # Core mapping functionality
│   └── types.ts       # TypeScript type definitions
├── tests/
│   └── __tests__/     # Test files
└── docs/             # Documentation
```

## Core Files

### `src/index.ts`
Entry point that exports the main `mapRepository` function. Acts as the public API for the package.

### `src/mapper.ts`
Contains the `RepoMapper` class that handles:
- Directory scanning
- Structure generation
- Summary creation
- Statistics collection

### `src/types.ts`
TypeScript interfaces and types for:
- MapResult
- MapperOptions
- Internal types

## API Documentation

### Main Function

```typescript
async function mapRepository(
  dirPath: string,
  options: MapperOptions = {}
): Promise<MapResult>
```

#### Parameters

- `dirPath`: Path to the repository directory to map
- `options`: Configuration options (optional)
  ```typescript
  interface MapperOptions {
    ignorePaths?: string[];     // Paths to ignore
    maxDepth?: number;          // Maximum directory depth
    // Add other options as needed
  }
  ```

#### Returns

```typescript
interface MapResult {
  structure: string;     // Formatted repository structure
  summary: string;       // Repository summary
  statistics: {          // Repository statistics
    totalFiles: number;
    totalDirectories: number;
    fileTypes: Record<string, number>;
    // Other statistics
  }
}
```

## Usage Examples

### Basic Usage

```typescript
import { mapRepository } from 'repo-mapper';

const result = await mapRepository('./project-path');
console.log(result.structure);
```

### With Options

```typescript
const result = await mapRepository('./project-path', {
  ignorePaths: ['node_modules', 'dist'],
  maxDepth: 3
});
```

### Getting Statistics

```typescript
const { statistics } = await mapRepository('./project-path');
console.log(statistics.totalFiles);
console.log(statistics.fileTypes);
```

## Common Use Cases

1. **Repository Documentation**
   - Generate clear repository structure documentation
   - Create standardized README files
   - Document codebase organization

2. **AI Development**
   - Generate context for AI programming assistants
   - Create structured input for code analysis
   - Standardize repository documentation

3. **Development Workflows**
   - Onboard new team members
   - Track project structure changes
   - Maintain consistent documentation


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the ISC License.