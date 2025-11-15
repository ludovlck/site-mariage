// engine.js – version debug

console.log("[engine.js] Module chargé depuis GitHub");

export default (element) => {
  console.log("[engine.js] Fonction default() appelée");
  console.log("[engine.js] element passé au script:", element);

  // 1. Récupérer invite_id dans l'URL
  let inviteId = null;
  try {
    const urlParams = new URLSearchParams(window.location.search || "");
    inviteId = urlParams.get("id");
    console.log("[engine.js] ID récupéré dans l'URL:", inviteId);
  } catch (e) {
    console.error("[engine.js] Erreur en lisant l'URL:", e);
    return;
  }

  if (!inviteId) {
    console.warn("[engine.js] Aucun invite_id trouvé dans l'URL");
    return;
  }

  console.log("[engine.js] Recherche des infos pour invite_id:", inviteId);

  // 2. Appel API Google Apps Script
  const url =
    "https://script.google.com/macros/s/AKfycbzL2OdNkqbnc71lzQHHXhTt9zfqfrAWVrdf1tO-lj4Rv0g-yk3sdzgcovnRhAdi8Nj0Sw/exec?id=" +
    encodeURIComponent(inviteId);

  console.log("[engine.js] Appel API:", url);

  fetch(url)
    .then((res) => {
      console.log("[engine.js] Réponse brute fetch:", res);
      if (!res.ok) {
        console.error("[engine.js] Réponse non OK:", res.status, res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      console.log("[engine.js] Données JSON reçues:", data);

      if (!data || data.length === 0) {
        console.warn("[engine.js] Aucun invité trouvé pour cet ID:", inviteId);
        return;
      }

      // 3. Nombre total d'invités (nb de lignes)
      const nbPersonnes = data.length;

      // 4. Liste des noms
      const noms = data.map((p) => p.nom_personne);

      // 5. Affichage console
      console.log("➡️ invite_id:", inviteId);
      console.log("➡️ Nombre de personnes:", nbPersonnes);
      console.log("➡️ Noms des invités:", noms);

      // 6. (optionnel) Affichage visuel dans la page
      if (element) {
        element.innerHTML = `
          <div style="padding:10px;background:#f4f4f4;border-radius:4px;">
            <div><strong>ID :</strong> ${inviteId}</div>
            <div><strong>Personnes :</strong> ${nbPersonnes}</div>
            <div><strong>Noms :</strong> ${noms.join(", ")}</div>
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error("[engine.js] Erreur API Google Sheets:", err);
    });
};
