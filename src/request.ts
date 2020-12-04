import * as https from 'https';

export const request = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      console.log(url, res);
      let chunks = '';
      if (!res || res.statusCode !== 200) {
        reject(new Error('网络请求错误'));
        return;
      }
      res.on('data', (chunk) => {
        chunks += chunk.toString('utf8');
      });
      res.on('end', () => {
        resolve(chunks);
      });
    });
  });
};
