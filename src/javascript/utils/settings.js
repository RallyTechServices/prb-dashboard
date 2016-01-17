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
            budgetField: 'Budget Field',
            linkField: 'Status Report Link Field'
        },

        getFields: function (model) {
            var labelWidth = 250,
                fields = [];

            _.each(this.fieldLabels, function (label, name) {
                fields.push({
                    xtype: 'rallyfieldcombobox',
                    model: model,
                    name: name,
                    fieldLabel: label,
                    labelAlign: 'right',
                    labelWidth: labelWidth,
                    width: 500
                });
            });

            return fields;
        }
    }
});
