import fs from "fs";
import { FileReaderService } from "../../../src/services/FileReader";

describe("FileReaderService", () => {
  beforeEach(() => {
    // Mock the fs module functions
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(["file1.txt", "file2.txt"] as unknown as fs.Dirent[]);
    jest.spyOn(fs, "readFileSync").mockReturnValue("File content");
  });

  afterEach(() => {
    // Restore mocked functions to their original implementations
    jest.restoreAllMocks();
  });

  describe("readFiles", () => {
    it("should read files with the specified prefix", () => {
      const directory = "/path/to/files";
      const filePrefix = "file";
      const files = FileReaderService.readFiles(directory, filePrefix);

      expect(files).toEqual(["File content", "File content"]);
    });

    it("should return null if an error occurs", () => {
      const directory = "/path/to/files";
      const filePrefix = "file";
      jest.spyOn(fs, "readdirSync").mockImplementation(() => {
        throw new Error("Read error");
      });

      const files = FileReaderService.readFiles(directory, filePrefix);

      expect(files).toBeNull();
    });
  });
});
