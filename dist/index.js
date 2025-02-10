"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRepository = mapRepository;
const mapper_1 = require("./mapper");
async function mapRepository(dirPath, options = {}) {
    const mapper = new mapper_1.RepoMapper(options);
    await mapper.scanDirectory(dirPath);
    const structureText = mapper.generateStructureText();
    const summary = mapper.generateSummary(structureText);
    return {
        structure: structureText,
        summary: summary,
        statistics: mapper.statistics
    };
}
