import path from 'path';
import fs from 'fs/promises';
import Kundli from '../models/kundliModel.js';
import { generateKundliSummary } from '../services/kundliService.js';
import { buildKundliPdf } from '../services/pdfService.js';

/**
 * POST /api/kundli/generate
 * Body: { name, dob (YYYY-MM-DD), tob (HH:mm), city }
 */
export async function generateKundliHandler(req, res) {
  try {
    const { name, dob, tob, city, saveToDb = false } = req.body;
    if (!name || !dob || !tob || !city) {
      return res.status(400).json({ error: 'Missing required fields: name, dob, tob, city' });
    }

    // Generate summary (core astrological computations)
    const kundliData = await generateKundliSummary({ name, dob, tob, city });

    // Build PDF bytes
    const pdfBytes = await buildKundliPdf(kundliData);

    // Optionally save PDF to disk & store DB record (small projects may keep ephemeral)
    let savedPdfPath = null;
    if (saveToDb) {
      const outDir = path.join(process.cwd(), 'generated');
      // create folder if not exists
      try { await fs.mkdir(outDir, { recursive: true }); } catch (e) {}
      const fileName = `${name.replace(/\s+/g,'_')}_${Date.now()}.pdf`;
      savedPdfPath = path.join(outDir, fileName);
      await fs.writeFile(savedPdfPath, pdfBytes);
      // Save metadata in DB
      const record = new Kundli({
        name,
        dob: new Date(dob),
        tob,
        city,
        lat: kundliData.lat,
        lon: kundliData.lon,
        timezone: kundliData.timezone,
        summary: kundliData.positions,
        pdfPath: savedPdfPath.replace(process.cwd(), ''), // relative
      });
      await record.save();
    }

    // Return PDF as response (download)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name.replace(/\s+/g,'_')}_kundli_summary.pdf"`);
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Kundli generation error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
