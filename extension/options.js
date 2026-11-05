const DEFAULT_APPROVER = 'MOHD NOR RIZAL BIN SULAIMAN';
const input = document.getElementById('approverName');
const saved = document.getElementById('saved');

chrome.storage.sync.get({ approverName: DEFAULT_APPROVER }, (res) => {
    input.value = res.approverName || DEFAULT_APPROVER;
});

document.getElementById('save').addEventListener('click', () => {
    const value = input.value.replace(/\s+/g, ' ').trim() || DEFAULT_APPROVER;
    chrome.storage.sync.set({ approverName: value }, () => {
        input.value = value;
        saved.hidden = false;
        setTimeout(() => { saved.hidden = true; }, 1500);
    });
});
