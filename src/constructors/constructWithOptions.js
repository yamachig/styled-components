// @flow
import { isValidElementType } from 'react-is';
import css from './css';
import StyledError from '../utils/error';
import { EMPTY_OBJECT } from '../utils/empties';

import type { Target } from '../types';

export default function constructWithOptions(
  componentConstructor: Function,
  tag: Target,
  options: Object = EMPTY_OBJECT
) {
  if (!isValidElementType(tag)) {
    throw new StyledError(1, String(tag));
  }

  // Creates resolver function which wraps the logic for resolving component attrs.
  // Currently it supports both ways for defining component attrs:
  // - plain object -> styled.input.attrs({ example: 'value' })
  // - factory function -> styled.input.attrs(props => ({ example: props.value })
  const resolveAttr = (context, attrsObjOrFn) =>
    typeof attrsObjOrFn === 'function' ? attrsObjOrFn(context) : attrsObjOrFn;

  /* This is callable directly as a template function */
  // $FlowFixMe: Not typed to avoid destructuring arguments
  const templateFunction = (...args) => componentConstructor(tag, options, css(...args));

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = config =>
    constructWithOptions(componentConstructor, tag, { ...options, ...config });

  /* attrs could be either a plain object or a function (props => ({ attrs })) */
  templateFunction.attrs = attrs =>
    constructWithOptions(componentConstructor, tag, {
      ...options,
      attrs: { ...(options.attrs || EMPTY_OBJECT), ...attrs },
      resolveAttr,
    });

  return templateFunction;
}
