import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const gbTimeAgo = new TimeAgo("en-GB");

export function timeAgo(date: Date) {
  return gbTimeAgo.format(date);
}
