import { RepoMapper } from './mapper';
import { MapResult, MapperOptions } from './types';


export async function mapRepository(
  dirPath: string,
  options: MapperOptions = {}
): Promise<MapResult> {
  const mapper = new RepoMapper(options);
  
  await mapper.scanDirectory(dirPath);
  const structureText = mapper.generateStructureText();
  const summary = mapper.generateSummary(structureText);

  return {
    structure: structureText,
    summary:summary,
    statistics: mapper.statistics
  };
}