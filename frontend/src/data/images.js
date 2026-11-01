/**
 * All website imagery in one place.
 * These are royalty-free sample photographs (Unsplash) used for demonstration
 * and inspiration only. Replace them with your own event photographs as they
 * become available – either here or via the admin dashboard's gallery manager.
 *
 * Every <SmartImage> falls back to an on-brand illustration if a URL fails,
 * so the site never shows a broken image.
 */
const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const img = {
  hero: u('photo-1519225421980-715cb0215aed', 2000),
  heroAlt: u('photo-1469371670807-013ccf25f16a', 1600),
  tableDecor: u('photo-1478146896981-b80fe463b330'),
  weddingTable: u('photo-1511795409834-ef04bbd61622'),
  floralDecor: u('photo-1606800052052-a08af7148866'),
  balloons: u('photo-1530103862676-de8c9debad1d'),
  balloonsParty: u('photo-1513151233558-d860c5398176'),
  confetti: u('photo-1464366400600-7168b8af9bc3'),
  birthdayCake: u('photo-1464349095431-e9a21285b5f3'),
  sparklers: u('photo-1527529482837-4698179dc6ce'),
  couple: u('photo-1519741497674-611481863552'),
  couple2: u('photo-1465495976277-4387d4b0b4c6'),
  couple3: u('photo-1520854221256-17451cc331bf'),
  rings: u('photo-1515934751635-c81c6bc9a2d8'),
  dinner: u('photo-1414235077428-338989a2e8c0'),
  catering: u('photo-1555244162-803834f70033'),
  partyLights: u('photo-1505236858219-8359eb29e329'),
  partyCrowd: u('photo-1492684223066-81342ee5ff30'),
  conference: u('photo-1540575467063-178a50c2df87'),
  corporate: u('photo-1511578314322-379afb476865'),
  celebration: u('photo-1517457373958-b7bdd4587205'),
  lights: u('photo-1533174072545-7a4b6ad7a6c3'),
  drinks: u('photo-1470337458703-46ad1756a187'),
  babyShower: u('photo-1522673607200-164d1b6ce486'),
  pastel: u('photo-1558636508-e0db3814bd1d'),
  planning: u('photo-1478146059778-26028b07395a'),
};
