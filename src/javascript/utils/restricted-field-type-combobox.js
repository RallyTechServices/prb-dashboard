Ext.define('Rally.technicalservices.combobox.AllowedFieldTypesCombobox', {
        requires: [],
        extend: 'Rally.ui.combobox.FieldComboBox',
        alias: 'widget.tsallowedfieldtypecombobox',

    _isNotHidden: function(field) {
        var allowedTypes = this.allowedTypes || [];
        if (!field.hidden && field.attributeDefinition && Ext.Array.contains(allowedTypes, field.attributeDefinition.AttributeType)){
            return true;
        }
        return false;
    },
    _populateStore: function() {
        if (!this.store) {
            return;
        }

        var data = _.sortBy(
            _.map(
                _.filter(this.model.getFields(), this._isNotHidden, this),
                this._convertFieldToLabelValuePair,
                this
            ),
            'name'
        );

        this.store.loadRawData(data);
        this.setDefaultValue();
        this.onReady();
    }
});