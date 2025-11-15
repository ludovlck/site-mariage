// DEBUG – s'assure que le fichier est bien chargé
console.log("[engine.js] Module chargé depuis GitHub");

export default (element) => {
  console.log("[engine.js] Fonction default() appelée");
  console.log("[engine.js] element passé:", element);

  // Lire l'ID dans l'URL
  const params = new URLSearchParams(window.location.search);
  const inviteId = params.get("id");
  console.log("[engine.js] inviteId lu:", inviteId);

  if (!inviteId) {
    console.warn("[engine.js] Aucun ID trouvé dans l'URL");
    return;
  }

  const url =
    "https://script.google.com/macros/s/AKfycbzL2OdNkqbnc71lzQHHXhTt9zfqfrAWVrdf1tO-lj4Rv0g-yk3sdzgcovnRhAdi8Nj0Sw/exec?id=" +
    encodeURIComponent(inviteId);

  console.log("[engine.js] Appel API:", url);

  fetch(url)
    .then((res) => {
      console.log("[engine.js] fetch response:", res);
      return res.json();
    })
    .then((data) => {
      console.log("[engine.js] JSON reçu:", data);

      if (!data || !data.length) {
        console.warn("[engine.js] Aucun invité trouvé");
        return;
      }

      const nbPersonnes = data.length;
      const noms = data.map((p) => p.nom_personne);

      console.log("➡️ invite_id:", inviteId);
      console.log("➡️ Nombre de personnes:", nbPersonnes);
      console.log("➡️ Noms:", noms);

      if (element) {
        element.innerHTML = `
          <div style="background:#eee;padding:10px;border-radius:6px;">
            <div><strong>ID:</strong> ${inviteId}</div>
            <div><strong>Personnes:</strong> ${nbPersonnes}</div>
            <div><strong>Noms:</strong> ${noms.join(", ")}</div>
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error("[engine.js] ERREUR FETCH:", err);
    });
};
