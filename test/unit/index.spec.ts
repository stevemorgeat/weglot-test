import path from "path";
import { FileReaderService } from "../../src/services/FileReader";
import { Schedule } from "../../src";

describe("ShiftScheduler", () => {
  const workingDay = [1, 2, 3, 4, 5];
  const workStartHour = 8;
  const workEndHour = 17;
  const meetingDuration = 59;
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

    test("should findFirstMeetingAvailable return the right slot available for each files", () => {
      for (let i = 0; i < inputStringFiles.length; i++) {
        const input = inputStringFiles[i];
        const output = outputStringFiles[i];

        const result = Schedule.findFirstMeetingAvailable(
          input,
          workStartHour,
          workEndHour,
          meetingDuration,
          workingDay,
        );

        expect(result).toBe(output);
      }
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
