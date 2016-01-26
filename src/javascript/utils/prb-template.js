Ext.define('Rally.technicalservices.prbDashboard.Template',{
    extend: 'Ext.XTemplate',

    tbdText: 'TBD',

    getHealthColor: function(field, values){
        var re = /color=\"(.*)\"/i,
            color = values[field] || '#FFFFFF',
            match = color.match(re);

        if (match && match.length > 1){
            color = match[1];
        }
        return color;
    },

    getProjectTitle: function(values){
        var parent = this.noParentString;

        if (values.Parent){
            parent = values.Parent.Name || parent;
        }
        return this.getStringValue(parent + ' - ' + values.Name);
    },
    getFormattedDate: function(field, values){
        if (field && values[field]){
            var dt = Rally.util.DateTime.fromIsoString(values[field]);
            if (dt){
                return Rally.util.DateTime.format(dt, 'M Y');
            }
        }
        return null;
    },
    getStringValue: function(text){
        return Ext.String.ellipsis(text, this.maxChars, true);
    },

    constructor: function(config) {
       var templateConfig = [
           '<tpl foreach=".">',
           '<table class="prb">',
                '<tr>',
                    '<th class="prb" width="25%">BU/CRG - Project Title</th>',
                    '<th class="prb" width="25%">Sponsors (S), (EC)</br>Project Manager (PM), BU Lead (BL)</th>',
                    '<th class="prb" width="15%">Start Date (S)</br>Release (R)</br>End Date (E)</th>',
                    '<th class="prb" width="20%">Next Key Milestone</th>',
                    '<th class="prb" colspan="6">Project Health:</br><span style="text-decoration:underline;">T</span>imeline, <em>S</em>cope, <em>Q</em>uality, <em>R</em>esources, <em>B</em>udget Spend, <em>C</em>hange (BU/CRG)</th>',
                '</tr>',
                '<tr>',
                    '<td class="prb" rowspan="2">{[this.getProjectTitle(values)]}</td>',
                    '<td class="prb">',
                        '<tpl if="values[this.sponsorField]">{[this.getStringValue(values[this.sponsorField])]} (S)</br></tpl>',
                        '<tpl if="values[this.ecField]">{[this.getStringValue(values[this.ecField])]} (EC)</br></tpl>',
                        '<tpl if="values[this.pmField]">{[this.getStringValue(values[this.pmField])]} (PM)</br></tpl>',
                        '<tpl if="values[this.blField]">{[this.getStringValue(values[this.blField])]} (BL)</br></tpl>',
                    '</td>',
                    '<td class="prb">',
                        '<tpl if="values[this.startDateField]">{[this.getFormattedDate(this.startDateField, values)]}<tpl else>{[this.tbdText]}</tpl> (S)</br>',
                        '<tpl if="values[this.releaseDateField]">{[this.getFormattedDate(this.releaseDateField, values)]}<tpl else>{[this.tbdText]}</tpl> (R)</br>',
                        '<tpl if="values[this.endDateField]">{[this.getFormattedDate(this.endDateField, values)]}<tpl else>{[this.tbdText]}</tpl> (E)</br>',
                    '</td>',
                    '<td class="prb">{[this.getStringValue(values[this.nextKeyMilestoneField])]}</td>',
                    '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthField, values)]};">H</td>',
                    '<td class="prb" colspan="5">{[this.getStringValue(values[this.budgetSpentField])]}</td>',
                '</tr>',
               '<tr>',
                   '<td class="prb">',
                       '<tpl if="values[this.vsmField]">{[this.getStringValue(values[this.vsmField])]} (VSM),</tpl>',
                       '<tpl if="values[this.sltField]">{[this.getStringValue(values[this.sltField])]} (SLT)</tpl>',
                   '</td>',
                   '<td class="prb">',
                       '<tpl if="values[this.linkField]"><a href="{[values[this.linkField]]}">Status Report</a></tpl>',
                   '</td>',
                   '<td class="prb">',
                        '<tpl if="values[this.budgetField]">Total Budget:  {[this.getStringValue(values[this.totalBudgetField])]}</tpl>',
                    '</td>',
                   '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthTimelineField, values)]};">T</td>',
                   '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthScopeField, values)]};">S</td>',
                   '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthQualityField, values)]};">Q</td>',
                   '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthResourcesField, values)]};">R</td>',
                   '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthBudgetSpendField, values)]};">B</td>',
                   '<td class="prb" style="background-color:{[this.getHealthColor(this.projectHealthChangeField, values)]};">C</td>',
           '</tr>',
           '</table>',
           '</tpl>'
       ];

        templateConfig.push(config);

        return this.callParent(templateConfig);
    }
});
