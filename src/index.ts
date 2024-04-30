import { ShiftManager } from "./services/ShiftManager";

export class Schedule {
  public static findFirstMeetingAvailable(
    unAvailabilityInput: string,
    workStartHour: number,
    workEndHour: number,
    meetingDuration: number,
    workingDay: number[],
  ): string | null {
    const unAvailabilityShifts =
      ShiftManager.transformInputToShifts(unAvailabilityInput);

    const mergedOverlappingShifts =
      ShiftManager.mergeOverlapShift(unAvailabilityShifts);

    return ShiftManager.retrieveFirstAvailableSlot(
      mergedOverlappingShifts,
      workingDay,
      workStartHour,
      workEndHour,
      meetingDuration,
    );
  }
}
