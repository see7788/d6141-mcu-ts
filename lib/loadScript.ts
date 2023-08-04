const loadScript = (url: string, retries = 0): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const script = document.createElement('script');
        script.textContent = request.responseText;
        document.head.appendChild(script);
        resolve();
      } else {
        if (retries > 0) {
          retries--;
          loadScript(url, retries).then(resolve).catch(reject);
        } else {
          reject(new Error(`Failed to load script: ${url}`));
        }
      }
    };
    request.onerror = () => {
      if (retries > 0) {
        retries--;
        loadScript(url, retries).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to load script: ${url}`));
      }
    };
    request.send();
  });
}
export default loadScript