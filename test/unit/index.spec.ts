import path from "path";
import { FileReaderService } from "../../src/services/FileReader";

describe("ShiftScheduler", () => {
  const inputDirectory = path.join(__dirname, "../..", "data");
  const inputStringFiles =
    FileReaderService.readFiles(inputDirectory, "input") || [];
  const outputStringFiles =
    FileReaderService.readFiles(inputDirectory, "output") || [];

  describe("successes", () => {
    test("should have 5 set of shifts", () => {
      expect(inputStringFiles.length).toBe(5);
      expect(outputStringFiles.length).toBe(5);
    });
  });

  describe("failures", () => {
    test("should throw an error if the input file is invalid", () => {
      const invalidInputDirectory = path.join(
        __dirname,
        "../..",
        "invalid_data",
      );
      const invalidInputFiles = FileReaderService.readFiles(
        invalidInputDirectory,
        "input",
      );

      expect(invalidInputFiles).toBeNull();
    });

    test("should throw an error if the output file is invalid", () => {
      const invalidOutputDirectory = path.join(
        __dirname,
        "../..",
        "invalid_data",
      );

      const invalidOutputFiles = FileReaderService.readFiles(
        invalidOutputDirectory,
        "output",
      );
      expect(invalidOutputFiles).toBeNull();
    });
  });
});
