async function loadProjects() {

    let projects = [];
    try {
        const res = await fetch("projects.json");
        if (!res.ok) {
            throw new Error(`projects.jsonの読み込みエラー: ${res.status} ${res.statusText}`);
        }
        projects = await res.json();
    } catch (error) {
        console.error("projects.jsonの読み込みエラー:", error);
        const listElement = document.getElementById("project-list");
        listElement.innerHTML = "<p>プロジェクトの読み込みに失敗しました。</p>";
        return;
    }

    const listElement = document.getElementById("project-list");
    const description = document.getElementById("app-description");
    const closeBtn = document.getElementById("close-app-btn");

    for (const project of projects) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = project.title;

        a.addEventListener("click", async (e) => {
            e.preventDefault();

            const iframe = document.getElementById("app-frame");

            try {
                const descRes = await fetch(project.description);
                if (!descRes.ok) {
                    throw new Error(`プロジェクトの説明の取得に失敗しました: ${descRes.statusText}`);
                }
                description.textContent = await descRes.text();

                iframe.src = project.url;

                closeBtn.style.display = "block"; // ボタンを表示
            } catch (error) {
                console.error("Error fetching project description:", error);
                description.textContent = "プロジェクトの説明の読み込みに失敗しました。";
                closeBtn.style.display = "none"; // ボタンを非表示
                iframe.src = ""; // iframeを非表示状態にする
            }
        });

        li.appendChild(a);
        listElement.appendChild(li);
    }

    // 閉じるボタン動作
    closeBtn.addEventListener("click", () => {

        const description = document.getElementById("app-description");
        const container = document.querySelector(".app-display");


        const oldIframe = document.getElementById("app-frame");
        if (oldIframe) {
            oldIframe.remove();
        }

        const newIframe = document.createElement("iframe");
        newIframe.id = "app-frame";
        newIframe.allowFullscreen = true;
        newIframe.src = ""; // 非表示状態 or 未設定

        container.insertBefore(newIframe, description);

        // 説明初期化
        description.textContent = "表示する作品を選択してください。";

        // ボタン非表示
        closeBtn.style.display = "none";
    });
}

loadProjects();
