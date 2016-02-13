Ext.define('Rally.technicalservices.prbDashboard.Settings',{



    getFieldMappings: function(settings){
        //todo - as we add more app settings that aren't fields, we will need to filter these out
        return settings;
    },
    statics: {
        fieldLabels: {
            sponsorField: 'Business Sponsor Field',
            ecField: 'EC Field',
            pmField: 'PM Field',
            blField: 'BU Lead Field',
            sltField: 'SLT Field',
            vsmField: 'VSM Field',
            startDateField: 'Start Date Field',
            endDateField: 'End Date Field',
            releaseDateField: 'Release Date Field',
            nextKeyMilestoneField: 'NextKeyMilestone Field',
            projectHealthField: 'Project Health Field',
            projectHealthTimelineField: 'Project Health Timeline Field',
            projectHealthScopeField: 'Project Health Scope Field',
            projectHealthQualityField: 'Project Health Quality Field',
            projectHealthResourcesField: 'Project Health Resources Field',
            projectHealthBudgetSpendField: 'Project Health Budget Spend Field',
            projectHealthChangeField: 'Project Health Change Field',
            totalBudgetField: 'Total Budget Field',
            budgetSpentField: 'Budget Spent Field',
            linkField: 'Status Report Link Field',
            questionField: 'Ask of ITC'
        },

        getFields: function (model, modelDisplayName,printAreaValue) {
            var labelWidth = 250,
                fields = [];

            fields.push({
                xtype: 'textarea',
                fieldLabel: modelDisplayName + ' Query',
                name: 'reportQuery',
                anchor: '100%',
                cls: 'query-field',
                margin: '0 70 25 0',
                labelWidth: 150,
                plugins: [
                    {
                        ptype: 'rallyhelpfield',
                        helpId: 194
                    },
                    'rallyfieldvalidationui'
                ],
                validateOnBlur: false,
                validateOnChange: false,
                validator: function(value) {
                    try {
                        if (value) {
                            Rally.data.wsapi.Filter.fromQueryString(value);
                        }
                        return true;
                    } catch (e) {
                        return e.message;
                    }
                }
            });

            fields.push({
                xtype: 'rallynumberfield',
                name: 'maxChars',
                minValue: 0,
                fieldLabel: "Max Characters",
                labelAlign: 'right',
                labelWidth: labelWidth,
            });

            _.each(this.fieldLabels, function (label, name) {

                var allowedTypes = ['STRING','TEXT'];
                if (/DateField/.test(name)){
                    allowedTypes = ['DATE'];
                }
                fields.push({
                    xtype: 'tsallowedfieldtypecombobox',
                    allowedTypes: allowedTypes,
                    model: model,
                    name: name,
                    fieldLabel: label,
                    labelAlign: 'right',
                    labelWidth: labelWidth,
                    width: 500
                });
            });

            fields.push({
                xtype: 'container',
                layout: 'hbox',
                margin: '25 0 0 0',
                items: [{
                    xtype: 'slider',
                    name: 'printAreaRatio',
                    fieldLabel: 'Print Area Ratio',
                    labelAlign: 'right',
                    width: labelWidth + 200,
                    labelWidth: labelWidth,
                    minValue: 1,
                    hideLabel: false,
                    useTips: false,
                    increment: 1,
                    maxValue: 100,
                    value: printAreaValue
                },{
                    xtype: 'container',
                    margin: '0 0 0 25',
                    html: 'This slider adjusts the number of pixels that will be fit onto one page when printed.<br/>The higher this number, the more will be fit onto a page.  If this number is too high, then the pages will not break properly in the print view.'
                }]
            });

            return fields;
        }
    }
});
