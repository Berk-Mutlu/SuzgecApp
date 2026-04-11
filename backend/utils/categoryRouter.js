
const TECH_BRANDS = [
  'apple', 'iphone', 'ipad', 'macbook', 'samsung', 'xiaomi', 'redmi', 'huawei', 'sony', 'playstation', 
  'ps5', 'ps4', 'xbox', 'nintendo', 'asus', 'msi', 'dell', 'hp', 'lenovo', 'acer', 'lg', 'philips', 
  'dyson', 'robot', 'roborock', 'oppo', 'realme', 'vivo', 'casper', 'vestel', 'arçelik', 'beko', 
  'bosch', 'siemens', 'profilo', 'gopro', 'canon', 'nikon', 'fujifilm', 'jbl', 'bang olufsen', 
  'sennheiser', 'marshall', 'bose', 'nvidia', 'intel', 'amd', 'gigabyte'
];

const TECH_KEYWORDS = [
  'telefon', 'akıllı saat', 'tablet', 'laptop', 'dizüstü', 'masaüstü', 'bilgisayar', 'monitör', 
  'ekran', 'televizyon', 'tv', 'kamera', 'fotoğraf makinesi', 'kulaklık', 'hoparlör', 'oyun konsolu', 
  'mouse', 'klavye', 'anakart', 'ekran kartı', 'işlemci', 'harddisk', 'ssd', 'ram', 'modem', 
  'router', 'priz', 'ampul', 'şarj', 'powerbank', 'projeksiyon', 'fırın', 'buzdolabı', 
  'çamaşır makinesi', 'bulaşık makinesi', 'süpürge', 'ütü', 'mikser', 'airfryer', 'kahve makinesi'
];

function isTechProduct(query) {
  if (!query) return false;
  const q = query.toLowerCase();

  
  if (TECH_BRANDS.some(brand => q.includes(brand))) return true;

  
  if (TECH_KEYWORDS.some(word => q.includes(word))) return true;

  return false;
}

module.exports = {
  isTechProduct
};
