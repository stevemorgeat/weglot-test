import fs from "fs";
import path from "path";

export class FileReaderService {
  public static readFiles(
    directory: string,
    filePrefix: string,
  ): (string | null)[] | null {
    try {
      const files: (string | null)[] = [];

      fs.readdirSync(directory).forEach((file) => {
        if (file.startsWith(filePrefix)) {
          const filePath = path.join(directory, file);
          const content = FileReaderService.readFile(filePath);
          files.push(content);
        }
      });

      return files;
    } catch (error) {
      console.error(`Error reading files in ${directory}: ${error}`);
      return null;
    }
  }

  private static readFile(filePath: string): string | null {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
      console.error(`Error reading file ${filePath}: ${error}`);
      return null;
    }
  }
}
