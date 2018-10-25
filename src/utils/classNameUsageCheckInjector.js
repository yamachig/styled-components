// @flow
import getComponentName from './getComponentName';

export default (target: Object) => {
  let elementClassName = '';
  let elementRef = null;
  let node: Element | null = null;

  const targetCDM = target.componentDidMount;

  // eslint-disable-next-line no-param-reassign
  target.componentDidMount = function componentDidMount() {
    if (typeof targetCDM === 'function') {
      targetCDM.call(this);
    }

    const classNames = elementClassName
      .replace(/ +/g, ' ')
      .trim()
      .split(' ');

    // eslint-disable-next-line react/no-find-dom-node
    const selector = classNames.map(s => `.${s}`).join('');

    if (
      node &&
      node.nodeType === 1 &&
      !classNames.every(
        className => node && node.classList && node.classList.contains(className)
      ) &&
      !node.querySelector(selector)
    ) {
      console.warn(
        `It looks like you've wrapped styled() around your React component (${getComponentName(
          this.props.forwardedClass.target
        )}), but the className prop is not being passed down to a child. No styles will be rendered unless className is composed within your React component.`
      );
    }
  };

  const prevRenderInner = target.renderInner;

  // eslint-disable-next-line no-param-reassign
  target.renderInner = function renderInner(...args) {
    elementRef = target.props.forwardedRef || target.props.ref;

    // https://github.com/facebook/react/issues/13029
    // eslint-disable-next-line no-param-reassign
    target.internalRef = el => {
      node = el;

      if (elementRef) {
        if (typeof elementRef === 'function') {
          elementRef(el);
        } else if (typeof elementRef === 'object') {
          elementRef.current = el;
        }
      }
    };

    const element = prevRenderInner.apply(this, args);

    elementClassName = element.props.className;

    return element;
  };
};
