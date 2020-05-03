export class LancerGame extends Game {
  // Create a lancer namespace
  lancer: object;
}


// temporary - should have separate subclasses based on player/npc etc..
interface LancerActorData extends ActorData {
  data: {
    mech: {
      evasion: { value: number }
      edef: { value: number }
    }
  }
}

export class LancerActor extends Actor {
  data: LancerActorData
}