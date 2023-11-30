export function moveSubsetToBack(arr: any, start: number, end: number) {
  // Check if start and end indices are within the array bounds
  if (
    start < 0 ||
    start >= arr.length ||
    end < 0 ||
    end >= arr.length ||
    start >= end
  ) {
    console.error("Invalid subset indices");
    return;
  }

  // Extract the subset from the array
  const subset = arr.splice(start, end - 1 - start);

  // Move the subset to the back of the array
  arr.push(...subset);
  return arr;
}
