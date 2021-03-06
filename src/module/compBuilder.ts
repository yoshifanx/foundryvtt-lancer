import { LANCER } from "./config";
const lp = LANCER.log_prefix;
import * as mm from "machine-mind";
import { Converter } from "./ccdata_io";
import {
  ContentPack,
  Frame,
  MechSystem,
  MechWeapon,
  PilotArmor,
  PilotGear,
  PilotWeapon,
  NpcClass,
  NpcTemplate,
  NpcFeature,
} from "machine-mind";
import { CORE_BONUS_PACK, FRAME_PACK, MECH_SYSTEM_PACK, MECH_WEAPON_PACK, NPC_CLASS_PACK, NPC_FEATURE_PACK, NPC_TEMPLATE_PACK, PACKS, PILOT_ARMOR_PACK, PILOT_GEAR_PACK, PILOT_WEAPON_PACK, SKILLS_PACK, TALENTS_PACK } from "./item/util";

export async function buildCompendiums(cp: ContentPack, sysComps: boolean): Promise<void> {
  const conv = new Converter(cp.ID);
  await buildSkillCompendium(conv, cp, sysComps);
  await buildTalentCompendium(conv, cp, sysComps);
  await buildCoreBonusCompendium(conv, cp, sysComps);
  await buildPilotEquipmentCompendiums(conv, cp, sysComps);
  await buildFrameCompendium(conv, cp, sysComps);
  await buildMechSystemCompendium(conv, cp, sysComps);
  await buildMechWeaponCompendium(conv, cp, sysComps);
  // TODO: weapon mods
  // TODO: licenses
  await buildNPCClassCompendium(conv, cp, sysComps);
  await buildNPCTemplateCompendium(conv, cp, sysComps);
  await buildNPCFeatureCompendium(conv, cp, sysComps);
  return Promise.resolve();
}

export async function clearCompendiums(): Promise<void> {
  let sysComps: boolean = game.settings.get(LANCER.sys_name, LANCER.setting_comp_loc);

  PACKS.forEach(async (p: string) => {
    let pack: Compendium | undefined;
    if (sysComps) {
      pack = game.packs.get(`lancer.${p}`);
    } else {
      pack = game.packs.get(`world.${p}`);
    }

    if (pack) {
      pack.locked = false;
      // Delete every item in the pack
      let index: { _id: string; name: string }[] = await pack.getIndex();
      index.forEach(async i => {
        pack?.deleteEntity(i._id);
      });
    }
  });

  return Promise.resolve();
}

async function findPack(pack_name: string, metaData: object): Promise<Compendium> {
  let pack: Compendium | undefined;

  // Find existing world compendium
  pack = game.packs.get(`world.${pack_name}`);
  if (!pack) {
    // World compendium doesn't exist, attempt to find a system compendium
    pack = game.packs.get(`lancer.${pack_name}`);
  }
  if (pack) {
    console.log(`${lp} Updating existing compendium: ${pack.collection}.`);
    pack.locked = false;
  } else {
    // Compendium doesn't exist yet. Create a new one.
    pack = await Compendium.create(metaData);
    console.log(`${lp} Building new compendium: ${pack.collection}.`);
  }

  return pack;
}

async function updateItem(
  pack: Compendium,
  newData: any,
  type: string,
  img: string
): Promise<Entity> {
  newData.name = (newData.name as string).toUpperCase();
  let entry: { _id: string; name: string } | undefined = pack.index.find(
    e => e.name === newData.name
  );

  // The item already exists in the pack, update its data.
  if (entry) {
    console.log(`LANCER | Updating ${type} ${entry.name} in compendium ${pack.collection}`);
    let e: Item = (await pack.getEntity(entry._id)) as Item;
    let d: any = e.data;
    d.name = newData.name;
    d.img = img;
    d.data = newData;
    return await pack.updateEntity(d, { entity: e });
  } else {
    // The item doesn't exist yet, create it
    const itemData: any = {
      name: newData.name,
      img: img,
      type: type,
      flags: {},
      data: newData,
    };
    console.log(`LANCER | Adding ${type} ${itemData.name} to compendium ${pack.collection}`);
    // Create an Item from the item data
    return await pack.createEntity(itemData);
  }
}

async function buildSkillCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const skills = cp.Skills;
  const pname = SKILLS_PACK;
  const img = "systems/lancer/assets/icons/skill.svg";
  const metaData: Object = {
    name: pname,
    label: "Skill Triggers",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/skills.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of skills and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  skills.forEach(async (skill: mm.Skill) => {
    if (pack.locked) pack.locked = false;
    promises.push(updateItem(pack, conv.Skill_to_LancerSkillData(skill), "skill", img));
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildTalentCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const talents = cp.Talents;
  const pname = TALENTS_PACK;
  const img = "systems/lancer/assets/icons/talent.svg";
  const metaData: Object = {
    name: pname,
    label: "Talents",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/talents.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of talents and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  talents.forEach(async (talent: mm.Talent) => {
    if (pack.locked) pack.locked = false;
    promises.push(updateItem(pack, conv.Talent_to_LancerTalentData(talent), "talent", img));
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildCoreBonusCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const coreBonus = cp.CoreBonuses;
  const pname = CORE_BONUS_PACK;
  const img = "systems/lancer/assets/icons/corebonus.svg";
  const metaData: Object = {
    name: pname,
    label: "Core Bonuses",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/core_bonuses.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of core bonuses and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  coreBonus.forEach(async (cbonus: mm.CoreBonus) => {
    if (pack.locked) pack.locked = false;
    promises.push(
      updateItem(pack, conv.CoreBonus_to_LancerCoreBonusData(cbonus), "core_bonus", img)
    );
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildPilotEquipmentCompendiums(conv: Converter, cp: ContentPack, sysComps: boolean) {
  console.log("LANCER | Building Pilot Equipment compendiums.");
  const pilotArmor = cp.PilotArmor;
  const pilotWeapon = cp.PilotWeapons;
  const pilotGear = cp.PilotGear;
  const paName = PILOT_ARMOR_PACK;
  const pwName = PILOT_WEAPON_PACK;
  const pgName = PILOT_GEAR_PACK;
  const armImg = "systems/lancer/assets/icons/shield_outline.svg";
  const weapImg = "systems/lancer/assets/icons/weapon.svg";
  const gearImg = "systems/lancer/assets/icons/generic_item.svg";
  const armorMeta: Object = {
    name: paName,
    label: "Pilot Armor",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/pilot_armor.db",
    entity: "Item",
  };
  let paPack: Compendium = await findPack(paName, armorMeta);
  const weaponMeta: Object = {
    name: pwName,
    label: "Pilot Weapons",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/pilot_weapons.db",
    entity: "Item",
  };
  let pwPack: Compendium = await findPack(pwName, weaponMeta);
  const gearMeta: Object = {
    name: pgName,
    label: "Pilot Gear",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/pilot_gear.db",
    entity: "Item",
  };
  let pgPack: Compendium = await findPack(pgName, gearMeta);
  paPack.locked = false;
  pwPack.locked = false;
  pgPack.locked = false;
  await paPack.getIndex();
  await pwPack.getIndex();
  await pgPack.getIndex();

  // Iterate through the lists of pilot equipment and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  pilotArmor.forEach(async (arm: PilotArmor) => {
    if (paPack.locked) paPack.locked = false;
    promises.push(
      updateItem(paPack, conv.PilotArmor_to_LancerPilotArmorData(arm), "pilot_armor", armImg)
    );
  });
  pilotWeapon.forEach(async (weap: PilotWeapon) => {
    if (pwPack.locked) pwPack.locked = false;
    promises.push(
      updateItem(pwPack, conv.PilotWeapon_to_LancerPilotWeaponData(weap), "pilot_weapon", weapImg)
    );
  });
  pilotGear.forEach(async (gear: PilotGear) => {
    if (pgPack.locked) pgPack.locked = false;
    promises.push(
      updateItem(pgPack, conv.PilotGear_to_LancerPilotGearData(gear), "pilot_gear", gearImg)
    );
  });
  for await (const x of promises) {
    continue;
  }
  paPack.locked = true;
  pwPack.locked = true;
  pgPack.locked = true;
  return Promise.resolve();
}

async function buildFrameCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const frames = cp.Frames;
  const pname = FRAME_PACK;
  const img = "systems/lancer/assets/icons/frame.svg";
  const metaData: Object = {
    name: pname,
    label: "Frames",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/frames.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // const licImg = "systems/lancer/assets/icons/license.svg";
  // const licMetaData: Object = {
  //   name: "licenses",
  //   label: "Licenses",
  //   system: "lancer",
  //   package: "lancer",
  //   path: "./packs/licenses.db",
  //   entity: "Item",
  // };
  // let licPack: Compendium = await findPack("licenses", licMetaData);
  // licPack.locked = false;
  // await licPack.getIndex();

  // Iterate through the list of frames and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  frames.forEach(async (frame: Frame) => {
    if (pack.locked) pack.locked = false;
    promises.push(updateItem(pack, conv.Frame_to_LancerFrameData(frame), "frame", img));
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildMechSystemCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const systems = cp.MechSystems;
  const pname = MECH_SYSTEM_PACK;
  const img = "systems/lancer/assets/icons/mech_system.svg";
  const metaData: Object = {
    name: pname,
    label: "Systems",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/systems.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of core bonuses and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  systems.forEach(async (system: MechSystem) => {
    if (pack.locked) pack.locked = false;
    promises.push(
      updateItem(pack, conv.MechSystem_to_LancerMechSystemData(system), "mech_system", img)
    );
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildMechWeaponCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const weapons = cp.MechWeapons;
  const pname = MECH_WEAPON_PACK;
  const img = "systems/lancer/assets/icons/mech_weapon.svg";
  const metaData: Object = {
    name: pname,
    label: "Weapons",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/weapons.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of core bonuses and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  weapons.forEach(async (weapon: MechWeapon) => {
    if (pack.locked) pack.locked = false;
    promises.push(
      updateItem(pack, conv.MechWeapon_to_LancerMechWeaponData(weapon), "mech_weapon", img)
    );
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

// TODO: Weapon mods

// TODO: Licenses

async function buildNPCClassCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const npcc = cp.NpcClasses;
  const pname = NPC_CLASS_PACK;
  const img = "systems/lancer/assets/icons/npc_class.svg";
  const metaData: Object = {
    name: pname,
    label: "NPC Classes",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/npc_classes.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of core bonuses and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  npcc.forEach(async (cls: NpcClass) => {
    if (pack.locked) pack.locked = false;
    promises.push(
      updateItem(pack, conv.NpcClass_to_LancerNPCClassData(cls), "npc_class", img)
    );
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildNPCTemplateCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const npct = cp.NpcTemplates;
  const pname = NPC_TEMPLATE_PACK;
  const img = "systems/lancer/assets/icons/npc_template.svg";
  const metaData: Object = {
    name: pname,
    label: "NPC Templates",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/npc_templates.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of core bonuses and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  npct.forEach(async (template: NpcTemplate) => {
    if (pack.locked) pack.locked = false;
    promises.push(
      updateItem(pack, conv.NpcTemplate_to_LancerNPCTemplateData(template), "npc_template", img)
    );
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}

async function buildNPCFeatureCompendium(conv: Converter, cp: ContentPack, sysComps: boolean) {
  const npcf = cp.NpcFeatures;
  const pname = NPC_FEATURE_PACK;
  const img = "systems/lancer/assets/icons/npc_feature.svg";
  const metaData: Object = {
    name: pname,
    label: "NPC Features",
    system: "lancer",
    package: sysComps ? "lancer" : "world",
    path: "./packs/npc_features.db",
    entity: "Item",
  };
  let pack: Compendium = await findPack(pname, metaData);
  pack.locked = false;
  await pack.getIndex();

  // Iterate through the list of core bonuses and add them each to the Compendium
  let promises: Promise<Entity>[] = [];
  npcf.forEach(async (feature: NpcFeature) => {
    if (pack.locked) pack.locked = false;
    promises.push(
      updateItem(pack, conv.NpcFeature_to_LancerNPCFeatureData(feature), "npc_feature", img)
    );
  });
  for await (const x of promises) {
    continue;
  }
  pack.locked = true;
  return Promise.resolve();
}
