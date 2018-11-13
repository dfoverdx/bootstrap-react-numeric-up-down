import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from 'styled-jsx/css';

const iconDefinitionPropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.shape({
        prefix: PropTypes.oneOf(['fas', 'fab', 'far', 'fal']).isRequired,
        iconName: PropTypes.string.isRequired,
        icon: PropTypes.array,
    })
]);

export default class NumericUpDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || this.props.min || 0,
            targetValue: null
        };

        this._incrementValue = this._incrementValue.bind(this);
        this._decrementValue = this._decrementValue.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value && this.props.onChange) {
            this.props.onChange(nextState.value);
            return;
        }

        let newState,
            value = this.state.value;
        if (nextProps.min <= nextProps.max) {
            if (nextProps.min > value) {
                newState = {
                    value: nextProps.min,
                    targetValue: value
                };
            } else if (nextProps.max < value) {
                newState = {
                    value: nextProps.max,
                    targetValue: value,
                };
            }
        } else if (nextProps.min !== value) {
            newState = {
                value: nextProps.min
            };
        }

        if (newState) {
            this.setState(newState);
        }
    }

    _incrementValue() {
        if (!this.props.disabled) {
            this.setState({
                value: Math.min(this.props.max, this.state.value + this.props.step),
                targetValue: null,
            });
        }
    }

    _decrementValue() {
        if (!this.props.disabled) {
            this.setState({
                value: Math.max(this.props.min, this.state.value - this.props.step),
                targetValue: null,
            });
        }
    }

    _handleChange(e) {
        let val = parseInt(e.target.value);
        if (!isNaN(val)) {
            this.setState({
                value: Math.min(this.props.max, Math.max(this.props.min, val)),
                targetValue: null,
            });
        }
    }

    render() {
        let {
                min,
                max,
                onChange,
                iconColor,
                inputColor,
                className,
                minusIcon,
                plusIcon,
                disabled,
                step,
                inputAlign,
                ...props
            } = this.props,
            value = this.state.value,
            iconStyles = getIconStyles(),
            iconClasses = [
                iconStyles.className,
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

        if (React.isValidElement(minusIcon)) {
            let props = {
                className: classnames(minusIcon.props.className, 'minus-icon', value <= min && 'disabled', ...iconClasses),
            };

            minusIcon = React.cloneElement(minusIcon, props);
        } else {
            minusIcon = (
                <FontAwesomeIcon icon={minusIcon} onClick={this._decrementValue}
                    className={classnames('minus-icon', value <= min && 'disabled', ...iconClasses)} />
            );
        }

        if (React.isValidElement(plusIcon)) {
            let props = {
                className: classnames(plusIcon.props.className, 'plus-icon', value >= max && 'disabled', ...iconClasses),
            };

            plusIcon = React.cloneElement(plusIcon, props);
        } else {
            plusIcon = (
                <FontAwesomeIcon icon={plusIcon} onClick={this._incrementValue}
                    className={classnames('plus-icon', value >= max && 'disabled', ...iconClasses)} />
            );
        }

        return (
        <div className={classnames(divClasses)} {...props}>
            {minusIcon}
            <input className={classnames('form-control mx-2', inputColor && `text-${inputColor}`)} 
                type="number" min={min} max={max} step={step} value={value} disabled={disabled} 
                onChange={this._handleChange} />
            {plusIcon}
            {iconStyles.styles}
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
        btnColor: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        minusIcon: iconDefinitionPropType.isRequired,
        plusIcon: iconDefinitionPropType.isRequired,
        disabled: PropTypes.bool,
        value: PropTypes.number,
        onChange: PropTypes.func,
        inputAlign: PropTypes.oneOf(['left', 'center', 'right']),
    };

    static defaultProps = {
        minusIcon: faMinusCircle,
        plusIcon: faPlusCircle,
        value: 0,
        min: 0,
        step: 1,
        inputAlign: 'center',
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
            cursor: inherit;
        }
    `;
}