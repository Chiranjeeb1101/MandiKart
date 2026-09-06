const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');

const cacheFile = path.join(os.tmpdir(), 'mandikart_shared_negotiations.json');

console.log('=== CLEANING DISK CACHE FOR SHARED NEGOTIATIONS ===');
if (fs.existsSync(cacheFile)) {
  try {
    const content = fs.readFileSync(cacheFile, 'utf8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      const cleaned = parsed.filter(item => 
        item && 
        item.id && 
        !item.id.includes('neg_101') && 
        !item.id.includes('req_101') && 
        !item.id.includes('req_102') && 
        !item.id.includes('req_103') &&
        !item.buyerName?.includes('ABC Foods') &&
        !item.buyerName?.includes('FreshMart') &&
        !item.buyerName?.includes('Kalyan Wholesale')
      );
      fs.writeFileSync(cacheFile, JSON.stringify(cleaned, null, 2), 'utf8');
      console.log(`[Disk Clean] Removed mock items. Remaining real items count: ${cleaned.length}`);
    }
  } catch (e) {
    console.error('Disk clean error:', e.message);
  }
} else {
  console.log('[Disk Clean] No cache file found.');
}

// Test GET /negotiations on farmer backend
http.get('http://localhost:4000/api/v1/negotiations', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const items = json.data || [];
      const hasMock = items.some(i => i.id?.includes('neg_101') || i.buyerName?.includes('ABC Foods') || i.buyerName?.includes('FreshMart'));
      console.log(`[Farmer Backend Query] Total items: ${items.length}`);
      console.log(`[Farmer Backend Query] Contains mock data? ${hasMock ? 'YES (FAIL)' : 'NO (PASS)'}`);
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', err => console.error('HTTP error:', err.message));
