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

// نضيف هنا جلب العنصر .card لكي نغيّر لونه برمجياً
const cardElement     = document.querySelector('.card');

let isAnimationRunning = false;
// هذا المتغير يُستخدم لوقف حلقة الفيد الداخلية
let cardFadeAbort = false;

// نُعيد تعريف قائمة الألوان لكي تتطابق مع ترتيب الألوان في main.py
const JS_COLORS = [
  "#FFFFFF", // White
  "#FF0000", // Red
  "#0000FF", // Blue
  "#00FF00", // Green
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF"  // Cyan
];

// إعدادات درجات الفيد (يجب أن تتطابق مع FADE_STEPS و STEP_DELAY في Python)
const FADE_STEPS = 50;
const STEP_DELAY = 20; // ميلي ثانية (0.02 ثانية)

// دالة مساعدة للانتظار لمدّة STEP_DELAY
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    const res = await fetch(`${API_BASE_URL}/state`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { animation, color } = await res.json();

    // إذا كان هناك لون ثابت
    if (color) {
      updateUI(color);
    } else {
      updateUI('#000000');
    }

    // إذا كان الأنيميشن الجاري هو fade_colors
    if (animation === "fade_colors") {
      isAnimationRunning = true;
      lightOneBtn.classList.add('active');
      lightOneBtn.textContent = 'Fade Colors (Running)';
      // نبدأ حلقة الـ fade الخاصة بالبطاقة
      startCardFadeLoop();
    } else {
      isAnimationRunning = false;
      lightOneBtn.classList.remove('active');
      lightOneBtn.textContent = 'Fade Colors';
      // نوقف حلقة البطاقة إذا كانت تعمل
      stopCardFadeLoop();
    }
  } catch (err) {
    console.error("Error fetching state:", err);
    updateUI('#000000');
    isAnimationRunning = false;
    lightOneBtn.classList.remove('active');
    lightOneBtn.textContent = 'Fade Colors';
    stopCardFadeLoop();
  }
}

/**
 * دالة لتكرار مؤثر الـ fade على البطاقة برمجياً.
 * تستعمل نفس التدرّجات والمُدّد الموجودة في main.py عشان تكون مُتناسقة.
 */
async function startCardFadeLoop() {
  // إذا كانت الحلقة تعمل مسبقاً، لا نعيد تشغيلها
  if (cardFadeAbort === false && isAnimationRunning) return;

  cardFadeAbort = false;

  // سنستمر في التكرار ما دام isAnimationRunning true ولم يُطلب الإيقاف
  while (!cardFadeAbort) {
    for (const hexColor of JS_COLORS) {
      if (cardFadeAbort) break;
      // نحلّ اللون الست عشري إلى قيم R,G,B عشرية
      const rTarget = parseInt(hexColor.slice(1, 3), 16);
      const gTarget = parseInt(hexColor.slice(3, 5), 16);
      const bTarget = parseInt(hexColor.slice(5, 7), 16);

      // Fade-in (من 0 إلى اللون المستهدف)
      for (let step = 0; step < FADE_STEPS; step++) {
        if (cardFadeAbort) break;
        const factor = step / (FADE_STEPS - 1);
        const r = Math.round(rTarget * factor);
        const g = Math.round(gTarget * factor);
        const b = Math.round(bTarget * factor);
        const intermediateHex = rgbToHex(r, g, b);
        // نُحدّث البطاقة وباقي واجهة المستخدم
        updateCardColor(intermediateHex);
        await sleep(STEP_DELAY);
      }
      if (cardFadeAbort) break;

      // Fade-out (من اللون المستهدف إلى 0)
      for (let step = 0; step < FADE_STEPS; step++) {
        if (cardFadeAbort) break;
        const factor = 1 - (step / (FADE_STEPS - 1));
        const r = Math.round(rTarget * factor);
        const g = Math.round(gTarget * factor);
        const b = Math.round(bTarget * factor);
        const intermediateHex = rgbToHex(r, g, b);
        updateCardColor(intermediateHex);
        await sleep(STEP_DELAY);
      }
      if (cardFadeAbort) break;
    }
  }
}

/**
 * دالة لوقف حلقة الفيد على البطاقة.
 */
function stopCardFadeLoop() {
  cardFadeAbort = true;
  // بعد الإيقاف، نُعيد البطاقة للوضع الافتراضي (خلفية شفافّة أو لون ثابت)
  cardElement.style.background = "";
}

/**
 * عند الضغط على زر لون ثابت:
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
 * 5) توقف حلقة البطاقة
 */
async function stopAnimation() {
  await sendRequest("/stop");
  isAnimationRunning = false;
  lightOneBtn.classList.remove('active');
  lightOneBtn.textContent = 'Fade Colors';
  updateUI('#000000');
  stopCardFadeLoop();
}

/**
 * عند الضغط على زر "Fade Colors":
 * - إذا كان أنيميشن جاريًا، نستدعي stopAnimation()
 * - غير ذلك:
 *   • نضبط isAnimationRunning = true
 *   • نضيف CSS class 'active' لكي يظهر التأثير البصري للزر
 *   • نغيير نصّ الزرّ إلى 'Fade Colors (Running)'
 *   • نبدأ حلقة الفيد الخاصة بالبطاقة
 *   • نرسل POST إلى /animate مع { animation_type: "fade_colors" }
 */
async function startFadeAnimation() {
  if (isAnimationRunning) {
    await stopAnimation();
    return;
  }
  isAnimationRunning = true;
  lightOneBtn.classList.add('active');
  lightOneBtn.textContent = 'Fade Colors (Running)';

  // نبدأ حلقات الـ fade للبطاقة
  startCardFadeLoop();

  await sendRequest("/animate", { animation_type: "fade_colors" });
}

/**
 * دالة لتحديث واجهة المستخدم محليًا إلى اللون المعطى:
 *   - خلفية الصفحة
 *   - دائرة العرض المركزية (colorDisplay)
 *   - قيمة colorPicker
 *   - النص داخل colorDisplay هو قيمة الـ hex الكبيرة
 *   - لون البطاقة نفسه لا يتغيّر هنا (لأنه مُعالجة عبر حلقات JS منفصلة)
 */
function updateUI(color) {
  document.body.style.background     = color;
  document.body.style.boxShadow      = `0 0 80px ${color}80 inset`;
  colorDisplay.style.background      = color;
  colorDisplay.textContent           = color.toUpperCase();
  colorPicker.value                  = color;
}

/**
 * دالة لتحديث لون البطاقة فقط (تُستخدم ضمن حلقات الفيد).
 */
function updateCardColor(hex) {
  cardElement.style.background = hex;
  // لو أردنا أن تُظهر الدائرة والنص نفس اللون خلال الفيد:
  document.body.style.background     = hex;
  document.body.style.boxShadow      = `0 0 80px ${hex}80 inset`;
  colorDisplay.style.background      = hex;
  colorDisplay.textContent           = hex.toUpperCase();
  colorPicker.value                  = hex;
}

/**
 * دالة مساعدة لتحويل قيم R,G,B عشرية إلى سترينج ست عشري "#RRGGBB".
 */
function rgbToHex(r, g, b) {
  const toHex = v => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// === ربط الأحداث ===
lightOneBtn.addEventListener("click", startFadeAnimation);
offBtn       .addEventListener("click", stopAnimation);
off2Btn      .addEventListener("click", stopAnimation);
colorPicker  .addEventListener("input", e => changeColor(e.target.value));

// عند تحميل الصفحة لأول مرة:
document.addEventListener("DOMContentLoaded", async () => {
  // نجلب الحالة الحقيقية من الخادم ونضبط الواجهة على أساسها
  await fetchAndApplyState();
});
