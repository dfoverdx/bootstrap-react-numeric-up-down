import React from 'react';
import sinon from 'sinon';
import NumericUpDown from './index';

it('honors min and max when clicking buttons', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(<NumericUpDown min={-1} max={1} value={0} onChange={onChange} />);
    let input = () => nud.find('input'),
        mBtn = () => nud.find('.minus-icon'),
        pBtn = () => nud.find('.plus-icon');

    expect(input().props().value).toBe(0);
    
    mBtn().simulate('click');
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(-1);
    expect(input().props().value).toBe(-1);

    onChange.resetHistory();

    expect(mBtn().hasClass('disabled')).toBe(true);
    mBtn().simulate('click');
    expect(onChange.notCalled).toBe(true);
    expect(input().props().value).toBe(-1);

    nud.setProps({ value: 0 });
    onChange.resetHistory();

    pBtn().simulate('click');
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(1);
    expect(input().props().value).toBe(1);
    
    onChange.resetHistory();
    nud.setProps({ value: 1 });
    pBtn().simulate('click');
    expect(onChange.notCalled).toBe(true);
    expect(input().props().value).toBe(1);
});

it('restores the target value when the target fits the range', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(<NumericUpDown type="number" min={0} max={3} value={0} onChange={onChange} />);
    let input = () => nud.find('input');

    expect(input().props().value).toBe(0);
    nud.setProps({ min: 1 });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(1);
    expect(input().props().value).toBe(1);
    expect(nud.state().targetValue).toBe(0);

    onChange.resetHistory();
    nud.setProps({ min: 0 });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(0);
    expect(nud.state().targetValue).toBeNull();

    nud.setProps({ min: 4 });
    onChange.resetHistory();
    expect(input().props().value).toBe(3);
    expect(nud.find('input').props().disabled).toBe(true);
    expect(nud.state().targetValue).toBe(0);

    onChange.resetHistory();
    nud.setProps({ max: 5 });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(4);
    expect(input().props().value).toBe(4);
    expect(nud.state().targetValue).toBe(0);

    onChange.resetHistory();
    nud.setProps({ min: -Infinity });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(0);
    expect(input().props().value).toBe(0);
    expect(nud.state().targetValue).toBeNull();
});

it('restores a value if original props have empty range', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(<NumericUpDown min={1} max={0} value={1} onChange={onChange} />);
    let input = () => nud.find('input');

    expect(input().props().value).toBe(1);
    expect(nud.state().targetValue).toBe(1);

    nud.setProps({ max: 3 });
    expect(onChange.notCalled).toBe(true);
    expect(input().props().value).toBe(1);
    expect(nud.state().targetValue).toBeNull();
});

it('handles the disabled property', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(<NumericUpDown value={0} onChange={onChange} disabled />);
    let input = () => nud.find('input'),
        mBtn = () => nud.find('.minus-icon'),
        pBtn = () => nud.find('.plus-icon');

    expect(nud).toMatchSnapshot();
    expect(input().props().disabled).toBe(true);

    mBtn().simulate('click');
    expect(input().props().value).toBe(0);
    expect(onChange.notCalled).toBe(true);
    
    pBtn().simulate('click');
    expect(input().props().value).toBe(0);
    expect(onChange.notCalled).toBe(true);
});

it('works when no value or onChange is specified', () => {
    let n = <NumericUpDown min={1} max={2} />,
        nud = mount(n),
        mBtn = () => nud.find('svg.minus-icon'),
        pBtn = () => nud.find('svg.plus-icon'),
        input = () => nud.find('input');

    expect(nud).toMatchSnapshot();

    mBtn().simulate('click');
    expect(input().props().value).toBe(1);
    expect(nud).toMatchSnapshot();
    
    mBtn().simulate('click');
    expect(input().props().value).toBe(1);
    expect(nud).toMatchSnapshot();

    pBtn().simulate('click');
    expect(input().props().value).toBe(2);
    expect(nud).toMatchSnapshot();

    pBtn().simulate('click');
    expect(input().props().value).toBe(2);
    expect(nud).toMatchSnapshot();

    mBtn().simulate('click');
    expect(input().props().value).toBe(1);
    expect(nud).toMatchSnapshot();
});

// it('disables icons properly when passed custom elements', () => {
//     let mBtn = shallow(<div>-</div>),
//         pBtn = shallow(<div>+</div>),
//         nud,
//         nud = shallow(<NumericUpDown min={0} max={1} )
// });

// describe('icon props', () => {
    // TODO
    // const fortawesome = require('./fortawesome');

    // beforeEach(() => {
    //     jest.resetModules();
    //     fortawesome.__setReactFontawesomeInstalled(true);
    // });

    // it(`uses '+' and '-' characters by default when react-fontawesome is not installed`, () => {
    //     fortawesome.__setReactFontawesomeInstalled(false);
    //     const NumericUpDown = require('./index').default;
    //     let nud = renderer.create(<NumericUpDown value={0} />),
    //         tree = nud.toJSON();
    //     expect(tree).toMatchSnapshot();
    // });
    
it(`uses faPlusCircle and faMinusCircle by default when react-fontawesome and free-solid-svg-icons are installed`, () => {
    // const NumericUpDown = require('./index').default;
    let nud = shallow(<NumericUpDown value={0} />);
    expect(nud).toMatchSnapshot();
});

test(`uses specified fontawesome icons when react-fontawesome and free-solid-svg-icons are installed`, () => {
    const { faUserMinus, faUserPlus } = require('@fortawesome/free-solid-svg-icons');

    let nud = shallow(<NumericUpDown value={0} minusIcon={faUserMinus} plusIcon={faUserPlus} />);
    expect(nud).toMatchSnapshot();
});

it(`handles font-awesome strings for icons when specified in properties`, () => {
    const { library } = require('@fortawesome/fontawesome-svg-core'),
        { fas } = require('@fortawesome/free-solid-svg-icons');
    library.add(fas);

    let nud = shallow(<NumericUpDown value={0} minusIcon="user-minus" plusIcon="user-plus" />);
    expect(nud).toMatchSnapshot();
});
// });
