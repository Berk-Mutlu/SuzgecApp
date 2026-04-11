
interface SellerInfo {
  displayName: string;
  logoUrl: string;
  domain: string;
}

const KNOWN_SELLERS: Record<string, SellerInfo> = {
  
  'trendyol': {
    displayName: 'Trendyol',
    logoUrl: 'https://logo.clearbit.com/trendyol.com',
    domain: 'trendyol.com'
  },
  
  'hepsiburada': {
    displayName: 'Hepsiburada',
    logoUrl: 'https://logo.clearbit.com/hepsiburada.com',
    domain: 'hepsiburada.com'
  },
  
  'amazon': {
    displayName: 'Amazon',
    logoUrl: 'https://logo.clearbit.com/amazon.com.tr',
    domain: 'amazon.com.tr'
  },
  
  'n11': {
    displayName: 'n11.com',
    logoUrl: 'https://logo.clearbit.com/n11.com',
    domain: 'n11.com'
  },
  
  'ciceksepeti': {
    displayName: 'Çiçek Sepeti',
    logoUrl: 'https://logo.clearbit.com/ciceksepeti.com',
    domain: 'ciceksepeti.com'
  },
  
  'gittigidiyor': {
    displayName: 'GittiGidiyor',
    logoUrl: 'https://logo.clearbit.com/gittigidiyor.com',
    domain: 'gittigidiyor.com'
  },
  
  'mediamarkt': {
    displayName: 'MediaMarkt',
    logoUrl: 'https://logo.clearbit.com/mediamarkt.com.tr',
    domain: 'mediamarkt.com.tr'
  },
  
  'teknosa': {
    displayName: 'Teknosa',
    logoUrl: 'https://logo.clearbit.com/teknosa.com',
    domain: 'teknosa.com'
  },
  
  'vatan': {
    displayName: 'Vatan Bilgisayar',
    logoUrl: 'https://logo.clearbit.com/vatanbilgisayar.com',
    domain: 'vatanbilgisayar.com'
  },
  'vatanbilgisayar': {
    displayName: 'Vatan Bilgisayar',
    logoUrl: 'https://logo.clearbit.com/vatanbilgisayar.com',
    domain: 'vatanbilgisayar.com'
  },
  
  'pttavm': {
    displayName: 'PTT AVM',
    logoUrl: 'https://logo.clearbit.com/pttavm.com',
    domain: 'pttavm.com'
  },
  
  'idefix': {
    displayName: 'idefix',
    logoUrl: 'https://logo.clearbit.com/idefix.com',
    domain: 'idefix.com'
  },
  
  'boyner': {
    displayName: 'Boyner',
    logoUrl: 'https://logo.clearbit.com/boyner.com.tr',
    domain: 'boyner.com.tr'
  },
  
  'morhipo': {
    displayName: 'Morhipo',
    logoUrl: 'https://logo.clearbit.com/morhipo.com',
    domain: 'morhipo.com'
  },
  
  'koctas': {
    displayName: 'Koçtaş',
    logoUrl: 'https://logo.clearbit.com/koctas.com.tr',
    domain: 'koctas.com.tr'
  },
  
  'migros': {
    displayName: 'Migros',
    logoUrl: 'https://logo.clearbit.com/migros.com.tr',
    domain: 'migros.com.tr'
  },
  
  'gratis': {
    displayName: 'Gratis',
    logoUrl: 'https://logo.clearbit.com/gratis.com',
    domain: 'gratis.com'
  },
  
  'apple': {
    displayName: 'Apple',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    domain: 'apple.com'
  },
  
  'samsung': {
    displayName: 'Samsung',
    logoUrl: 'https://logo.clearbit.com/samsung.com',
    domain: 'samsung.com'
  },
  
  'ebay': {
    displayName: 'eBay',
    logoUrl: 'https://logo.clearbit.com/ebay.com',
    domain: 'ebay.com'
  },
  
  'aliexpress': {
    displayName: 'AliExpress',
    logoUrl: 'https://logo.clearbit.com/aliexpress.com',
    domain: 'aliexpress.com'
  },
  
  'temu': {
    displayName: 'Temu',
    logoUrl: 'https://logo.clearbit.com/temu.com',
    domain: 'temu.com'
  },
  
  'letgo': {
    displayName: 'Letgo',
    logoUrl: 'https://logo.clearbit.com/letgo.com',
    domain: 'letgo.com'
  },
  
  'decathlon': {
    displayName: 'Decathlon',
    logoUrl: 'https://logo.clearbit.com/decathlon.com.tr',
    domain: 'decathlon.com.tr'
  },
  
  'lcwaikiki': {
    displayName: 'LC Waikiki',
    logoUrl: 'https://logo.clearbit.com/lcwaikiki.com',
    domain: 'lcwaikiki.com'
  },
  
  'watsons': {
    displayName: 'Watsons',
    logoUrl: 'https://logo.clearbit.com/watsons.com.tr',
    domain: 'watsons.com.tr'
  },
  
  'kitapyurdu': {
    displayName: 'Kitapyurdu',
    logoUrl: 'https://logo.clearbit.com/kitapyurdu.com',
    domain: 'kitapyurdu.com'
  },
  
  'dr': {
    displayName: 'D&R',
    logoUrl: 'https://logo.clearbit.com/dr.com.tr',
    domain: 'dr.com.tr'
  },
  
  'bim': {
    displayName: 'BİM',
    logoUrl: 'https://logo.clearbit.com/bim.com.tr',
    domain: 'bim.com.tr'
  },
  
  'a101': {
    displayName: 'A101',
    logoUrl: 'https://logo.clearbit.com/a101.com.tr',
    domain: 'a101.com.tr'
  },
};

function extractDomain(siteName: string): string {
  let cleaned = siteName.trim().toLowerCase();
  
  
  cleaned = cleaned.replace(/^https?:\/\//, '');
  
  cleaned = cleaned.replace(/^www\./, '');
  
  cleaned = cleaned.split('/')[0];
  
  return cleaned;
}

function extractBrandKey(siteName: string): string {
  const domain = extractDomain(siteName);
  
  const parts = domain.split('.');
  return parts[0];
}

function getCleanDisplayName(siteName: string): string {
  const brandKey = extractBrandKey(siteName);
  
  
  if (KNOWN_SELLERS[brandKey]) {
    return KNOWN_SELLERS[brandKey].displayName;
  }
  
  
  const domain = extractDomain(siteName);
  if (domain.includes('.')) {
    
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  
  
  return siteName;
}

function getSellerLogoUrl(siteName: string): string {
  const brandKey = extractBrandKey(siteName);
  
  
  if (KNOWN_SELLERS[brandKey]) {
    return KNOWN_SELLERS[brandKey].logoUrl;
  }
  
  
  const domain = extractDomain(siteName);
  if (domain.includes('.')) {
    return `https://logo.clearbit.com/${domain}`;
  }
  
  
  return `https://www.google.com/s2/favicons?domain=${domain}.com&sz=64`;
}

export function getSellerDisplayInfo(siteName: string): { displayName: string; logoUrl: string } {
  return {
    displayName: getCleanDisplayName(siteName),
    logoUrl: getSellerLogoUrl(siteName),
  };
}

export { KNOWN_SELLERS, extractDomain, extractBrandKey, getCleanDisplayName, getSellerLogoUrl };
