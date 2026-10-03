export function buildOfflinePlan({ rankedZones, scenario, language = 'en' }) {
  const groups = ['Schools', 'Healthcare', 'Elderly', 'Outdoor workers', 'Industrial workers'];
  const templates = language === 'hi'
    ? {
        actions: ['स्थानीय पर्यावरण अपडेट साझा करें और गतिविधियों की योजना बनाते समय सार्वजनिक मार्गदर्शन देखें।', 'सामुदायिक संपर्क बिंदु तय करें और आधिकारिक स्थानीय अपडेट की समीक्षा करें।'],
        monitors: ['सक्रिय परिदृश्य और उपलब्ध पर्यावरण इनपुट की समीक्षा करें।', 'अधिकृत स्थानीय सूचनाओं के अनुसार समुदाय को अपडेट दें।'],
        advisory: 'केवल सामान्य सावधानियाँ अपनाएँ और स्थानीय आधिकारिक मार्गदर्शन देखें। यह चिकित्सा सलाह या निदान नहीं है।',
        caveat: 'यह योजना उदाहरणात्मक इनपुट और सक्रिय परिदृश्य पर आधारित है; यह आधिकारिक प्रतिक्रिया या माप नहीं है।',
      }
    : {
        actions: ['Share local environmental updates and check public guidance when planning activities.', 'Set community contact points and review authoritative local updates.'],
        monitors: ['Review the active scenario and the available environmental inputs.', 'Update the community using notices from authoritative local sources.'],
        advisory: 'Use general precautions and follow authoritative local guidance. This is not medical advice or a diagnosis.',
        caveat: 'This plan uses illustrative inputs and the active scenario; it is not an official response or measurement.',
      };
  const priorityActions = rankedZones.slice(0, 2).flatMap((assessment, index) => [{
    group: groups[index],
    zoneId: assessment.zone.id,
    action: templates.actions[index],
  }]);
  const wind = scenario.windSpeed === null ? (language === 'hi' ? 'क्षेत्र-डिफ़ॉल्ट' : 'zone default') : `${scenario.windSpeed} km/h`;
  const scenarioContext = language === 'hi'
    ? `सक्रिय परिदृश्य: हवा ${wind}, यातायात ${scenario.traffic}, उद्योग ${scenario.industry}।`
    : `Active scenario: wind ${wind}, traffic ${scenario.traffic}, industry ${scenario.industry}.`;

  return {
    priorityActions,
    monitoringPlan: [scenarioContext, ...templates.monitors],
    advisoryMessage: templates.advisory,
    caveat: templates.caveat,
  };
}
