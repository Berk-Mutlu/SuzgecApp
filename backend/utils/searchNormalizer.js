
function normalizeQuery(query) {
  if (!query) return '';
  
  
  let normalized = query.toLocaleLowerCase('tr-TR');

  
  
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'â': 'a', 'î': 'i', 'û': 'u'
  };
  normalized = normalized.replace(/[çğıiöşüâîû]/g, letter => turkishMap[letter] || letter);

  
  
  normalized = normalized.replace(/[^a-z0-9\s]/g, ' ');

  
  const tokens = normalized.split(/\s+/).filter(word => word.length > 0);
  
  
  
  tokens.sort();

  
  return tokens.join(' ');
}

function calculateRelevanceScore(searchQuery, productTitle) {
  if (!searchQuery || !productTitle) return 0;
  
  
  const queryTokens = normalizeQuery(searchQuery).split(' ');
  const titleTokens = normalizeQuery(productTitle).split(' ');
  
  if (queryTokens.length === 0 || titleTokens.length === 0) return 0;

  
  const ignoreList = [
    'vatan', 'mediamarkt', 'teknosa', 'hepsiburada', 'trendyol', 'amazon', 
    'n11', 'pazarama', 'ciceksepeti', 'pttavm', 'idefix', 'bilgisayar', 
    'magazasi', 'pazaryeri', 'online', 'resmi', 'satici', 'ucretsiz', 'kargo'
  ];

  let matchAmount = 0;
  
  
  for (const q of queryTokens) {
    if (titleTokens.includes(q)) {
      matchAmount += 1.0; 
    } else {
      
      
      const partialMatch = titleTokens.some(t => t.includes(q) || q.includes(t));
      if (partialMatch) matchAmount += 0.8;
    }
  }

  
  const queryMatchRatio = matchAmount / queryTokens.length;

  
  const relevantTitleTokens = titleTokens.filter(t => !ignoreList.includes(t));
  const extraWordsLength = Math.max(0, relevantTitleTokens.length - queryTokens.length);
  const lengthPenalty = extraWordsLength * 0.03; 
  
  let finalScore = queryMatchRatio - lengthPenalty;
  
  
  return Math.max(0, Math.min(1, finalScore));
}

module.exports = {
  normalizeQuery,
  calculateRelevanceScore
};
