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
    console.log("here, unAvailabilityShifts", unAvailabilityShifts);

    const nonOverlappingShifts =
      ShiftManager.fusionOverlapShift(unAvailabilityShifts);
    console.log("here, nonOverlappingShifts", nonOverlappingShifts);
    return ShiftManager.retrieveFirstAvailableSlot(
      nonOverlappingShifts,
      workingDay,
      workStartHour,
      workEndHour,
      meetingDuration,
    );
  }
}
