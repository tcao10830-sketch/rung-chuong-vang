(function () {
  "use strict";
  var deferredPrompt = null;
  var installButton = null;
  var isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (isStandalone) return;

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function addInstallButton() {
    if (installButton || !document.body) return;
    installButton = document.createElement("button");
    installButton.type = "button";
    installButton.textContent = "⬇️ Cài ứng dụng";
    installButton.setAttribute("aria-label", "Cài đặt ứng dụng Rung Chuông Vàng");
    installButton.style.cssText = [
      "position:fixed","right:18px","bottom:18px","z-index:9999",
      "border:2px solid #24304a","border-radius:999px","padding:12px 18px",
      "background:#ffd84d","color:#24304a","font:900 15px Nunito, sans-serif",
      "box-shadow:0 5px 0 rgba(36,48,74,.22)","cursor:pointer"
    ].join(";");
    installButton.addEventListener("click", async function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        var choice = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (choice && choice.outcome === "accepted") installButton.remove();
      } else if (isIOS) {
        window.alert('Để cài ứng dụng trên iPhone/iPad: chạm nút Chia sẻ trong Safari, chọn “Thêm vào MH chính”, rồi chạm “Thêm”.');
      }
    });
    document.body.appendChild(installButton);
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    addInstallButton();
  });

  window.addEventListener("appinstalled", function () {
    if (installButton) installButton.remove();
    installButton = null;
    deferredPrompt = null;
  });

  if (isIOS) addInstallButton();
})();