# 0.1.7 (2020-09-27)
Hotfix to correct new issue with pilot sheet not loading. 

# 0.1.6 (2020-09-27)
## General
* **Pilot Sheet**: Move the cloud sync tab to leftmost, rename to "RM-4://SYNC" to mirror Comp/Con UI.
* **Pilot Sheet**: Record and display the last time the pilot was downloaded from cloud save.

## Bug Fixes
* **Pilot Sheet**: Fix bug where charge effects' HTML wasn't closed properly, resulting in the cloud import UI elements not showing on affected pilot sheets. Closes #72.
* **Comp/Con Cloud Save Import**: Fix bug where pilots with custom skills would not import. Closes #71.

# 0.1.5 (2020-09-27)
## Features
* **LCP Import**: It's finally here! The Lancer Compendium Manager is your new friend for building/updating Compendiums with Lancer core data and LCPs. Closes #15.
* **Comp/Con Cloud Save Import**: Pilots can now pull data from a Comp/Con cloud share code, automatically building the pilot and their mech (except for weapons) and calculating stats. Partial work for #23.

## Bug Fixes
* **NPC Sheet**: Fix bug where ranges weren't shown on NPC weapon previews. Closes #68.

# 0.1.4 (2020-09-12)
## Bug Fixes
* **NPC Feature Sheet:** Fix bug where new NPC weapons only show 1 damage field. Closes #64.
* **Item Import/Duplication:** Fix issue where duplicated/imported items had properties overwritten. Closes #65.

# 0.1.3 (2020-09-07)
## General
* Updated Foundry Core compatibility version to 0.6.6.
* Standardized a lot of sheet components to make appearance and future development better.
* Changed default grid distance and unit to 1 unitless, instead of 10 feet.
* Greatly reduced the file size of the faction logos.

## Features
* **Mech Systems/Weapons:** Added effects rendering for all effect types currently supported in Comp/Con. They are rendered on pilot sheet and in chat when a weapon macro is used. Closes #22.
* **Mech Systems:** Added editability for Basic, AI, Bonus, and Charge-type effects. 
* **Frame Sheet:** Improve appearance and editability of Frame sheet. Core system description, passive effect, and active effect can now all be edited even if not currently present on the Frame.

## Bug Fixes
* **Pilot Sheet:** Fixed custom frames (user-created Item) not showing their name on pilot sheets. Closes #57.
* **Usability:** Removed functionality which deleted weapons or systems from a Pilot on right-click. Closes #56.
* **Tokens:** Fixed a bug which caused NPC and Deployable prototype token images to be overwritten when the parent sheet image was changed. Closes #61.
* **Macros:** Character sheet macro rollers now always use the sheet's Actor as the speaker.

# 0.1.2 (2020-07-29)
## Bug Fixes
* **General:** Fix a bug which could cause Item data to be lost during version migration or duplication.
* **NPC Sheet:** Editing the name field now renames the Actor and prototype token, closes #55.

# 0.1.1 (2020-07-26)
## Bug Fixes
* **Macros:** Add "Cancel" button to accuracy prompt. Clicking cancel or closing the prompt will abort the roll. Closes #45.
* **Macros:** Fix NPC weapon macros, closes #47.
* **Frame sheet:** Fixed adding traits and mounts, closes #44. (Thanks, Grygon!)
* **NPCs:** New NPCs start at 0 heat, closes #49.
* **NPCs:** Increase NPC class sheet default width, part of #48.

## Features
* **Macros:** Add HASE macro buttons to mech tab of pilot sheet, closes #54.
* **Macros:** Add NPC tech attack macros.
* **Pilot sheet:** Render charge effects in systems previews, closes #46. (Thanks, Grygon!)
* **Frame sheet:** Improve core system editability.
* **NPC Features:** Add support for all feature types to feature sheet and NPC sheet, closes #36. 

# 0.1.0 (2020-07-19)
## Alpha release!
A huge thank you and shout-out to Animu36, Grygon, and Staubz, without whose help this initial release would have taken many more weeks!

The system is bare-bones, but should be stable for play. Features existing as of this release:
* Compendiums containing all of the Core Book player-side content.
* Pilot sheet with sorted Items, mount handling (thanks, Animu!), support for frame swapping by drag-and-drop, and some macro buttons.
* NPC sheet with support for class swapping by drag-and-drop (thanks, Staubz!), and some macro buttons.
* Editable sheets for each Item type (thanks, Grygon!):
  * Skill Triggers
  * Talents
  * Core Bonuses
  * Pilot Armor, Weapons, and Gear
  * Mech Frames
  * Mech Weapons
  * Mech Systems
  * NPC Classes
  * NPC Templates
  * NPC Features

## Recommended Companion Modules
* Lancer Condition Icons - status/condition icon sets tailored towards Lancer.
* Hex Size Support - Improves Hex grid snapping, movement, and ruler measurement for hex tokens larger than size 1.
* Popcorn Initiative - Add-on popcorn initiative management system.

## Known Issues
* Weapons, systems, and NPC features do not render all of their effects yet. Since the Compendiums are generated using `lancer-data` (the same data library that Comp/Con uses), the effects are broken down into the special types that Comp/Con supports. Implementing proper rendering and then editability for special effects types will be added soon. This may be delayed until the recently announced changes to the data are complete on the Comp/Con side.
* No NPCs included! As the Core Book NPCs are part of the paid content for Lancer, they cannot be included in the system upon install. An LCP import tool is coming, which will allow you to use the Comp/Con NPC pack (download from the [Core Book itch.io page](https://massif-press.itch.io/corebook-pdf)) to automatically build/update NPC Compendiums. For now, NPC stats will need to be entered manually.
* Does not include [Long Rim](https://massif-press.itch.io/the-long-rim) or Wallflower player content. Again, LCP import is coming!
