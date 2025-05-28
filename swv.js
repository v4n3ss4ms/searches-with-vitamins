const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.querySelectorAll('button.hBtn').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.value;

    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    const url = new URL(tab.url);
    if (url.hostname !== 'www.linkedin.com' || !url.pathname.startsWith('/jobs/search')){
      return;
    }

    const newUrl = updateUrlParameter(tab.url, 'f_TPR', value);
    browserAPI.tabs.update(tab.id, { url: newUrl });
  });
});

function updateUrlParameter(url, param, value) {
  const urlObj = new URL(url);
  urlObj.searchParams.delete('start');
  urlObj.searchParams.set(param, value);
  return urlObj.toString();
}


document.getElementById('searchWithGD').addEventListener('click', async () => {
  const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  const [{ result: selectedText }] = await browserAPI.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString().trim()
    });

    if (!selectedText) {
      return;
    }

    const query = encodeURIComponent(`${selectedText} glassdoor`);
    const searchUrl = `https://www.google.com/search?q=${query}`;

    await browserAPI.tabs.create({
      url: searchUrl,
      active: false,
      windowId: tab.windowId
    });
});
