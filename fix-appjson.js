const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, 'dist', 'build', 'mp-weixin', 'app.json');

if (!fs.existsSync(appJsonPath)) {
  console.log('⚠️  app.json not found, skipping fix');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

let changed = false;

// 删除空的 themeLocation
if (data.themeLocation === '') {
  delete data.themeLocation;
  changed = true;
  console.log('✅ 已删除空 themeLocation');
}

// 确保 renderer 存在
if (!data.renderer) {
  data.renderer = 'webview';
  changed = true;
  console.log('✅ 已添加 renderer');
}

if (changed) {
  fs.writeFileSync(appJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('✅ app.json 修复完成');
} else {
  console.log('✅ app.json 无需修复');
}
