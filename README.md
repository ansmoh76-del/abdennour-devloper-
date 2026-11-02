# عبد النور زقراوي — Portfolio

موقع بورتفوليو عربي (RTL) بتصميم داكن وذهبي، مبني بـ HTML / CSS / JavaScript بدون أي أدوات بناء.

## الهيكل
```
index.html
css/style.css
js/config.js   ← إعدادات JSONBin (عامة)
js/main.js
.nojekyll
```

## النشر على GitHub Pages
1. أنشئ مستودعًا جديدًا وارفع كل الملفات في الجذر.
2. Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `(root)` → Save.
3. بعد دقيقة يصبح الموقع على `https://USERNAME.github.io/REPO/`.

## إدارة الأعمال (JSONBin)
- اجعل الـ Bin عامًا للقراءة أو ضع مفتاح قراءة فقط في `js/config.js` (`readKey`).
- **لا تضع مفتاح الكتابة في الكود.** لإضافة عمل: اضغط على الشعار 5 مرات (أو `Ctrl+Shift+A`)، ثم «إضافة عمل»، وسيُطلب منك مفتاح الكتابة عند الحفظ ويبقى في الجلسة فقط.
