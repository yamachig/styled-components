// @flow
import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import styled from '../../constructors/styled';

describe('classNameUsageCheckInjector', () => {
  it('should generate valid selectors', () => {
    const Comp = () => <div className="   foo    bar  " />;
    const StyledComp = styled(Comp)``;

    // Avoid the console.warn
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => true);

    renderIntoDocument(<StyledComp className="   foo    bar  " />);

    const [selector] = document.querySelector.mock.calls[0];

    // Css selectors should not have multiple dots after each other
    expect(selector).not.toMatch(/\.{2,}/);
    expect(selector).toMatch(/^\.foo\.bar\.sc-/);
  });
});
