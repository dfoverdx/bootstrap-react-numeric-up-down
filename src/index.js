import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { mightBeFAIcon } from './fortawesome';
import css from 'styled-jsx/css';

const iconDefinitionPropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.element,
    PropTypes.shape({
        prefix: PropTypes.oneOf(['fas', 'fab', 'far', 'fal']).isRequired,
        iconName: PropTypes.string.isRequired,
        icon: PropTypes.array,
    })
]);

function sandwich(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function getUVals(props) {
    let uMin = props.min === undefined ? -Infinity : props.min,
    uMax = props.max === undefined ? Infinity : props.max,
    uValue = props.value === undefined ? sandwich(0, uMin, uMax) : props.value;

    return {
        uMin,
        uMax,
        uValue
    };
}

export default class NumericUpDown extends PureComponent {
    constructor(props) {
        super(props);

        this.input = React.createRef();
        this.recursiveUpdates = 0;

        let { uValue } = getUVals(props);

        this.state = {
            targetValue: null,
            unsetValue: props.value === undefined ? '' : null,
        };

        if (props.value < props.min || props.value > props.max) {
            this.state.targetValue = props.value;
        }

        this._incrementValue = this._incrementValue.bind(this);
        this._decrementValue = this._decrementValue.bind(this);
        this._setUnsetValue = this._setUnsetValue.bind(this);
    }

    componentDidUpdate(oldProps) {
        let {
                min,
                max,
                value,
            } = this.props,
            {
                min: oldMin,
                max: oldMax,
                value: oldValue,
            } = oldProps,
            target = this.state.targetValue;

        if (target !== null) {
            if (value !== oldValue && this.recursiveUpdates === 0) {
                // user changed value manually
                this.setState({
                    targetValue: null
                });
            } else if (min !== oldMin && min <= target && oldMin > target || 
                       max !== oldMax && max >= target && oldMax < target) {
                this._updateValue(target);
                this.setState({
                    targetValue: null
                });

                return;
            }
        }

        if (oldValue == value && (oldMax !== max || oldMin !== min)) {
            if (target === null) {
                if (min > oldValue || max < oldValue) {
                    this.setState({
                        targetValue: oldValue
                    });
                }
            }

            let { uMin, uMax } = getUVals(this.props);

            if (oldMin !== min && min >= target) {
                this._updateValue(Math.min(min, uMax));
            } else if (oldMax !== max && max <= target) {
                this._updateValue(Math.max(max, uMin));
            } else if (oldMin > oldMax && (min <= value || max >= value)) {
                if (value <= min) {
                    this._updateValue(min);
                } else {
                    this._updateValue(max);
                }
            }
        }
    }

    _updateValue(val) {
        if (val === this.props.value) {
            return;
        }

        if (!this.props.onChange) {
            if (this.props.value === undefined) {
                this.setState({
                    unsetValue: val
                });
            }
        } else {
            this.recursiveUpdates++;
            this.props.onChange(val);
            this.recursiveUpdates--;
        }
    }

    _incrementValue(then, e) {
        if (!this.props.disabled) {
            this.setState({
                targetValue: null
            });

            let { step } = this.props;

            if (this.props.value === undefined) {
                let { uValue, uMin, uMax } = getUVals(this.props);
                if (this.input.current && this.input.current.value === '') {
                    this._updateValue(sandwich(uValue + step, uMin, uMax));
                } else if (this.input.current) {
                    let { unsetValue } = this.state;
                    unsetValue = unsetValue === '' ? uValue : unsetValue;
                    this._updateValue(Math.min(unsetValue + step, uMax));
                } else {
                    throw new Error('Somehow this.input.current was not set.');
                }
            } else {
                this._updateValue(Math.min(this.props.max, this.props.value + this.props.step));
            }

            if (then) {
                then(e);
            }
        }
    }

    _decrementValue(then, e) {
        if (!this.props.disabled) {
            this.setState({
                targetValue: null
            });

            let { step } = this.props;

            if (this.props.value === undefined) {
                let { uValue, uMin, uMax } = getUVals(this.props);
                if (this.input.current && this.input.current.value === '') {
                    this._updateValue(sandwich(uValue - step, uMin, uMax));
                } else if (this.input.current) {
                    let { unsetValue } = this.state;
                    unsetValue = unsetValue === '' ? uValue : unsetValue;
                    this._updateValue(Math.max(unsetValue - step, uMin));
                } else {
                    throw new Error('Somehow this.input.current was not set.');
                }
            } else {
                this._updateValue(Math.max(this.props.min, this.props.value - step));
            }

            if (then) {
                then(e);
            }
        }
    }

    _setUnsetValue(e) {
        this._updateValue(e.target.value);
    }

    render() {
        let {
                iconColor,
                minusIcon,
                plusIcon,
                inputAlign,
                inputColor,
                className,

                allowManualInputWithNaNBounds,

                // input props
                value, min, max, disabled, onChange,

                ...divProps
            } = this.props,
            inputProps = { value, min, max, disabled }, // don't include onChange since we call it manually
            { className: iconClass, styles: iconStyles } = getIconStyles(),
            divClasses = [
                'd-flex',
                'flex-nowrap',
                'flex-row',
                'align-items-center',
                'numeric-up-down',
                disabled && 'disabled',
                className,
            ];

        if (!allowManualInputWithNaNBounds && min >= max) {
            inputProps.disabled = disabled = true;
        }

        minusIcon = this._createIconBtn(true, minusIcon, iconClass);
        plusIcon = this._createIconBtn(false, plusIcon, iconClass);

        if (value === undefined) {
            inputProps.value = value === undefined ? this.state.unsetValue : value;
            inputProps.onChange = this._setUnsetValue;
        }

        return (
        <div className={classnames(divClasses)} {...divProps}>
            {minusIcon}
            <input className={classnames('form-control mx-2', inputColor && `text-${inputColor}`)} type="number" 
                {...inputProps} ref={this.input} />
            {plusIcon}
            {iconStyles}
            <style jsx>{`
                input {
                    text-align: ${this.props.inputAlign};
                    flex: 1;
                    -moz-appearance: textfield;
                }

                input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </div>
        );
    }

    _createIconBtn(isMinus, icon, iconClass) {
        let {
                value, min, max, disabled, iconColor
            } = this.props,
            iconDisabled = disabled || (isMinus ? value <= min : value >= max),
            iconClasses = [
                isMinus ? 'minus-icon' : 'plus-icon',
                iconClass,
                iconDisabled && 'disabled'
            ],
            onClick = isMinus ? this._decrementValue : this._incrementValue;

        if (iconColor instanceof Object) {
            iconColor = `text-${iconColor[isMinus ? 'minus' : 'plus']}`;
        }
        
        if (React.isValidElement(icon)) {
            let props = {
                className: classnames(icon.props.className, iconColor, ...iconClasses),
                onClick,
            };

            if (icon.props.onClick) {
                props.onClick = onClick.bind(this, icon.props.onClick);
            }

            return React.cloneElement(icon, props);
        }
        
        if (mightBeFAIcon(icon)) {
            try {
                return (
                    <FontAwesomeIcon icon={icon} onClick={onClick.bind(this, null)} 
                        className={classnames(iconColor, ...iconClasses)} />
                );
            } catch {}
        }

        if (icon.constructor === String) {
            iconClasses = iconClasses.concat([
                'btn',
                iconColor ? iconColor.replace('text-', 'btn-outline-') : 'btn-outline-secomdary',
            ]);

            return (
                <div onClick={onClick.bind(this, null)} className={classNames(iconClasses)}>{icon}</div>
            );
        }

        // should never get here, but just in case...
        return icon;
    }

    static propTypes = {
        inputColor: PropTypes.oneOfType([ 
            PropTypes.string, 
            PropTypes.shape({
                minus: PropTypes.string.isRequired,
                plus: PropTypes.string.isRequired
            })
        ]),
        iconColor: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        minusIcon: iconDefinitionPropType.isRequired,
        plusIcon: iconDefinitionPropType.isRequired,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        inputAlign: PropTypes.oneOf(['left', 'center', 'right']),
        allowManualInputWithNaNBounds: PropTypes.bool
    };

    static defaultProps = {
        minusIcon: faMinusCircle, // (FontAwesomeIcon && faMinusCircle) ? faMinusCircle : '-',
        plusIcon: faPlusCircle, // (FontAwesomeIcon && faPlusCircle) ? faPlusCircle : '+',
        inputAlign: 'center',
        allowManualInputWithNaNBounds: false,
        step: 1,
    };
}

function getIconStyles() {
    return css.resolve`
        .minus-icon, .plus-icon {
            cursor: pointer;
        }
        
        .minus-icon.disabled, .plus-icon.disabled, 
        .disabled .minus-icon, .disabled .plus-icon {
            opacity: .65;
            cursor: default;
        }
    `;
}