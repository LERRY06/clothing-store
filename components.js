// =========================================
// LÉVIA — COMPONENTS
// =========================================

async function loadComponent(selector, file) {

    const container =
        document.querySelector(selector);

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(file);

        if (!response.ok) {
            throw new Error(
                `Неуспешно зареждане на ${file}`
            );
        }

        container.innerHTML =
            await response.text();

    } catch (error) {

        console.error(
            `Грешка при зареждане на ${file}:`,
            error
        );

    }
}

// =========================================
// LOAD JAVASCRIPT
// =========================================

function loadScript(src) {

    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement("script");

            script.src = src;

            script.onload = resolve;
            script.onerror = reject;

            document.body.appendChild(
                script
            );

        }
    );

}

// =========================================
// LOAD COMPONENTS
// =========================================

async function loadComponents() {

    await Promise.all([

        loadComponent(
            "#header-container",
            "header.html"
        ),

        loadComponent(
            "#footer-container",
            "footer.html"
        )

    ]);

    // Header и footer вече са в DOM-а.
    // Сега зареждаме products.js и script.js
    // в правилния ред.

    try {

        await loadScript(
            "products.js"
        );

        await loadScript(
            "script.js"
        );

    } catch (error) {

        console.error(
            "Грешка при зареждане на JavaScript:",
            error
        );

    }

}

loadComponents();