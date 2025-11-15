console.log("[engine.js] DÉBUT. element =", element);

// 1. Lire invite ID
const params = new URLSearchParams(window.location.search);
const inviteId = params.get("id");

console.log("[engine.js] inviteId =", inviteId);

if (!inviteId) {
  console.warn("[engine.js] Aucun ID trouvé");
  if (element) {
    element.innerHTML = "<div style='color:red'>Aucun ID trouvé dans l'URL.</div>";
  }
  return;
}

// 2. Appel API Google Scripts
const url =
  "https://script.google.com/macros/s/AKfycbzL2OdNkqbnc71lzQHHXhTt9zfqfrAWVrdf1tO-lj4Rv0g-yk3sdzgcovnRhAdi8Nj0Sw/exec?id=" +
  encodeURIComponent(inviteId);

console.log("[engine.js] Fetch:", url);

fetch(url)
  .then((res) => {
    console.log("[engine.js] Response:", res);
    return res.json();
  })
  .then((data) => {
    console.log("[engine.js] JSON:", data);

    if (!data || !data.length) {
      console.warn("[engine.js] Aucun invité trouvé");
      if (element) {
        element.innerHTML = "<div style='color:orange'>Aucun invité trouvé.</div>";
      }
      return;
    }

    const nb = data.length;
    const noms = data.map((p) => p.nom_personne);

    console.log("➡️ ID:", inviteId);
    console.log("➡️ Nombre:", nb);
    console.log("➡️ Noms:", noms);

    if (element) {
      element.innerHTML = `
        <div style="background:#eee;padding:10px;border-radius:6px;">
          <strong>ID:</strong> ${inviteId}<br>
          <strong>Personnes:</strong> ${nb}<br>
          <strong>Noms:</strong> ${noms.join(", ")}
        </div>
      `;
    }
  })
  .catch((err) => {
    console.error("[engine.js] ERREUR:", err);
    element.innerHTML = "<div style='color:red'>Erreur API.</div>";
  });
