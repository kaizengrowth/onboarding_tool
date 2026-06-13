const MM_URL = process.env.MATTERMOST_URL!;
const MM_TOKEN = process.env.MATTERMOST_BOT_TOKEN!;

async function mmFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${MM_URL}/api/v4${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${MM_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Mattermost ${res.status}: ${path}`);
  return res.json();
}

// Creates a private channel for a pod. Returns the channel object.
export async function createChannel(
  name: string,
  displayName: string,
  teamId: string
) {
  return mmFetch("/channels", {
    method: "POST",
    body: JSON.stringify({ team_id: teamId, name, display_name: displayName, type: "P" }),
  });
}

// Sends a DM from the bot account to a Mattermost user.
export async function sendDirectMessage(mattermostUserId: string, message: string) {
  const dm = await mmFetch("/channels/direct", {
    method: "POST",
    body: JSON.stringify([process.env.MATTERMOST_BOT_USER_ID, mattermostUserId]),
  });
  return mmFetch("/posts", {
    method: "POST",
    body: JSON.stringify({ channel_id: dm.id, message }),
  });
}

export async function postToChannel(channelId: string, message: string) {
  return mmFetch("/posts", {
    method: "POST",
    body: JSON.stringify({ channel_id: channelId, message }),
  });
}
