import { Shift } from "../../../src/models/Shift";

describe("Shift class", () => {
  test("Invalid day should throw an error", () => {
    expect(() => {
      new Shift("0", "08:00", "09:00");
    }).toThrow("Invalid day: 0");
  });

  test("Invalid time should throw an error", () => {
    // Invalid start time
    expect(() => {
      new Shift("1", "125:00", "09:00");
    }).toThrow("Invalid time: 125:00-09:00");

    // Invalid end time
    expect(() => {
      new Shift("1", "08:00", "127:00");
    }).toThrow("Invalid time: 08:00-127:00");
  });

  test("Overlap method should correctly determine overlapping shifts", () => {
    const shift1 = new Shift("1", "08:00", "09:00");
    const shift2 = new Shift("1", "08:30", "09:30");
    const shift3 = new Shift("1", "09:30", "10:30");
    const shift4 = new Shift("1", "10:00", "11:00");

    // Shifts 1 and 2 overlap
    expect(shift1.isOverlap(shift2)).toBe(true);

    // Shifts 1 and 3 do not overlap
    expect(shift1.isOverlap(shift3)).toBe(false);

    // Shifts 1 and 4 do not overlap
    expect(shift1.isOverlap(shift4)).toBe(false);
  });

  test("UpdateOverlap method should correctly update overlapping shifts", () => {
    const shift1 = new Shift("1", "08:00", "09:00");
    const shift2 = new Shift("1", "08:30", "09:30");

    // Update shift1 to overlap with shift2
    shift1.updateOverlap(shift2);

    // Shift1's start time should be updated to 08:00
    expect(shift1.start).toBe("08:00");

    // Shift1's end time should be updated to 09:30
    expect(shift1.end).toBe("09:30");
  });
});
