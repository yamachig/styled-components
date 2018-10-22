// @flow
import isFunction from './isFunction';
import isStyledComponent from './isStyledComponent';
import type { RuleSet } from '../types';

export default function isStaticRules(rules: RuleSet, attrsSet?: Array<Object | Function>): boolean {
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];

    // recursive case
    if (Array.isArray(rule) && !isStaticRules(rule)) {
      return false;
    } else if (isFunction(rule) && !isStyledComponent(rule)) {
      // functions are allowed to be static if they're just being
      // used to get the classname of a nested styled component
      return false;
    }
  }

  if (Array.isArray(attrsSet) && attrsSet.length > 0) {
    for (let i = 0; i < attrsSet.length; i += 1) {
      const attrs = attrsSet[i];
      if (isFunction(attrs)) {
        return false;
      }
    }
    return false;
  }

  return true;
}
