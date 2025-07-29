async function loadProjects() {

    const listElement = document.getElementById("project-list");

    let projects = [];
    try {
        const res = await fetch("projects.json");
        if (!res.ok) {
            throw new Error(`projects.jsonの読み込みエラー: ${res.status} ${res.statusText}`);
        }
        projects = await res.json();
    } catch (error) {
        console.error("projects.jsonの読み込みエラー:", error);

        listElement.textContent = "プロジェクトの読み込みに失敗しました。";
        return;
    }

    const defaultDescription = "表示する作品を選択してください。";
    const defaultTitle = "Unity Webアプリ";

    function setIframe(frame) {
        frame.id = "app-frame";
        frame.allowFullscreen = true;
        frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    }

    const description = document.getElementById("app-description");
    const closeBtn = document.getElementById("close-app-btn");
    const initIFrame = document.getElementById("app-frame");
    initIFrame.title = defaultTitle;
    initIFrame.src = "";
    setIframe(initIFrame);

    description.textContent = defaultDescription;

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
                iframe.title = project.title;

                closeBtn.style.display = "block"; // ボタンを表示
            } catch (error) {
                console.error("プロジェクト説明の取得エラー:", error);
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

        const container = document.querySelector(".app-display");

        if (!container) {
            console.error(".app-displayは見つかりませんでした。");
            return;
        }


        const oldIframe = document.getElementById("app-frame");
        if (oldIframe) {
            oldIframe.remove();
        }

        const newIframe = document.createElement("iframe");
        newIframe.src = ""; // 非表示状態 or 未設定
        newIframe.title = defaultTitle;
        setIframe(newIframe);

        container.insertBefore(newIframe, description);

        // 説明初期化
        description.textContent = defaultDescription;

        // ボタン非表示
        closeBtn.style.display = "none";
    });
}

loadProjects();
