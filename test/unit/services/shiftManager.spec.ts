import { Shift } from "../../../src/models/Shift";
import { ShiftManager } from "../../../src/services/ShiftManager";

describe("ShiftManager", () => {
  describe("mergeOverlapShift", () => {
    it("should merge overlapping shifts", () => {
      const unavailabilityShifts: Shift[] = [
        new Shift("1", "10:45", "15:49"),
        new Shift("3", "10:45", "15:49"),
        new Shift("1", "09:05", "16:59"),
        new Shift("4", "10:45", "15:49"),
        new Shift("1", "08:12", "09:10"),
      ];

      const expectedShifts: Shift[] = [
        new Shift("1", "08:12", "16:59"),
        new Shift("3", "10:45", "15:49"),
        new Shift("4", "10:45", "15:49"),
      ];

      const result = ShiftManager.mergeOverlapShift(unavailabilityShifts);
      expect(result).toEqual(expectedShifts);
    });

    it("should handle non-overlapping shifts", () => {
      const unavailabilityShifts: Shift[] = [
        new Shift("1", "08:00", "09:00"),
        new Shift("1", "10:00", "12:00"),
        new Shift("1", "13:00", "15:00"),
      ];

      const expectedShifts: Shift[] = unavailabilityShifts;

      const result = ShiftManager.mergeOverlapShift(unavailabilityShifts);
      expect(result).toEqual(expectedShifts);
    });

    it("should handle empty input", () => {
      const unavailabilityShifts: Shift[] = [];

      const expectedShifts: Shift[] = [];

      const result = ShiftManager.mergeOverlapShift(unavailabilityShifts);
      expect(result).toEqual(expectedShifts);
    });
  });

  describe("transformInputToShifts", () => {
    it("should transform input string to array of Shift objects", () => {
      const input = `1 09:42-11:00\n4 12:06-12:36\n2 17:52-17:58`;

      const expectedShifts: Shift[] = [
        new Shift("1", "09:42", "11:00"),
        new Shift("4", "12:06", "12:36"),
        new Shift("2", "17:52", "17:58"),
      ];

      const result = ShiftManager.transformInputToShifts(input);
      expect(result).toEqual(expectedShifts);
    });
  });

  describe("retrieveFirstAvailableSlot", () => {
    it("should return first available slot", () => {
      const nonOverlappingShifts: Shift[] = [
        new Shift("1", "09:00", "09:59"),
        new Shift("2", "11:00", "12:59"),
        new Shift("3", "13:00", "14:59"),
        new Shift("4", "15:00", "16:59"),
        new Shift("5", "17:00", "17:59"),
      ];

      const workingDay = [1, 2, 3, 4, 5];
      const workStartHour = 9;
      const workEndHour = 18;
      const meetingDuration = 59; // for 60 minutes

      const expectedSlot = "1 10:00-10:59";

      const result = ShiftManager.retrieveFirstAvailableSlot(
        nonOverlappingShifts,
        workingDay,
        workStartHour,
        workEndHour,
        meetingDuration,
      );
      expect(result).toEqual(expectedSlot);
    });

    it("should return null if no available slot is found", () => {
      const nonOverlappingShifts: Shift[] = [
        new Shift("1", "09:00", "10:00"),
        new Shift("2", "11:00", "12:00"),
        new Shift("3", "13:00", "14:00"),
        new Shift("4", "15:00", "16:00"),
        new Shift("5", "17:00", "18:00"),
      ];

      const workingDay = [1, 2, 3, 4, 5];
      const workStartHour = 8;
      const workEndHour = 18;
      const meetingDuration = 600; // 10 hours

      const result = ShiftManager.retrieveFirstAvailableSlot(
        nonOverlappingShifts,
        workingDay,
        workStartHour,
        workEndHour,
        meetingDuration,
      );
      expect(result).toBeNull();
    });
  });
});
