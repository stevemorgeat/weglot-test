import { Shift } from "../models/Shift";

export class ShiftManager {
  public static fusionOverlapShift(unavailabilityShifts: Shift[]): Shift[] {
    const resultShifts: Shift[] = [];

    // Trier les plages horaires indisponibles par jour
    const groupedShifts = ShiftManager.groupShiftsByDay(unavailabilityShifts);

    // Parcourir les plages horaires indisponibles par jour
    for (const day of Object.keys(groupedShifts)) {
      const shiftsOfDay = groupedShifts[day];
      if (shiftsOfDay.length === 0) {
        continue;
      }

      // Trier les shifts du jour par heure de début
      const sortedShifts = shiftsOfDay.sort(
        (a: Shift, b: Shift) => a.startTime - b.startTime,
      );

      // Initialiser le shift résultant avec le premier shift du jour
      let currentShift = sortedShifts[0];

      // Parcourir les shifts du jour
      for (let i = 1; i < sortedShifts.length; i++) {
        const nextShift = sortedShifts[i];
        // Vérifier si le prochain shift se chevauche avec le shift actuel
        if (currentShift.isOverlap(nextShift)) {
          // Mettre à jour le shift actuel pour englober le prochain shift
          currentShift.updateOverlap(nextShift);
        } else {
          // Si le prochain shift ne se chevauche pas avec le shift actuel,
          // ajouter le shift actuel au résultat et passer au prochain shift
          resultShifts.push(currentShift);
          currentShift = nextShift;
        }
      }

      // Ajouter le dernier shift du jour au résultat
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

  public static transformInputToShifts(input: string): Shift[] {
    const unavailabilityLines = input.split("\n");

    return unavailabilityLines.map((line) => {
      const [day, times] = line.split(" ");
      const [start, end] = times.split("-");
      return new Shift(day, start, end);
    });
  }

  public static retrieveFirstAvailableSlot(
    nonOverlappingShifts: Shift[],
    workingDay: number[],
    workStartHour: number,
    workEndHour: number,
    meetingDuration: number,
  ): string | null {
    for (const day of workingDay) {
      let currentStart = workStartHour * 60;
      const currentEnd = workEndHour * 60;

      // Parcourir les plages horaires indisponibles pour ce jour
      for (const shift of nonOverlappingShifts.filter(
        (slot) => slot.day === day,
      )) {
        const slotStart = shift.startTime;
        const slotEnd = shift.endTime;

        // Vérifier si un créneau horaire disponible est disponible entre les plages horaires indisponibles
        if (currentStart + meetingDuration <= slotStart) {
          return `${day} ${Shift.minutesToTime(currentStart)}-${Shift.minutesToTime(currentStart + meetingDuration)}`;
        }

        // last minutes included in the slot
        currentStart = slotEnd + 1;
      }

      // Vérifier si un créneau horaire disponible est disponible après la dernière plage horaire indisponible de la journée
      if (currentStart + meetingDuration <= currentEnd) {
        return `${day} ${Shift.minutesToTime(currentStart)}-${Shift.minutesToTime(currentStart + meetingDuration)}`;
      }
    }

    // Si aucun créneau horaire disponible n'a été trouvé dans la semaine
    return null;
  }
}
