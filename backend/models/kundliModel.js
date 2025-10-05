import mongoose from 'mongoose';

const KundliSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },              // stored as ISO date (midnight local)
  tob: { type: String, required: true },            // "HH:mm" string (local time)
  city: { type: String, required: true },
  lat: { type: Number },
  lon: { type: Number },
  timezone: { type: String },                       // IANA timezone
  summary: { type: Object },                        // computed summary (planet->sign,house etc)
  pdfPath: { type: String },                        // optional path to stored pdf (if you save)
}, { timestamps: true });

export default mongoose.models.Kundli || mongoose.model('Kundli', KundliSchema);
