const localizedText = {
  en: {
    level: { CRITICAL: 'critical', HIGH: 'high', MODERATE: 'moderate', LOW: 'low' },
    summary: ({ name, score, level }) =>
      `The prototype Environmental Risk Score for ${name} is ${score} (${level}).`,
    scoreFactor: ({ score, level }) => `Engine-computed score: ${score} (${level}).`,
    pmFactor: ({ effectivePM25, category }) =>
      `Engine-computed PM2.5 input: ${effectivePM25} µg/m³ (${category}).`,
    populationFactor: ({ population }) => `Illustrative population input: ${population}.`,
    actions: [
      'Share local environmental notices and encourage residents to follow public guidance.',
      'Use the supplied information when planning community activities; check authoritative local updates.',
    ],
    advisory: 'General precautions only. This is not medical advice or a diagnosis.',
    caveat: 'Illustrative inputs and a prototype Environmental Risk Score; not official measurements.',
  },
  hi: {
    level: { CRITICAL: 'अत्यधिक', HIGH: 'उच्च', MODERATE: 'मध्यम', LOW: 'कम' },
    summary: ({ name, score, level }) =>
      `${name} के लिए प्रोटोटाइप पर्यावरणीय जोखिम स्कोर ${score} (${level}) है।`,
    scoreFactor: ({ score, level }) => `इंजन द्वारा दिया गया स्कोर: ${score} (${level})।`,
    pmFactor: ({ effectivePM25, category }) =>
      `इंजन द्वारा दिया गया PM2.5 इनपुट: ${effectivePM25} µg/m³ (${category})।`,
    populationFactor: ({ population }) => `जनसंख्या का उदाहरणात्मक इनपुट: ${population}।`,
    actions: [
      'स्थानीय पर्यावरण सूचनाएँ साझा करें और लोगों को सार्वजनिक मार्गदर्शन मानने के लिए कहें।',
      'सामुदायिक गतिविधियों की योजना में दिए गए इनपुट देखें और स्थानीय आधिकारिक अपडेट जाँचें।',
    ],
    advisory: 'केवल सामान्य सावधानियाँ। यह चिकित्सा सलाह या निदान नहीं है।',
    caveat: 'उदाहरणात्मक इनपुट और प्रोटोटाइप स्कोर; ये आधिकारिक माप नहीं हैं।',
  },
};

export function buildOfflineResult({ assessment, language = 'en' }) {
  const locale = localizedText[language] || localizedText.en;
  const { zone, score, level, effectivePM25, category } = assessment;
  const localizedLevel = locale.level[level] || level;
  const summaryData = { name: zone.name, score, level: localizedLevel };
  const factorData = { score, level: localizedLevel };

  return {
    summary: locale.summary(summaryData),
    riskFactors: [
      locale.scoreFactor(factorData),
      locale.pmFactor({ effectivePM25, category }),
      locale.populationFactor({ population: zone.population }),
    ],
    communityActions: [...locale.actions],
    advisoryMessage: locale.advisory,
    caveat: locale.caveat,
  };
}
