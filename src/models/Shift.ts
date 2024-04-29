export class Shift {
  public day: number;
  public start: string;
  public end: string;
  public startTime: number;
  public endTime: number;

  constructor(day: string, start: string, end: string) {
    const parsedDay = parseInt(day, 10);
    if (!Shift.isValidWorkingDay(parsedDay)) {
      throw new Error(`Invalid day: ${day}`);
    }
    if (!Shift.isValidTime(start) || !Shift.isValidTime(end)) {
      throw new Error(`Invalid time: ${start}-${end}`);
    }

    this.day = parsedDay;
    this.start = start;
    this.end = end;
    this.startTime = Shift.timeToMinutes(start);
    this.endTime = Shift.timeToMinutes(end);
  }

  // public
  public static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  public isOverlap(otherShift: Shift): boolean {
    // Si l'un des shifts commence après que l'autre ait fini, ils ne se chevauchent pas
    if (
      this.endTime <= otherShift.startTime ||
      this.startTime >= otherShift.endTime
    ) {
      return false;
    }
    return true;
  }

  // Méthode pour mettre à jour la plage horaire en cas de chevauchement
  public updateOverlap(otherShift: Shift): void {
    // Mettre à jour les temps de début et de fin pour englober les deux plages horaires
    this.startTime = Math.min(this.startTime, otherShift.startTime);
    this.endTime = Math.max(this.endTime, otherShift.endTime);
  }
  // private
  private static isValidWorkingDay(day: number): boolean {
    return day >= 1 && day <= 5;
  }

  private static isValidTime(time: string): boolean {
    // For example, check if the time matches the format "hh:mm"
    return /^\d{2}:\d{2}$/.test(time);
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    return hours * 60 + minutes;
  }
}
