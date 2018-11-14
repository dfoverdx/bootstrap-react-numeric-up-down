import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import renderer from 'react-test-renderer';

jest.mock('./fortawesome');
Enzyme.configure({adapter: new Adapter()});

const NumericUpDown = require('./index').default;

it('honors min and max when clicking buttons', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(
        <NumericUpDown type="number" min={-1} max={1} value={0} onChange={onChange} />
    );

    expect(nud.props().value).toBe(0);
    
    nud.find('.minus-icon').simulate('click');
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(-1);
    expect(nud.props().value).toBe(-1);

    onChange.resetHistory();

    expect(nud.find('.minus-icon').hasClass('disabled')).toBe(true);
    nud.find('.minus-icon').simulate('click');
    expect(onChange.notCalled).toBe(true);
    expect(nud.props().value).toBe(-1);

    nud.setProps({ value: 0 });
    onChange.resetHistory();

    nud.find('.plus-icon').simulate('click');
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(1);
    expect(nud.props().value).toBe(1);
    
    onChange.resetHistory();
    nud.setProps({ value: 1 });
    nud.find('.plus-icon').simulate('click');
    expect(onChange.notCalled).toBe(true);
    expect(nud.props().value).toBe(1);
});

it('restores the target value when the target fits the range', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(
        <NumericUpDown type="number" min={0} max={3} value={0} onChange={onChange} />
    );

    expect(nud.props().value).toBe(0);
    nud.setProps({ min: 1 });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(1);
    expect(nud.props().value).toBe(1);
    expect(nud.state().targetValue).toBe(0);

    onChange.resetHistory();
    nud.setProps({ min: 0 });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(0);
    expect(nud.state().targetValue).toBeNull();

    nud.setProps({ min: 4 });
    onChange.resetHistory();
    expect(nud.props().value).toBe(3);
    expect(nud.find('input').props().disabled).toBe(true);
    expect(nud.state().targetValue).toBe(0);

    onChange.resetHistory();
    nud.setProps({ max: 5 });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(4);
    expect(nud.props().value).toBe(4);
    expect(nud.state().targetValue).toBe(0);

    onChange.resetHistory();
    nud.setProps({ min: -Infinity });
    expect(onChange.callCount).toBe(1);
    expect(onChange.getCall(0).args[0]).toBe(0);
    expect(nud.props().value).toBe(0);
    expect(nud.state().targetValue).toBeNull();
});

it('restores a value if original props have empty range', () => {
    let nud,
        onChange = sinon.spy(v => nud.setProps({ value: v }));

    nud = shallow(
        <NumericUpDown type="number" min={1} max={0} value={1} onChange={onChange} />
    );

    expect(nud.props().value).toBe(1);
    expect(nud.state().targetValue).toBe(1);

    nud.setProps({ max: 3 });
    expect(onChange.notCalled).toBe(true);
    expect(nud.props().value).toBe(1);
    expect(nud.state().targetValue).toBeNull();
});

describe('icon props', () => {
    const fortawesome = require('./fortawesome');

    beforeEach(() => {
        jest.resetModules();
        fortawesome.__setReactFontawesomeInstalled(true);
    });

    // it(`uses '+' and '-' characters by default when react-fontawesome is not installed`, () => {
    //     fortawesome.__setReactFontawesomeInstalled(false);
    //     const NUD = require('./index').default;
    //     let nud = renderer.create(<NUD value={0} />),
    //         tree = nud.toJSON();
    //     expect(tree).toMatchSnapshot();
    // });
    
    it(`uses faPlusCircle and faMinusCircle by default when react-fontawesome and free-solid-svg-icons are installed`, () => {
        const NUD = require('./index').default;
        let nud = renderer.create(<NUD value={0} />),
            tree = nud.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test(`uses specified fontawesome icons when react-fontawesome and free-solid-svg-icons are installed`, () => {
        const NUD = require('./index').default,
            { faUserMinus, faUserPlus } = require('@fortawesome/free-solid-svg-icons');

        let nud = renderer.create(<NUD value={0} minusIcon={faUserMinus} plusIcon={faUserPlus} />),
            tree = nud.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    it(`handles font-awesome strings for icons when specified in properties`, () => {
        const NUD = require('./index').default,
            { library } = require('@fortawesome/fontawesome-svg-core'),
            { fas } = require('@fortawesome/free-solid-svg-icons');
        library.add(fas);

        let nud = renderer.create(<NUD value={0} minusIcon="user-minus" plusIcon="user-plus" />),
            tree = nud.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
