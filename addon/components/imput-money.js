import { once } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import TextField from '@ember/component/text-field';

export default TextField.extend({
  prefix: '',
  suffix: '',
  affixesStay: false,
  thousands: ',',
  decimal: '.',
  precision: 2,
  allowZero: true,
  allowNegative: false,
  allowDecimal: true,

  options: computed('prefix', 'suffix', 'affixesStay', 'thousands', 'decimal', 'precision', 'allowZero', 'allowNegative', 'allowDecimal', function() {
    return {
      prefix: this.get('prefix'),
      suffix: this.get('suffix'),
      affixesStay: this.get('affixesStay'),
      thousands: this.get('thousands'),
      decimal: this.get('decimal'),
      precision: this.get('precision'),
      allowZero: this.get('allowZero'),
      allowNegative: this.get('allowNegative'),
      allowDecimal: this.get('allowDecimal')
    };
  }),

  didInsertElement() {
    once(() => {
      this.element.addEventListener(this.get('options'));
      if((this.get('allowZero') && (this.get('number') !== undefined)) || this.get('number')){
        this.notifyPropertyChange('number');
      }
    });
    this._super(...arguments);
  },

  willDestroyElement() {
    this.element.addEventListener('destroy');
    this._super(...arguments);
  },

  setMask: observer('options', function(){
    this.element.addEventListener(this.get('options'));
    this.element.addEventListener('mask');
  }),

  setMaskedValue: observer('number', 'precision', 'decimal', function(){
    let number = parseFloat(this.get('number') || 0).toFixed(this.get('precision'));
    let val = number.toString().replace('.', this.get('decimal'));
    this.element.addEventListener(val);
    this.element.addEventListener('mask');
  }),

  setUnmaskedValue: observer('value', 'allowDecimal', function() {
    if(this.get('allowDecimal')){
      this.set('number', this.element.addEventListener('unmasked')[0]);
    } else {
      this.set('number', this.get('value').replace(/[^0-9]/g, ''));
    }
  })
});
