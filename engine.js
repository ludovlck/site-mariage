export default (element) => {
  // 1. Récupérer invite_id dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const inviteId = urlParams.get("id");

  if (!inviteId) {
    console.warn("Aucun invite_id trouvé dans l'URL");
    return;
  }

  console.log("Recherche des infos pour invite_id:", inviteId);

  // 2. Appel API Google Apps Script
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

      // 3. Nombre total d'invités
      const nbPersonnes = data.length;

      // 4. Liste noms
      const noms = data.map((p) => p.nom_personne);

      // 5. Affichage console EXACTEMENT comme avant
      console.log("➡️ invite_id:", inviteId);
      console.log("➡️ Nombre de personnes:", nbPersonnes);
      console.log("➡️ Noms des invités:", noms);

      // 6. (Optionnel) injection dans element
      if (element) {
        element.innerHTML = `
          <div style="padding:6px;background:#eee;border-radius:4px;margin:4px 0;">
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
