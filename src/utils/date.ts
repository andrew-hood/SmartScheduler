import { startOfDay } from "date-fns";

export function getMonday(d: any, offset = 0) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + offset + (day == 0 ? -6 : 1); // adjust when day is sunday
  return startOfDay(new Date(d.setDate(diff)));
}

export function formatDate(d: Date) {
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

export function formatTime(d: Date) {
  return d.getHours() + ":" + d.getMinutes().toString().padStart(2, "0");
}

export function getLocalDate(timestamp: number) {
  const offset = new Date().getTimezoneOffset();
  return new Date(timestamp * 1000 + offset * 60 * 1000);
}
