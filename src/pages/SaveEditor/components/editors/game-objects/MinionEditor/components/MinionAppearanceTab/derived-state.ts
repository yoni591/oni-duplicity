import { Selector, createStructuredSelector, createSelector } from "reselect";

import {
  ACCESSORY_TYPES,
  AccessorizerBehavior,
  GameObject,
  AccessoryType,
  getAccessoryName,
  getAccessoryOfType,
  getBehavior,
  MinionIdentityBehavior
} from "oni-save-parser";

import { AppState } from "@/state";

import selectedValue from "@/selectors/selected-value";
import selectedPath from "@/selectors/selected-path";

const behavior = createSelector(selectedValue, (gameObject: GameObject) => {
  if (!gameObject) {
    return null;
  }
  return getBehavior(gameObject, AccessorizerBehavior);
});

function createAccessorySelector(
  accessoryType: AccessoryType
): Selector<AppState, string | null> {
  return createSelector(behavior, behavior => {
    if (!behavior) {
      return null;
    }

    const { accessories } = behavior.templateData;

    const accessory = getAccessoryOfType(accessories, accessoryType);
    if (!accessory) {
      return null;
    }

    return getAccessoryName(accessory);
  });
}

const identityDataPath = createSelector(
  selectedValue,
  selectedPath,
  (gameObject: GameObject, selectedPath) => {
    if (!gameObject) {
      return;
    }

    const healthBehaviorIndex = gameObject.behaviors.findIndex(
      x => x.name === MinionIdentityBehavior
    );
    if (healthBehaviorIndex === -1) {
      return null;
    }
    return [
      ...selectedPath,
      "behaviors",
      `${healthBehaviorIndex}`,
      "templateData"
    ];
  }
);

const structuredSelector = {
  selectedPath,
  identityDataPath
};
ACCESSORY_TYPES.forEach(x => {
  (structuredSelector as any)[x] = createAccessorySelector(x);
});
export type StateProps = StructuredStateProps<
  typeof structuredSelector & Record<AccessoryType, string | null>
>;
const mapStateToProps = createStructuredSelector<AppState, StateProps>(
  structuredSelector as any
);
export default mapStateToProps;
