export default (element) => {
  // 1. Récupérer invite_id dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const inviteId = urlParams.get("id");

  if (!inviteId) {
    console.warn("Aucun invite_id trouvé dans l'URL");
    return;
  }

  console.log("Recherche des infos pour invite_id:", inviteId);

  // 2. Appel de ton API Google Apps Script
  fetch(
    "https://script.google.com/macros/s/AKfycbzL2OdNkqbnc71lzQHHXhTt9zfqfrAWVrdf1tO-lj4Rv0g-yk3sdzgcovnRhAdi8Nj0Sw/exec?id=" +
      inviteId
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.length === 0) {
        console.warn("Aucun invité trouvé pour cet ID:", inviteId);
        return;
      }

      const nbPersonnes = data.length;
      const noms = data.map((p) => p.nom_personne);

      console.log("➡️ invite_id:", inviteId);
      console.log("➡️ Nombre de personnes:", nbPersonnes);
      console.log("➡️ Noms des invités:", noms);

      if (element) {
        element.innerHTML = `
          <div style="padding:10px;background:#f4f4f4">
            <strong>ID :</strong> ${inviteId}<br>
            <strong>Personnes :</strong> ${nbPersonnes}<br>
            <strong>Noms :</strong> ${noms.join(", ")}
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error("Erreur API Google Sheets:", err);
    });
};
