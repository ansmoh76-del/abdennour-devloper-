window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 600);
});

window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

const secretLogo = document.getElementById('secretLogo');
const secretBtn = document.getElementById('secretBtn');
let logoClicks = 0;
let logoTimer = null;

function showSecret() {
    secretBtn.classList.add('visible');
    showToast('تم تفعيل الزر السري');
}

secretLogo.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => logoClicks = 0, 1500);
    if (logoClicks >= 5) {
        logoClicks = 0;
        showSecret();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        showSecret();
    }
});

const addModal = document.getElementById('addModal');
secretBtn.addEventListener('click', () => addModal.classList.add('active'));
document.getElementById('cancelModalBtn').addEventListener('click', () => {
    addModal.classList.remove('active');
    clearForm();
});
addModal.addEventListener('click', (e) => {
    if (e.target === addModal) {
        addModal.classList.remove('active');
        clearForm();
    }
});

function clearForm() {
    document.getElementById('workName').value = '';
    document.getElementById('workDesc').value = '';
    document.getElementById('workImage').value = '';
}

async function loadWorks() {
    try {
        const headers = {};
        if (JSONBIN_CONFIG.readKey) headers["X-Access-Key"] = JSONBIN_CONFIG.readKey;
        const res = await fetch(`${JSONBIN_CONFIG.baseUrl}/${JSONBIN_CONFIG.binId}/latest`, { headers });
        if (!res.ok) throw new Error("Load failed");
        const data = await res.json();
        return data.record.works || [];
    } catch (err) {
        console.error("Load error:", err);
        return [];
    }
}

// مفتاح الكتابة يُطلب منك عند الحفظ ويبقى في الجلسة فقط (لا يُخزَّن في الكود)
function getWriteKey() {
    let key = sessionStorage.getItem('jsonbin_write_key');
    if (!key) {
        key = (prompt('أدخل مفتاح الكتابة (JSONBin Access Key):') || '').trim();
        if (key) sessionStorage.setItem('jsonbin_write_key', key);
    }
    return key;
}

async function saveWorks(works) {
    try {
        const writeKey = getWriteKey();
        if (!writeKey) return false;
        const res = await fetch(`${JSONBIN_CONFIG.baseUrl}/${JSONBIN_CONFIG.binId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Access-Key": writeKey
            },
            body: JSON.stringify({ works: works })
        });
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) sessionStorage.removeItem('jsonbin_write_key');
            throw new Error("Save failed");
        }
        return true;
    } catch (err) {
        console.error("Save error:", err);
        return false;
    }
}

async function displayWorks() {
    const grid = document.getElementById('worksGrid');
    const works = await loadWorks();
    if (!works || works.length === 0) {
        grid.innerHTML = '<div class="loading">لا توجد أعمال بعد. أضف أول عمل!</div>';
        return;
    }
    grid.innerHTML = works.map(w => `
        <div class="work-card">
            <div class="work-image">
                ${safeUrl(w.image) ? `<img src="${escapeHTML(safeUrl(w.image))}" alt="${escapeHTML(w.name)}" loading="lazy" onerror="this.parentElement.textContent='🖥️'">` : '🖥️'}
            </div>
            <div class="work-info">
                <h3>${escapeHTML(w.name)}</h3>
                <p>${escapeHTML(w.desc)}</p>
            </div>
        </div>
    `).join('');
}

function safeUrl(u) {
    return /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '';
}

function escapeHTML(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

document.getElementById('saveWorkBtn').addEventListener('click', async () => {
    const name = document.getElementById('workName').value.trim();
    const desc = document.getElementById('workDesc').value.trim();
    const image = document.getElementById('workImage').value.trim();

    if (!name || !desc) {
        showToast('المرجو ملء الاسم والوصف');
        return;
    }

    const btn = document.getElementById('saveWorkBtn');
    btn.textContent = 'جاري الحفظ...';
    btn.disabled = true;

    const works = await loadWorks();
    works.push({ name, desc, image });
    const ok = await saveWorks(works);

    btn.textContent = 'حفظ';
    btn.disabled = false;

    if (ok) {
        showToast('تمت إضافة العمل بنجاح');
        addModal.classList.remove('active');
        clearForm();
        displayWorks();
    } else {
        showToast('فشل الحفظ، تحقق من الاتصال');
    }
});

let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

displayWorks();
