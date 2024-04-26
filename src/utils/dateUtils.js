import { formatDistanceToNow } from "date-fns";

function formatToNow(createdAt) {
  return formatDistanceToNow(createdAt);
}

export default { formatToNow };
