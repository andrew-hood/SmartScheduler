import axios from "axios";

export default async function handler(req: any, res: any) {
  const accessToken = req.headers.authorization;

  const client = axios.create({
    baseURL: "https://graph.microsoft.com/v1.0",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  try {
    // Fetching events from the user's primary calendar
    const response = await client.get("/me/events", {
      params: {
        $select: "subject,start,end,location,attendees",
      },
    });

    res.status(200).json(response.data.value);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Error fetching calendar events" });
  }
}
