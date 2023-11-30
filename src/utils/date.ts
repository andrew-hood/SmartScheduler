export function getMonday(d: any, offset = 0) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + offset + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function formatDate(d: Date) {
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}
