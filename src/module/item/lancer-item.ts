import {
  LancerSkillItemData,
  LancerTalentItemData,
  LancerCoreBonusItemData,
  LancerLicenseItemData,
  LancerPilotArmorItemData,
  LancerPilotWeaponItemData,
  LancerPilotGearItemData,
  LancerFrameItemData,
  LancerMechSystemItemData,
  LancerMechWeaponItemData,
  LancerNPCFeatureItemData,
  LancerNPCTemplateItemData,
  LancerNPCClassItemData,
  DamageData,
  RangeData,
  TagData,
  NPCDamageData,
} from "../interfaces";
import { LANCER } from "../config";
import {
  DamageType,
  EffectType,
  NpcFeatureType,
  RangeType,
  SystemType,
  WeaponSize,
  WeaponType,
} from "machine-mind";
const lp = LANCER.log_prefix;

export type LancerItemType =
  | "skill"
  | "talent"
  | "core_bonus"
  | "license"
  | "pilot_armor"
  | "pilot_weapon"
  | "pilot_gear"
  | "frame"
  | "mech_weapon"
  | "mech_system"
  | "npc_class"
  | "npc_template"
  | "npc_feature";

export function lancerItemInit(data: any) {
  console.log(`${lp} Initializing new ${data.type}`);
  let img: string = "systems/lancer/assets/icons/";

  let type = data.type as LancerItemType | "_doesnotmatter_justhelpstypecheck";
  if (type == "skill") {
    img += "skill.svg";
  } else if (type === "talent") {
    img += "talent.svg";
  } else if (type === "core_bonus") {
    img += "corebonus.svg";
  } else if (type === "license") {
    img += "license.svg";
  } else if (type === "pilot_armor") {
    img += "shield_outline.svg";
  } else if (type === "pilot_weapon") {
    img += "weapon.svg";
  } else if (type === "pilot_gear") {
    img += "generic_item.svg";
  } else if (type === "frame") {
    img += "frame.svg";
  } else if (type === "mech_weapon") {
    img += "weapon.svg";
  } else if (type === "mech_system") {
    img += "system.svg";
    // TODO: set default system type
  } else if (type === "npc_class") {
    img += "npc_class.svg";
  } else if (type === "npc_template") {
    img += "npc_template.svg";
  } else if (type === "npc_feature") {
    if (!data.feature_type) {
      img += "trait.svg";
      mergeObject(data, {
        // Default new NPC features to traits
        "data.feature_type": NpcFeatureType.Trait,
      });
    }
  } else {
    img += "generic_item.svg";
  }

  mergeObject(data, {
    // Initialize image
    img: img,
  });
}

export class LancerItem extends Item {
  data!:
    | LancerSkillItemData
    | LancerTalentItemData
    | LancerCoreBonusItemData
    | LancerLicenseItemData
    | LancerPilotArmorItemData
    | LancerPilotWeaponItemData
    | LancerPilotGearItemData
    | LancerFrameItemData
    | LancerMechSystemItemData
    | LancerMechWeaponItemData
    | LancerNPCFeatureItemData
    | LancerNPCTemplateItemData
    | LancerNPCClassItemData;

  /**
   * Return a skill trigger's bonus to rolls
   */
  get triggerBonus(): number {
    // Only works for skills.
    if (this.data.type !== "skill") return 0;
    return (this.data as LancerSkillItemData).data.rank * 2;
  }
}

// Narrow down our types
export interface LancerItemData extends ItemData {
  type: LancerItemType;
}

export class LancerSkill extends LancerItem {
  data!: LancerSkillItemData;
}

export class LancerTalent extends LancerItem {
  data!: LancerTalentItemData;
}

export class LancerCoreBonus extends LancerItem {
  data!: LancerCoreBonusItemData;
}

export class LancerLicense extends LancerItem {
  data!: LancerLicenseItemData;
}

export class LancerPilotArmor extends LancerItem {
  data!: LancerPilotArmorItemData;
}

export class LancerPilotWeapon extends LancerItem {
  data!: LancerPilotWeaponItemData;
}

export class LancerPilotGear extends LancerItem {
  data!: LancerPilotGearItemData;
}

export class LancerFrame extends LancerItem {
  data!: LancerFrameItemData;
}

export class LancerMechSystem extends LancerItem {
  data!: LancerMechSystemItemData;
}

export class LancerMechWeapon extends LancerItem {
  data!: LancerMechWeaponItemData;
}

export class LancerNPCFeature extends LancerItem {
  data!: LancerNPCFeatureItemData;
}

export class LancerNPCTemplate extends LancerItem {
  data!: LancerNPCTemplateItemData;
}

export class LancerNPCClass extends LancerItem {
  data!: LancerNPCClassItemData;
}

/* ------------------------------------ */
/* Handlebars Helpers                    */
/* ------------------------------------ */

/**
 * Handlebars helper which checks whether a weapon is loading by examining its tags
 * @param tags The tags for the weapon
 */
export function is_loading(tags: TagData[]) {
  if (!tags || !Array.isArray(tags) || tags.length < 1) return false;
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].id && tags[i].id === "tg_loading") {
      return true;
    }
    if (tags[i].name && tags[i].name.toUpperCase() === "LOADING") {
      return true;
    }
  }
  return false;
}

function loading_switch() { }

/**
 * Handlebars helper for weapon size selector
 */
export function weapon_size_selector(mount: string, data_target: string) {
  const m = mount ? mount.toLowerCase() : WeaponSize.Main.toLowerCase();
  const html = `<select name="${data_target}" data-type="String" style="align-self: center;">
    <option value="${WeaponSize.Aux}" ${m === WeaponSize.Aux.toLowerCase() ? "selected" : ""
    }>AUX</option>
    <option value="${WeaponSize.Main}" ${m === WeaponSize.Main.toLowerCase() ? "selected" : ""
    }>MAIN</option>
    <option value="${WeaponSize.Heavy}" ${m === WeaponSize.Heavy.toLowerCase() ? "selected" : ""
    }>HEAVY</option>
    <option value="${WeaponSize.Superheavy}" ${m === WeaponSize.Superheavy.toLowerCase() ? "selected" : ""
    }>SUPERHEAVY</option>
    <option value="Other" ${m === "other" ? "selected" : ""}>OTHER</option>
  </select>`;
  return html;
}

/**
 * Handlebars helper for weapon type selector
 */
export function weapon_type_selector(w_type: string, data_target: string) {
  const w = w_type ? w_type.toLowerCase() : "other";
  const html = `<select name="${data_target}" data-type="String" style="align-self: center;">
    <option value="${WeaponType.Rifle}" ${w === WeaponType.Rifle.toLowerCase() ? "selected" : ""
    }>RIFLE</option>
    <option value="${WeaponType.Cannon}" ${w === WeaponType.Cannon.toLowerCase() ? "selected" : ""
    }>CANNON</option>
    <option value="${WeaponType.Launcher}" ${w === WeaponType.Launcher.toLowerCase() ? "selected" : ""
    }>LAUNCHER</option>
    <option value="${WeaponType.CQB}" ${w === WeaponType.CQB.toLowerCase() ? "selected" : ""
    }>CQB</option>
    <option value="${WeaponType.Nexus}" ${w === WeaponType.Nexus.toLowerCase() ? "selected" : ""
    }>NEXUS</option>
    <option value="${WeaponType.Melee}" ${w === WeaponType.Melee.toLowerCase() ? "selected" : ""
    }>MELEE</option>
    <option value="Other" ${w === "other" ? "selected" : ""}>OTHER</option>
  </select>`;
  return html;
}

/**
 * Handlebars helper for weapon range selector
 */
export function weapon_range_selector(
  rng_arr: Partial<RangeData>[],
  key: string | number,
  data_target: string
) {
  if (typeof key == "string") {
    key = Number.parseInt(key);
  }
  var rng = {
    type: "None",
    val: 0,
  } as Partial<RangeData>;
  if (rng_arr && Array.isArray(rng_arr)) {
    Object.assign(rng, rng_arr[key]);
  }

  const rtype = rng.type!.toLowerCase();
  let html = '<div class="flexrow flex-center" style="padding: 5px;">';
  if (rng.type) {
    html += `<i class="cci cci-${rtype} i--m i--dark"></i>`;
  }
  /* TODO: For a next iteration--would be really nifty to set it up to select images rather than text. 
    But that seems like a non-trivial task...
    <img class="med-icon" src="../systems/lancer/assets/icons/range.svg">
    <img class="med-icon" src="../systems/lancer/assets/icons/aoe_blast.svg">
    <img class="med-icon" src="../systems/lancer/assets/icons/damage_explosive.svg">
  */
  html += `<select name="${data_target}.type" data-type="String" style="align-self: center;">
    <option value="" ${!rng.type ? "selected" : ""}>NONE</option>
    <option value="${RangeType.Range}" ${rtype === RangeType.Range.toLowerCase() ? "selected" : ""
    }>RANGE</option>
    <option value="${RangeType.Threat}" ${rtype === RangeType.Threat.toLowerCase() ? "selected" : ""
    }>THREAT</option>
    <option value="${RangeType.Thrown}" ${rtype === RangeType.Thrown.toLowerCase() ? "selected" : ""
    }>THROWN</option>
    <option value="${RangeType.Line}" ${rtype === RangeType.Line.toLowerCase() ? "selected" : ""
    }>LINE</option>
    <option value="${RangeType.Cone}" ${rtype === RangeType.Cone.toLowerCase() ? "selected" : ""
    }>CONE</option>
    <option value="${RangeType.Blast}" ${rtype === RangeType.Blast.toLowerCase() ? "selected" : ""
    }>BLAST</option>
    <option value="${RangeType.Burst}" ${rtype === RangeType.Burst.toLowerCase() ? "selected" : ""
    }>BURST</option>
  </select>
  <input class="lancer-stat-input " type="string" name="${data_target}.val" value="${rng.val ? rng.val : ""
    }" data-dtype="String"/>
  </div>`;
  return html;
}

/**
 * Handlebars helper for weapon damage selector
 */
// TODO: Fixup the NONE selected option to be in place
export function pilot_weapon_damage_selector(
  dmg_arr: Partial<DamageData>[],
  key: number | string,
  data_target: string
) {
  if (typeof key == "string") key = Number.parseInt(key);
  var dmg: Partial<DamageData> = {};
  if (dmg_arr && Array.isArray(dmg_arr)) {
    dmg = dmg_arr[key];
  }
  // Default in
  dmg = {
    type: DamageType.Kinetic,
    val: "",
    ...dmg,
  };

  const dtype = dmg.type!.toLowerCase();
  const isNPC = Array.isArray(dmg.val);
  let html = '<div class="flexrow flex-center" style="padding: 5px; flex-wrap: nowrap;">';

  if (dmg.type) {
    html += `<i class="cci cci-${dtype} i--m damage--${dtype}"></i>`;
  }
  html += `<select name="${data_target}.type" data-type="String" style="align-self: center;">
    <option value="" ${!dmg.type ? "selected" : ""}>NONE</option>
    <option value="${DamageType.Kinetic}" ${dtype === DamageType.Kinetic.toLowerCase() ? "selected" : ""
    }>KINETIC</option>
    <option value="${DamageType.Energy}" ${dtype === DamageType.Energy.toLowerCase() ? "selected" : ""
    }>ENERGY</option>
    <option value="${DamageType.Explosive}" ${dtype === DamageType.Explosive.toLowerCase() ? "selected" : ""
    }>EXPLOSIVE</option>
    <option value="${DamageType.Heat}" ${dtype === DamageType.Heat.toLowerCase() ? "selected" : ""
    }>HEAT</option>
    <option value="${DamageType.Burn}" ${dtype === DamageType.Burn.toLowerCase() ? "selected" : ""
    }>BURN</option>
    <option value="${DamageType.Variable}" ${dtype === DamageType.Variable.toLowerCase() ? "selected" : ""
    }>VARIABLE</option>
  </select>`;

  html += `
    <input class="lancer-stat-input " type="string" name="${data_target}.val" value="${dmg.val ? dmg.val : ""
    }" data-dtype="String"/>
  </div>`;
  return html;
}

/**
 * Handlebars helper for weapon damage selector
 */
export function npc_weapon_damage_selector(
  dmg_arr: NPCDamageData[],
  key: number | string,
  data_target: string
) {
  if (typeof key == "string") key = Number.parseInt(key);
  var dmg: Partial<NPCDamageData> = {};
  if (dmg_arr && Array.isArray(dmg_arr)) {
    dmg = dmg_arr[key];
  }
  // Default in
  dmg = {
    type: DamageType.Kinetic,
    val: ["0", "0", "0"],
    ...dmg,
  };

  const dtype = dmg.type!.toLowerCase();
  const isNPC = Array.isArray(dmg.val);
  let html = '<div class="flexrow flex-center" style="padding: 5px; flex-wrap: nowrap;">';

  if (dmg.type) {
    html += `<i class="cci cci-${dtype} i--m damage--${dtype}"></i>`;
  }
  html += `<select name="${data_target}.type" data-type="String" style="align-self: center;">
    <option value="" ${!dmg.type ? "selected" : ""}>NONE</option>
    <option value="${DamageType.Kinetic}" ${dtype === DamageType.Kinetic.toLowerCase() ? "selected" : ""
    }>KINETIC</option>
    <option value="${DamageType.Energy}" ${dtype === DamageType.Energy.toLowerCase() ? "selected" : ""
    }>ENERGY</option>
    <option value="${DamageType.Explosive}" ${dtype === DamageType.Explosive.toLowerCase() ? "selected" : ""
    }>EXPLOSIVE</option>
    <option value="${DamageType.Heat}" ${dtype === DamageType.Heat.toLowerCase() ? "selected" : ""
    }>HEAT</option>
    <option value="${DamageType.Burn}" ${dtype === DamageType.Burn.toLowerCase() ? "selected" : ""
    }>BURN</option>
    <option value="${DamageType.Variable}" ${dtype === DamageType.Variable.toLowerCase() ? "selected" : ""
    }>VARIABLE</option>
  </select>`;

  html += `</div>
  <div class="flexrow flex-center">
    <i class="cci cci-rank-1 i--m i--dark"></i>
    <input class="lancer-stat-input " type="string" name="${data_target}.val" value="${dmg.val![0] ? dmg.val![0] : ""
    }" data-dtype="String"/>
  </div>
  <div class="flexrow flex-center">
    <i class="cci cci-rank-2 i--m i--dark"></i>
    <input class="lancer-stat-input " type="string" name="${data_target}.val" value="${dmg.val![1] ? dmg.val![1] : ""
    }" data-dtype="String"/>
  </div>
  <div class="flexrow flex-center">
    <i class="cci cci-rank-3 i--m i--dark"></i>
    <input class="lancer-stat-input " type="string" name="${data_target}.val" value="${dmg.val![2] ? dmg.val![2] : ""
    }" data-dtype="String"/>
  </div>`;
  return html;
}

/**
 * Handlebars partial for a weapon preview range stat
 */
export const weapon_range_preview = `{{#if range.val}}
{{#if (gtpi rkey "0")}}<span class="flexrow" style="align-items: center; justify-content: center; max-width: min-content;"> // </span>{{/if}}
<div class="compact-range">
    <i class="cci cci-{{lower-case range.type}} i--m i--dark"></i>
    <span class="medium">{{range.val}}</span>
</div>
{{/if}}`;

/**
 * Handlebars partial for a weapon preview damage stat
 */
export const weapon_damage_preview = `{{#if damage.type}}
<div class="compact-damage">
    <i class="cci cci-{{lower-case damage.type}} i--m damage--{{lower-case damage.type}}"></i>
    <span class="medium">{{dval}}</span>
</div>
{{/if}}`;

/**
 * Handlebars partial for an NPC feature preview attack bonus stat
 */
export const npc_attack_bonus_preview = `<div class="compact-acc">
  <i class="cci cci-reticule i--m i--dark"></i>
  <span class="medium">{{#if (ltpi atk "0")}}{{else}}+{{/if}}{{atk}} ATTACK BONUS</span>
</div>`;

/**
 * Handlebars partial for an NPC feature preview accuracy stat
 */
export const npc_accuracy_preview = `{{#if (gtpi acc "0")}}
<div class="compact-acc">
    <i class="cci cci-accuracy i--m i--dark"></i>
    <span class="medium">+{{acc}} ACCURACY</span>
</div>
{{/if}}
{{#if (ltpi acc "0")}}
<div class="compact-acc">
    <i class="cci cci-difficulty i--m i--dark"></i>
    <span class="medium">+{{neg acc}} DIFFICULTY</span>
</div>
{{/if}}`;

/**
 * Handlebars partial for a mech weapon preview card.
 */
export const mech_weapon_preview = `<div class="flexcol clipped lancer-weapon-container weapon" style="max-height: fit-content;" data-item-id="{{key}}">
  <div class="lancer-weapon-header clipped-top item" style="grid-area: 1/1/2/3" data-item-id="{{weapon._id}}">
    <i class="cci cci-weapon i--m i--light"> </i>
    <span class="minor">{{weapon.name}} // {{upper-case weapon.data.mount}} {{upper-case weapon.data.weapon_type}}</span>
    <a class="stats-control i--light" data-action="delete"><i class="fas fa-trash"></i></a>
  </div> 
  <div class="lancer-weapon-body">
    <a class="roll-attack" style="grid-area: 1/1/2/2;"><i class="fas fa-dice-d20 i--m i--dark"></i></a>
    <div class="flexrow" style="grid-area: 1/2/2/3; text-align: left; white-space: nowrap;">
      {{#each weapon.data.range as |range rkey|}}
        {{> wpn-range range=range rkey=rkey}}
      {{/each}}
      <hr class="vsep">
      {{#each weapon.data.damage as |damage dkey|}}
        {{> wpn-damage damage=damage dkey=dkey dval=damage.val}}
      {{/each}}

      {{!-- Loading toggle - WIP, needs a way to link to related weapon. Maybe needs to be a callback instead of input.
      <hr class="vsep">
      {{#if (is-loading weapon.data.tags)}}
        <div class="flexrow" style="align-items: center;">
          LOADED: <label class="switch">
            <input type="checkbox" name="weapon.data.loaded" {{checked weapon.data.loaded}}>
            <span class="slider round"></span>
          </label>
        </div>
      {{/if}}
      --}}

    </div>
    {{#with weapon.data.effect as |effect|}}
    <div style="grid-area: 2/1/3/3; display: inherit;">
      {{{eff-preview effect}}}
    </div>
    {{/with}}
    <div style="grid-area: 4/1/5/3; display: inherit;">
      {{> tag-list tags=weapon.data.tags}}
    </div>
  </div>
</div>`;

/**
 * Handlebars partial for weapon type selector
 */
export function system_type_selector(s_type: string, data_target: string) {
  const s = s_type ? s_type.toLowerCase() : SystemType.System.toLowerCase();
  const html = `<select name="${data_target}" data-type="String" style="height: 2em; align-self: center;" >
    <option value="${SystemType.System}" ${s === SystemType.System.toLowerCase() ? "selected" : ""
    }>SYSTEM</option>
    <option value="${SystemType.AI}" ${s === SystemType.AI.toLowerCase() ? "selected" : ""
    }>AI</option>
    <option value="${SystemType.Armor}" ${s === SystemType.Armor.toLowerCase() ? "selected" : ""
    }>ARMOR</option>
    <option value="${SystemType.Deployable}" ${s === SystemType.Deployable.toLowerCase() ? "selected" : ""
    }>DEPLOYABLE</option>
    <option value="${SystemType.Drone}" ${s === SystemType.Drone.toLowerCase() ? "selected" : ""
    }>DRONE</option>
    <option value="${SystemType.FlightSystem}" ${s === SystemType.FlightSystem.toLowerCase() ? "selected" : ""
    }>FLIGHT SYSTEM</option>
    <option value="${SystemType.Integrated}" ${s === SystemType.Integrated.toLowerCase() ? "selected" : ""
    }>INTEGRATED</option>
    <option value="${SystemType.Mod}" ${s === SystemType.Mod.toLowerCase() ? "selected" : ""
    }>MOD</option>
    <option value="${SystemType.Shield}" ${s === SystemType.Shield.toLowerCase() ? "selected" : ""
    }>SHIELD</option>
    <option value="${SystemType.Tech}" ${s === SystemType.Tech.toLowerCase() ? "selected" : ""
    }>TECH</option>
  </select>`;
  return html;
}

/**
 * Handlebars partial for effect type selector
 */
export function effect_type_selector(e_type: string, data_target: string) {
  const e = e_type ? e_type.toLowerCase() : EffectType.Basic.toLowerCase();
  const html = `<select name="${data_target}" data-type="String" style="height: 2em;float: right" >
    <option value="${EffectType.Basic}" ${e === EffectType.Basic.toLowerCase() ? "selected" : ""
    }>BASIC</option>
    <option value="${EffectType.AI}" ${e === EffectType.AI.toLowerCase() ? "selected" : ""
    }>AI</option>
    <option value="${EffectType.Charge}" ${e === EffectType.Charge.toLowerCase() ? "selected" : ""
    }>CHARGE</option>
    <option value="${EffectType.Bonus}" ${e === EffectType.Bonus.toLowerCase() ? "selected" : ""
    }>BONUS</option>
    <option value="${EffectType.Deployable}" ${e === EffectType.Deployable.toLowerCase() ? "selected" : ""
    }>DEPLOYABLE</option>
    <option value="${EffectType.Drone}" ${e === EffectType.Drone.toLowerCase() ? "selected" : ""
    }>DRONE</option>
    <option value="${EffectType.Protocol}" ${e === EffectType.Protocol.toLowerCase() ? "selected" : ""
    }>PROTOCOL</option>
    <option value="${EffectType.Reaction}" ${e === EffectType.Reaction.toLowerCase() ? "selected" : ""
    }>REACTION</option>
    <option value="${EffectType.Tech}" ${e === EffectType.Tech.toLowerCase() ? "selected" : ""
    }>TECH</option>
  </select>`;
  return html;
}

/**
 * Handlebars partial for a mech system preview card.
 */
export const mech_system_preview =
  `<div class="card clipped mech-system-compact item" data-item-id="{{system._id}}">
<div class="lancer-system-header clipped-top" style="grid-area: 1/1/2/3">
  <i class="cci cci-system i--m i--dark"> </i>
  <span class="minor">{{system.name}}</span>
  <a class="stats-control i--light" data-action="delete"><i class="fas fa-trash"></i></a>
</div>
<div class="flexrow">
  <div style="float: left; align-items: center; display: inherit;">
    <i class="cci cci-system-point i--m i--dark"> </i><span class="medium" style="padding: 5px;">{{system.data.sp}} SP</span>
  </div>
  {{#if system.data.uses}}
  <div class="compact-stat">
    <span class="minor" style="max-width: min-content;">USES: </span>
    <span class="minor" style="max-width: min-content;">{{system.data.uses}}</span>
    <span class="minor" style="max-width: min-content;" > / </span>
    <span class="minor" style="max-width: min-content;">{{system.data.max_uses}}</span>
  </div>
  {{/if}}
</div>
{{#if (ne system.data.description "")}}
<div class="desc-text" style="padding: 5px">
  {{{system.data.description}}}
</div>
{{/if}}
{{#with system.data.effect as |effect|}}
  {{#if effect.effect_type}}
    {{{eff-preview effect}}}
  {{else}}
    {{> generic-eff-preview effect=effect}}
  {{/if}}
{{/with}}
{{> tag-list tags=system.data.tags}}
</div>`;

/**
 * Handlebars partial for non-editable Mech Trait
 */
export const mech_trait_preview = `<div class="lancer-mech-trait-header medium clipped-top" style="grid-area: 1/1/2/2">
  <i class="cci cci-trait i--m i--light"> </i>
  <span class="major">{{trait.name}}</span>
</div>
<div class="effect-text" style="grid-area: 2/1/3/2">{{{trait.description}}}</div>`;

/**
 * Handlebars partial for non-editable Core System
 */
export const core_system_preview = `<div class="card clipped frame-core flexcol">
  <div class="lancer-core-sys-header medium clipped-top">
    <i></i>
    <div class="major">{{csys.name}}</div>
    <div class="medium" style="justify-self: right;"> // CORE SYSTEM</div>
  </div>
  {{#if csys.description}}
  <div class="desc-text">{{{csys.description}}}</div>
  {{/if}}
  {{#if csys.passive_name}}
  <div class="card clipped">
    <div class="lancer-core-sys-header medium clipped-top">
      <i class="mdi mdi-circle-expand i--m i--light"> </i>
      <div class="medium">{{csys.passive_name}}</div>
      <div class="medium" style="justify-self: right;"> // PASSIVE</div>
    </div>
    <div class="effect-text">{{{csys.passive_effect}}}</div>
  </div>
  {{/if}}
  <div class="card clipped">
    <div class="lancer-core-sys-header medium clipped-top">
      <i class="cci cci-corebonus i--m i--light"> </i>
      <div class="medium">{{csys.active_name}}</div>
      <div class="medium" style="justify-self: right;"> // ACTIVE</div>
    </div>
    <div class="effect-text">{{{csys.active_effect}}}</div>
    {{> tag-list tags=csys.tags}}
  </div>
</div>`;
