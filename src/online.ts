import { window } from 'vscode';
import * as cheerio from 'cheerio';
import DataProvider from './Provider';
import { request } from './request';

interface SearchResult {
  type: string;
  name: string;
  isDirectory: boolean;
  path: string;
}

// TODO: 提供多个源
const DOMAIN = 'https://www.biquge.com.cn';

export const search = async (keyword: string) => {
  const result: SearchResult[] = [];
  try {
    const res = await request(`${DOMAIN}/search.php?q=${encodeURIComponent(keyword)}`);
    console.log('res: ', res);
    const $ = cheerio.load(res);
    $('.result-list .result-item.result-game-item').each((index: number, ele: any) => {
      const title = $(ele).find('a.result-game-item-title-link span').text();
      const author = $(ele).find('.result-game-item-info .result-game-item-info-tag:nth-child(1) span:nth-child(2)').text();
      const path = $(ele).find('a.result-game-item-pic-link').attr().href;
      console.log('title, author, path', title, author, path);
      result.push({
        type: '.biquge',
        name: `${title} - ${author}`,
        isDirectory: true,
        path,
      });
    });

    if (result.length === 0) {
      window.showWarningMessage(`该网站暂无"${keyword}"`);
    }
    
  } catch (error) {
    console.error(error);
  }
  return result;
};

export const searchOnline = async (provider: DataProvider) => {
  const msg = await window.showInputBox({
    password: false,
    ignoreFocusOut: false,
    placeHolder: '请输入小说名字',
    prompt: ''
  });
  if (msg) {
    provider.treeNode = await search(msg);
    provider.refresh(true);
  } else {
    window.showWarningMessage(`请输入小说名字`);
  }
};

export const getChapter = async (pathStr: string) => {
  const result: SearchResult[] = [];
  try {
    const res = await request(`${DOMAIN}${pathStr}`);
    const $ = cheerio.load(res);
    $('#list dd').each((index: number, ele: any) => {
      const name = $(ele).find('a').text();
      const path = $(ele).find('a').attr().href;
      result.push({
        type: '.biquge',
        name,
        path,
        isDirectory: false,
      });
    });
  } catch (error) {
    console.error(error);
  }
  return result;
};

export const getContent = async (pathStr: string) => {
  let result: string = '';
  try {
    const res = await request(`${DOMAIN}${pathStr}`);
    const $ = cheerio.load(res);
    const html = $('#content').html();
    result = html ? html : '';
  } catch (error) {
    console.error(error);
  }
  return result;
};
