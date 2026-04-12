import EventModel from "../model/eventModel.js";

export const createEvent = async (req, res) => {
  try {
    const { name, description, poster, date, audience } = req.body;

    if (!name || !description || !date) {
      return res.status(400).json({ message: "Name, description, and date are required" });
    }

    const nextAudience = ["alumni", "student", "both"].includes(audience) ? audience : "both";

    const event = await EventModel.create({
      name: String(name).trim(),
      description: String(description).trim(),
      poster: poster || "",
      date,
      audience: nextAudience,
    });

    return res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { audience = "all" } = req.query;

    let query = {};
    if (audience === "student") {
      query = { audience: { $in: ["student", "both"] } };
    } else if (audience === "alumni") {
      query = { audience: { $in: ["alumni", "both"] } };
    }

    const events = await EventModel.find(query).sort({ date: 1, createdAt: -1 });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};
