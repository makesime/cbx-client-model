import { isEqual } from 'lodash';

class BaseAttribute {
  constructor({ parent, value }) {
    this._parent = parent;

    constructorValues.call(this, value);
    constructorTriggers.call(this);
  }

  getValue(value) { return value; }

  parse(value) { return value; }

  reset() {
    this.set(this.getOriginalValue());
    this.setPristine();
  }

  setPristine() {
    this.setOriginalValuePristine();
    this.isDirty = false;
    this.hasChanged = false;
  }

  setValue(newValue, oldValue) {
    if (!isEqual(oldValue, newValue)) {
      this.hasChanged = !isEqual(this.getOriginalValue(), newValue);
      this.isDirty = true;
      this._parent.isDirty = true;
    }

    return this.parse(newValue);
  }
}

export default BaseAttribute;

////////////////

function constructorValues(value) {
  let originalValue;
  this.getOriginalValue = () => originalValue;
  this.setOriginalValuePristine = () => { originalValue = value; };
  this.setPristine();

  this.get = () => this.getValue(value);
  this.set = (newValue) => {
    value = this.setValue(newValue, value);
    this.trigger();
    return value;
  };
}

function constructorTriggers() {
  const onChangeCallbacks = [];
  this.onChange = (callback) => onChangeCallbacks.push(callback);
  this.trigger = () => onChangeCallbacks.forEach((callback) => callback.call(this));
}
