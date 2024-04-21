const CLOCKS: { [key: number]: string } = {
  0: "🕛",
  1: "🕐",
  2: "🕑",
  3: "🕒",
  4: "🕓",
  5: "🕔",
  6: "🕕",
  7: "🕖",
  8: "🕗",
  9: "🕘",
  10: "🕙",
  11: "🕚",
  0.5: "🕧",
  1.5: "🕜",
  2.5: "🕝",
  3.5: "🕞",
  4.5: "🕟",
  5.5: "🕠",
  6.5: "🕡",
  7.5: "🕢",
  8.5: "🕣",
  9.5: "🕤",
  10.5: "🕥",
  11.5: "🕦",
};

function hoursAndMinutesToEmoji(hours: number, minutes: number) {
  if (hours > 11) {
    hours = hours - 12;
  }
  minutes = minutes / 60;
  if (minutes < 0.25) {
    minutes = 0;
  } else if (minutes >= 0.25 && minutes < 0.75) {
    minutes = 0.5;
  } else {
    hours = hours === 11 ? 0 : hours + 1;
    minutes = 0;
  }
  return CLOCKS[hours + minutes];
}

export function timeToEmoji(time: Date) {
  const hours = time.getHours();
  const minutes = time.getMinutes();

  return hoursAndMinutesToEmoji(hours, minutes);
}
