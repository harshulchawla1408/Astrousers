export const analyzeCalendar = (data) => {
  const { year_name, month_name, day } = data;

  const analysis = {
    summary: "",
    personalityTheme: [],
    careerFinance: [],
    relationships: [],
    healthMind: [],
    spiritualGuidance: [],
    dos: [],
    donts: [],
    warnings: [],
    remedies: [],
    predictions: [],
  };

  /* ==========================
     YEAR (SAMVATSARA) ANALYSIS
     ========================== */

  switch (year_name) {
    case "Subhakrit":
      analysis.summary =
        "A constructive year focused on growth, discipline, and positive transformation.";

      analysis.personalityTheme.push(
        "This year encourages maturity, responsibility, and thoughtful action."
      );

      analysis.careerFinance.push(
        "New ventures started with proper planning can bring stable success.",
        "Financial growth is gradual but reliable."
      );

      analysis.relationships.push(
        "Family and marriage-related matters move towards stability.",
        "Mutual respect becomes the key theme in relationships."
      );

      analysis.healthMind.push(
        "Mental clarity improves when routine and discipline are followed."
      );

      analysis.spiritualGuidance.push(
        "This year favors gratitude, charity, and self-improvement."
      );

      analysis.dos.push(
        "Start long-term projects",
        "Plan finances carefully",
        "Respect elders and mentors"
      );

      analysis.donts.push(
        "Avoid procrastination",
        "Do not take impulsive decisions"
      );

      analysis.remedies.push(
        "Offer water to the Sun on Sundays",
        "Practice daily gratitude"
      );
      break;

    default:
      analysis.summary =
        "A mixed year requiring balanced decisions and mindful actions.";
  }

  /* ==========================
     MONTH (MAAS) ANALYSIS
     ========================== */

  if (month_name === "Jyeshta") {
    analysis.personalityTheme.push(
      "This month highlights authority, responsibility, and inner strength."
    );

    analysis.careerFinance.push(
      "Work pressure may increase, especially from seniors or leadership roles.",
      "Success comes through patience rather than force."
    );

    analysis.relationships.push(
      "Ego clashes are possible if communication is harsh.",
      "Practicing humility improves harmony."
    );

    analysis.healthMind.push(
      "Mental stress may rise due to overthinking or expectations."
    );

    analysis.spiritualGuidance.push(
      "Silence, meditation, and self-control are powerful this month."
    );

    analysis.warnings.push(
      "Avoid arrogance",
      "Do not dominate conversations"
    );
  }

  /* ==========================
     DAY / TITHI PHASE ANALYSIS
     ========================== */

  if (day <= 5) {
    analysis.careerFinance.push(
      "This phase supports planning and intention setting."
    );
    analysis.dos.push("Plan goals", "Prepare strategies");
  }

  if (day > 5 && day <= 12) {
    analysis.careerFinance.push(
      "Active execution phase with moderate success."
    );
    analysis.dos.push("Execute planned tasks");
  }

  if (day > 12) {
    analysis.careerFinance.push(
      "Best time for completing pending work rather than starting new ventures."
    );
    analysis.healthMind.push(
      "Body may feel tired — rest and balance are required."
    );

    analysis.dos.push("Finish old tasks", "Review decisions");
    analysis.donts.push(
      "Avoid risky investments",
      "Avoid confrontations"
    );
  }

  /* ==========================
     FINAL POLISH
     ========================== */

  analysis.remedies.push(
    "Maintain cleanliness at home",
    "Light a diya in the evening"
  );

  analysis.predictions = [
    analysis.summary,
    ...analysis.personalityTheme,
    ...analysis.careerFinance,
    ...analysis.relationships,
    ...analysis.healthMind,
    ...analysis.spiritualGuidance,
    ...analysis.warnings,
    ...analysis.remedies,
  ].filter(Boolean);

  return analysis;
};
