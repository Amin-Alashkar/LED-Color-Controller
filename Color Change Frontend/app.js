// at school
// const API_BASE_URL = "http://10.220.1.123:8000";

// at home
const API_BASE_URL = "http://192.168.1.247:8000";

// DOM Elements
const colorDisplay    = document.getElementById('colorDisplay');
const lightOneBtn     = document.getElementById('lightOneBtn');
const offBtn          = document.getElementById('offBtn');
const off2Btn         = document.getElementById('off2Btn');
const colorPicker     = document.getElementById('colorPicker');

// نضيف هنا جلب العنصر .card لكي نُشغّل/نوقِف أنيميشن البطاقة
const cardElement     = document.querySelector('.card');

let isAnimationRunning = false;

/**
 * دالة مساعدة لإرسال طلب POST إلى الخادم.
 *
 * @param {string} endpoint  مسار الطلب (مثل "/animate" أو "/color" أو "/stop")
 * @param {object} data      جسم الطلب كـ JSON
 * @returns {Promise<object>}  يُرجع كائن JSON من الخادم أو كائن خطأ
 */
async function sendRequest(endpoint, data) {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (e) {
        console.error("API Error:", e);
        return { status: "error", message: e.message };
    }
}

/**
 * دالة لجلب الحالة الفعلية (اللون الحالي والأنيميشن الجاري) من الخادم.
 * تتواصل مع GET /state على الخادم وتُحدّث العرض المحليّ بناءً على الاستجابة.
 */
async function fetchAndApplyState() {
    try {
        // نرسل GET إلى الخادم للحصول على { animation, color }
        const res = await fetch(`${API_BASE_URL}/state`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const { animation, color } = await res.json();

        // إذا كان هناك لون ثابت (color ليس null)، نُحدّث العرض به
        if (color) {
            updateUI(color);
        } else {
            // لا لون ثابت: نظهر Off بالأسود
            updateUI('#000000');
        }

        // إذا كان هناك أنيميشن جارٍ مطابق لـ "fade_colors"
        if (animation === "fade_colors") {
            isAnimationRunning = true;
            lightOneBtn.classList.add('active');
            lightOneBtn.textContent = 'Fade Colors (Running)';
            // نضيف كلاس الأنيميشن للبطاقة إذا كان الأنيميشن جارٍ عند التحميل
            cardElement.classList.add('animate-fade');
        } else {
            // لا أنيميشن جارٍ
            isAnimationRunning = false;
            lightOneBtn.classList.remove('active');
            lightOneBtn.textContent = 'Fade Colors';
            // نتأكد من إزالة كلاس الأنيميشن من البطاقة
            cardElement.classList.remove('animate-fade');
        }
    } catch (err) {
        console.error("Error fetching state:", err);
        // في حال فشل جلب الحالة (مثلاً الخادم متوقف)، نعرض Off
        updateUI('#000000');
        isAnimationRunning = false;
        lightOneBtn.classList.remove('active');
        lightOneBtn.textContent = 'Fade Colors';
        // نتأكد من إزالة كلاس الأنيميشن من البطاقة
        cardElement.classList.remove('animate-fade');
    }
}

/**
 * عندما يضغط المستخدم على زر لون ثابت:
 * 1) إذا كان هناك أنيميشن جارٍ، نتوقّف عنه أولاً
 * 2) نحدّث العرض محليًا إلى اللون الجديد
 * 3) نرسل POST إلى /color مع { hex_color: color }
 */
async function changeColor(color) {
    if (isAnimationRunning) {
        await stopAnimation();
    }
    updateUI(color);
    await sendRequest("/color", { hex_color: color });
}

/**
 * دالة لإيقاف أي أنيميشن جارٍ:
 * 1) ترسل POST إلى /stop
 * 2) تغيّر المتغيرات المحليّة isAnimationRunning
 * 3) تُعيد نص الزر إلى "Fade Colors"
 * 4) تحدّث العرض إلى الأسود (#000000)
 * 5) تزيل كلاس الأنيميشن من البطاقة
 */
async function stopAnimation() {
    await sendRequest("/stop");
    isAnimationRunning = false;

    // نزيل كلاس الأنيميشن من البطاقة
    cardElement.classList.remove('animate-fade');

    lightOneBtn.classList.remove('active');
    lightOneBtn.textContent = 'Fade Colors';
    updateUI('#000000');
}

/**
 * عند الضغط على زر "Fade Colors":
 * - إذا كان أنيميشن جاريًا، نستدعي stopAnimation()
 * - غير ذلك:
 *   • نضبط isAnimationRunning = true
 *   • نضيف CSS class 'active' لكي يظهر التأثير البصري للزر
 *   • نغيّر نصّ الزرّ إلى 'Fade Colors (Running)'
 *   • نضيف كلاس الأنيميشن 'animate-fade' إلى البطاقة
 *   • نرسل POST إلى /animate مع { animation_type: "fade_colors" }
 */
async function startFadeAnimation() {
    if (isAnimationRunning) {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;

    // نضيف كلاس الأنيميشن للبطاقة
    cardElement.classList.add('animate-fade');

    lightOneBtn.classList.add('active');
    lightOneBtn.textContent = 'Fade Colors (Running)';
    await sendRequest("/animate", { animation_type: "fade_colors" });
}

/**
 * دالة لتحديث واجهة المستخدم محليًا إلى اللون المعطى:
 *   - خلفية الصفحة
 *   - دائرة العرض المركزية (colorDisplay)
 *   - قيمة colorPicker
 *   - النص داخل colorDisplay هو قيمة الـ hex الكبيرة
 */
function updateUI(color) {
    document.body.style.background     = color;
    document.body.style.boxShadow      = `0 0 80px ${color}80 inset`;
    colorDisplay.style.background      = color;
    colorDisplay.textContent           = color.toUpperCase();
    colorPicker.value                  = color;
}

// === ربط الأحداث ===
lightOneBtn.addEventListener("click", startFadeAnimation);
offBtn       .addEventListener("click", stopAnimation);
off2Btn      .addEventListener("click", stopAnimation);
colorPicker  .addEventListener("input", e => changeColor(e.target.value));

// عند تحميل الصفحة لأول مرة:
document.addEventListener("DOMContentLoaded", async () => {
    // 1) نجلب الحالة الحقيقية من الخادم
    await fetchAndApplyState();
});
