import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontAwesomeIcon, faMinusCircle, faPlusCircle, mightBeFAIcon } from './fortawesome';
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

export default class NumericUpDown extends PureComponent {
    constructor(props) {
        super(props);

        this.input = React.createRef();
        this.recursiveUpdates = 0;

        this.state = {
            targetValue: null,
        };

        this._incrementValue = this._incrementValue.bind(this);
        this._decrementValue = this._decrementValue.bind(this);
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

            if (oldMin !== min && min >= target) {
                this._updateValue(Math.min(min, max));
            } else if (oldMax !== max && max <= target) {
                this._updateValue(Math.max(max, min));
            } else if (oldMin > oldMax && (min <= value || max >= value)) {
                if (value < min) {
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
                this.input.current.value = val;
            }
        } else {
            this.recursiveUpdates++;
            this.props.onChange(val);
            this.recursiveUpdates--;
        }
    }

    _incrementValue() {
        if (!this.props.disabled) {
            this.setState({
                targetValue: null
            });
            this._updateValue(Math.min(this.props.max, this.props.value + this.props.step));
        }
    }

    _decrementValue() {
        if (!this.props.disabled) {
            this.setState({
                targetValue: null
            });
            this._updateValue(Math.max(this.props.min, this.props.value - this.props.step));
        }
    }

    render() {
        let {
                iconColor,
                inputColor,
                className,
                minusIcon,
                plusIcon,
                inputAlign,
                allowManualInputWithNaNBounds,
                ...inputProps
            } = this.props,
            {
                value,
                min,
                max,
                disabled,
            } = inputProps,
            { className: iconClass, styles: iconStyles } = getIconStyles(),
            iconClasses = [
                iconClass,
                iconColor && `text-${iconColor}`
            ],
            divClasses = [
                'd-flex',
                'flex-nowrap',
                'flex-row',
                'align-items-center',
                'numeric-up-down',
                disabled && 'disabled',
                className,
            ];

        if (!allowManualInputWithNaNBounds && min > max) {
            inputProps.disabled = disabled = true;
        }

        let minusIconClasses = [
                'minus-icon', 
                (value <= min || disabled) && 'disabled', 
                ...iconClasses
            ],
            plusIconClasses = [
                'plus-icon',
                (value >= max || disabled) && 'disabled',
                ...iconClasses
            ];

        if (React.isValidElement(minusIcon)) {
            let props = {
                className: classnames(minusIcon.props.className, ...minusIconClasses),
                onClick: this._decrementValue,
            };

            minusIcon = React.cloneElement(minusIcon, props);
        } else if (mightBeFAIcon(minusIcon)) {
            try {
                let tmp = (
                    <FontAwesomeIcon icon={minusIcon} onClick={this._decrementValue} 
                        className={classnames(minusIconClasses)} />
                );
                minusIcon = tmp;
            } catch {}
        }

        if (minusIcon.constructor === String) {
            minusIcon = <span onClick={this._decrementValue} className={classnames(minusIconClasses)}>{minusIcon}</span>;
        }

        if (React.isValidElement(plusIcon)) {
            let props = {
                className: classnames(plusIcon.props.className, ...plusIconClasses),
                onClick: this._incrementValue,
            };

            plusIcon = React.cloneElement(plusIcon, props);
        } else if (mightBeFAIcon(plusIcon)) {
            try {
                let tmp = (
                    <FontAwesomeIcon icon={plusIcon} onClick={this._incrementValue}
                        className={classnames(plusIconClasses)} />
                );
                plusIcon = tmp;
            } catch {}
        }
        
        if (plusIcon.constructor === String) {
            plusIcon = <span onClick={this._incrementValue} className={classnames(plusIconClasses)}>{plusIcon}</span>;
        }

        return (
        <div className={classnames(divClasses)} {...inputProps}>
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

    static propTypes = {
        inputColor: PropTypes.string,
        iconColor: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        minusIcon: iconDefinitionPropType.isRequired,
        plusIcon: iconDefinitionPropType.isRequired,
        disabled: PropTypes.bool,
        value: PropTypes.number,
        onChange: PropTypes.func,
        inputAlign: PropTypes.oneOf(['left', 'center', 'right']),
        allowManualInputWithNaNBounds: PropTypes.bool
    };

    static defaultProps = {
        minusIcon: faMinusCircle, // (FontAwesomeIcon && faMinusCircle) ? faMinusCircle : '-',
        plusIcon: faPlusCircle, // (FontAwesomeIcon && faPlusCircle) ? faPlusCircle : '+',
        min: 0,
        max: Infinity,
        step: 1,
        inputAlign: 'center',
        allowManualInputWithNaNBounds: false,
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