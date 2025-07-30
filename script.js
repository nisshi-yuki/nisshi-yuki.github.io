async function loadProjects() {

    const listElement = document.getElementById("project-list");

    const emptyDisplay = document.querySelector(".empty-display");
    const container = document.querySelector(".app-display");

    let projects = [];
    try {
        const res = await fetch("projects.json");
        if (!res.ok) {
            throw new Error(`projects.jsonの読み込みエラー: ${res.status} ${res.statusText}`);
        }
        projects = await res.json();
    } catch (error) {
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

    const description = container.querySelector("#app-description");
    const emptyDescription = emptyDisplay.querySelector("#app-description");
    const closeBtn = document.getElementById("close-app-btn");
    const initIFrame = document.getElementById("app-frame");
    initIFrame.title = defaultTitle;
    initIFrame.src = "about:blank";
    setIframe(initIFrame);

    container.style.display = "none"; // 初期状態では非表示
    emptyDisplay.style.display = "block"; // 空の表示を表示

    description.textContent = defaultDescription;
    emptyDescription.textContent = defaultDescription;

    function resetIframe() { 
        const oldIframe = document.getElementById("app-frame");
        if (oldIframe) {
            oldIframe.remove();
        }

        const newIframe = document.createElement("iframe");
        newIframe.src = "about:blank"; // 非表示状態 or 未設定
        newIframe.title = defaultTitle;
        setIframe(newIframe);

        container.insertBefore(newIframe, closeBtn, description);

        // 説明初期化
        description.textContent = defaultDescription;

        // ボタン非表示
        closeBtn.style.display = "none";

        container.style.display = "none"; // コンテナを非表示
        emptyDisplay.style.display = "block"; // 空の表示を表示
    }

    for (const project of projects) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = project.title;

        a.addEventListener("click", async (e) => {

            e.preventDefault();

            let iframe = document.getElementById("app-frame");

            if (iframe == null || iframe.src != "" && iframe.src != "about:blank") { 
                resetIframe();
                iframe = document.getElementById("app-frame");
            }

            container.style.display = "block"; // コンテナを表示

            try {
                const descRes = await fetch(project.description);
                if (!descRes.ok) {
                    throw new Error(`プロジェクトの説明の取得に失敗しました: ${descRes.statusText}`);
                }
                description.textContent = await descRes.text();

                iframe.src = project.url;
                iframe.title = project.title;

                closeBtn.style.display = "block"; // ボタンを表示

                emptyDisplay.style.display = "none"; // 空の表示を非表示
            } catch (error) {
                description.textContent = "プロジェクトの説明の読み込みに失敗しました。";
                closeBtn.style.display = "none"; // ボタンを非表示
                iframe.src = "about:blank"; // iframeを非表示状態にする
                emptyDisplay.style.display = "block"; // 空の表示を表示
                container.style.display = "none"; // コンテナを非表示
            }
        });

        li.appendChild(a);
        listElement.appendChild(li);
    }

    // 閉じるボタン動作
    closeBtn.addEventListener("click", () => {

        resetIframe();
    });
}

loadProjects();
