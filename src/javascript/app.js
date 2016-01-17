Ext.define("prb-dashboard", {
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    defaults: { margin: 10 },

    config: {
        defaultSettings: {

                sponsorField: 'Name',
                ecField: 'Name',
                pmField: 'Name',
                blField: 'Name',
                sltField: 'Name',
                vsmField: 'Name',
                startDateField: 'PlannedStartDate',
                endDateField: 'PlannedEndDate',
                releaseDateField: 'ActualEndDate',
                nextKeyMilestoneField: 'Name',
                projectHealthField: 'DisplayColor',
                projectHealthTimelineField: 'DisplayColor',
                projectHealthScopeField: 'DisplayColor',
                projectHealthQualityField: 'DisplayColor',
                projectHealthResourcesField: 'DisplayColor',
                projectHealthBudgetSpendField: 'DisplayColor',
                projectHealthChangeField: 'DisplayColor',
                budgetField: 'Name',
                linkField: 'Name'
        }
    },

    integrationHeaders : {
        name : "prb-dashboard"
    },
                        
    launch: function() {
        this.fetchData();
    },
    fetchData: function(){
        var model = 'PortfolioItem/Feature',
            fetchFields = ['Parent','Name'].concat(_.values(this.getSettings()));

        Ext.create('Rally.data.wsapi.Store',{
            model: model,
            fetch: fetchFields,
            limit: 'Infinity'
        }).load({
            scope: this,
            callback: this.runReport
        });
    },
    runReport: function(portfolioItems, operation){
        this.logger.log('_runReport', portfolioItems, operation);
        this.removeAll();

        var appSettings = Ext.create('Rally.technicalservices.prbDashboard.Settings', this.getSettings());

        var tpl = new Rally.technicalservices.prbDashboard.Template(appSettings.getFieldMappings(this.getSettings()));

        var items = _.map(portfolioItems, function(pi) {
            return pi.getData()
        });

        this.add({
            xtype: 'container',
            tpl: tpl,
            margin: '0 100 0 100',
            flex: 1
        }).update(items);

    },
    getOptions: function() {
        return [
            {
                text: 'About...',
                handler: this._launchInfo,
                scope: this
            }
        ];
    },
    getSettingsFields: function(){
        return Rally.technicalservices.prbDashboard.Settings.getFields('PortfolioItem/Feature');
    },
    _launchInfo: function() {
        if ( this.about_dialog ) { this.about_dialog.destroy(); }
        this.about_dialog = Ext.create('Rally.technicalservices.InfoLink',{});
    },
    
    isExternal: function(){
        return typeof(this.getAppId()) == 'undefined';
    },
    
    //onSettingsUpdate:  Override
    onSettingsUpdate: function (settings){
        this.logger.log('onSettingsUpdate',settings);
        this.fetchData();
    }
});
