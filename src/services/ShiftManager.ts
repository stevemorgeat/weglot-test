import { Shift } from "../models/Shift";

export class ShiftManager {
  public static transformInputToShifts(input: string): Shift[] {
    const unavailabilityLines = input.split("\n");

    return unavailabilityLines.map((line) => {
      const [day, times] = line.split(" ");
      const [start, end] = times.split("-");
      return new Shift(day, start, end);
    });
  }

  public static mergeOverlapShift(unavailabilityShifts: Shift[]): Shift[] {
    const resultShifts: Shift[] = [];

    const groupedShifts = ShiftManager.groupShiftsByDay(unavailabilityShifts);

    // Browse unavailable time slots by day
    for (const day of Object.keys(groupedShifts)) {
      const shiftsOfDay = groupedShifts[day];
      if (shiftsOfDay.length === 0) {
        continue;
      }

      const sortedShifts = shiftsOfDay.sort(
        (a: Shift, b: Shift) => a.startTime - b.startTime,
      );

      let currentShift = sortedShifts[0];

      for (let i = 1; i < sortedShifts.length; i++) {
        const nextShift = sortedShifts[i];

        if (currentShift.isOverlap(nextShift)) {
          // Merge the current shift to include the next shift
          currentShift.mergeOverlapShift(nextShift);
        } else {
          resultShifts.push(currentShift);
          currentShift = nextShift;
        }
      }

      resultShifts.push(currentShift);
    }

    return resultShifts;
  }

  public static groupShiftsByDay(shifts: Shift[]): { [day: string]: Shift[] } {
    const groupedShifts: { [day: string]: Shift[] } = {};
    for (const shift of shifts) {
      if (!groupedShifts[shift.day]) {
        groupedShifts[shift.day] = [];
      }
      groupedShifts[shift.day].push(shift);
    }
    return groupedShifts;
  }

  public static retrieveFirstAvailableSlot(
    mergedOverlappingShifts: Shift[],
    workingDay: number[],
    workStartHour: number,
    workEndHour: number,
    meetingDuration: number,
  ): string | null {
    for (const day of workingDay) {
      let currentStart = workStartHour * 60;
      const currentEnd = workEndHour * 60;

      for (const shift of mergedOverlappingShifts.filter(
        (slot) => slot.day === day,
      )) {
        const slotStart = shift.startTime;
        const slotEnd = shift.endTime;

        // Check if there is a time slot available before the first unavailable time slot of the day
        if (currentStart + meetingDuration <= slotStart) {
          return `${day} ${Shift.minutesToTime(currentStart)}-${Shift.minutesToTime(currentStart + meetingDuration)}`;
        }

        // last minutes included in the slot
        currentStart = slotEnd + 1;
      }

      // Check if there is a time slot available after the last unavailable time slot of the day
      if (currentStart + meetingDuration <= currentEnd) {
        return `${day} ${Shift.minutesToTime(currentStart)}-${Shift.minutesToTime(currentStart + meetingDuration)}`;
      }
    }

    // If no available time slot is found
    return null;
  }
}
