/**
 * 懒觉王比赛 - 数据加载工具
 * 从本地 JSON 文件加载数据
 */

// 小程序中加载本地 JSON 的正确方式
function loadJSON(path) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: path,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`Load failed: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

export async function getUsers() {
  try {
    const data = await loadJSON('/src/data/users.json');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('加载用户数据失败:', err);
    return [];
  }
}

export async function getWeeklyData() {
  try {
    const data = await loadJSON('/src/data/weekly.json');
    return data || [];
  } catch (err) {
    console.error('加载周度数据失败:', err);
    return [];
  }
}

export async function getDailyData() {
  try {
    const data = await loadJSON('/src/data/daily.json');
    return data?.records || [];
  } catch (err) {
    console.error('加载每日数据失败:', err);
    return [];
  }
}

export async function getRules() {
  try {
    const data = await loadJSON('/src/data/rules.json');
    return data || {};
  } catch (err) {
    console.error('加载规则数据失败:', err);
    return {};
  }
}

export async function getEvents() {
  try {
    const data = await loadJSON('/src/data/events.json');
    return data || {};
  } catch (err) {
    console.error('加载赛事数据失败:', err);
    return {};
  }
}
