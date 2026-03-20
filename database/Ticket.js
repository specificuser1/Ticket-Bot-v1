import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  user: String,
  channel: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Ticket", TicketSchema);
