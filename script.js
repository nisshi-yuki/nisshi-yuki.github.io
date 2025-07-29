async function loadProjects() {
    const res = await fetch("projects.json");
    const projects = await res.json();

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
            iframe.src = project.url;

            const descRes = await fetch(project.description);
            const descText = (await descRes.text()).replace(/\n/g, "<br>");
            description.innerHTML = `<p>${descText}</p>`;

            closeBtn.style.display = "block"; // ボタンを表示
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
        description.innerHTML = "<p>表示する作品を選択してください。</p>";

        // ボタン非表示
        closeBtn.style.display = "none";
    });
}

loadProjects();
