Fonctionnalité: Validation du créneau demandé
  En tant que patient
  Je veux que ma demande de rendez-vous soit refusée si le créneau n'est pas valide
  Afin de ne pas réserver un horaire incohérent

  Scénario: Refus d'une demande dont la fin précède le début
    Étant donné une demande de rendez-vous avec un début dans le futur et une fin avant ce début
    Quand le patient envoie la demande
    Alors l'API répond avec le code 400

  Scénario: Refus d'une demande dont le début est déjà passé
    Étant donné une demande de rendez-vous dont le début est déjà passé
    Quand le patient envoie la demande
    Alors l'API répond avec le code 400