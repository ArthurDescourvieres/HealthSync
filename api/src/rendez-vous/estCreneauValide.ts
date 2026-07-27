export function estCreneauValide(debut: Date, fin: Date): boolean {
  const maintenant = new Date()

  return debut > maintenant && fin > debut;
}