Ext.define("prb-dashboard", {
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    defaults: { margin: 10 },

    config: {
        defaultSettings: {

                reportQuery: null,
                model: 'PortfolioItem/ProgramorProject',
                maxChars: 100,
                noParentString: '(No Parent)',

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
                totalBudgetField: 'Name',
                budgetSpentField: 'Name',
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

        var model = this.getSetting('model'),
            fetchFields = ['Parent','Name','ObjectID'].concat(_.values(this.getSettings())),
            storeConfig = {
                model: model,
                fetch: fetchFields,
                limit: 'Infinity'
            },
            query = this.getSetting('reportQuery') || null;
        this.logger.log('Query', query, 'Fetch', fetchFields);
        if (query){
            storeConfig.filters = Rally.data.wsapi.Filter.fromQueryString(query);
        }

        Ext.create('Rally.data.wsapi.Store',storeConfig).load({
            scope: this,
            callback: this.runReport
        });

    },
    _addParentFilter: function(ct, items){

        var noParentString = this.getSetting('noParentString'),
            parents = _.uniq(_.map(items, function(item){ return item.Parent && item.Parent.Name || noParentString;}));
        parents = _.map(parents, function(p){
            var val = p;
            if (p === noParentString){
                val = null;
            }
            return {name: p, value: p};
        });
        this.logger.log('_addParentFilter', parents);


        var cb = ct.add({
            xtype: 'rallycombobox',
            fieldLabel: 'BU/CRG',
            labelAlign: 'right',
            store: Ext.create('Rally.data.custom.Store',{
                fields: ['name','value'],
                data: parents
            }),
            displayField: 'name',
            valueField: 'value',
            allowNoEntry: true,
            noEntryText: '-- No BU/CRG --',
            multiSelect: true,
            width: 500
        });
        cb.on('change', this._updateReport, this);
    },
    runReport: function(portfolioItems, operation){
        this.logger.log('_runReport', portfolioItems, operation);
        this.removeAll();


        var items = _.sortBy(_.map(portfolioItems, function(pi) {
            return pi.getData();
        }), function(pi){ return pi.Parent && pi.Parent.Name || "ZZZ";});

        this.portfolioItems = items;

        this._addHeaderComponents(items);

       this._updateReport();

    },
    _addHeaderComponents: function(items){

        var ct = this.add({
            xtype: 'container',
            layout: 'hbox'
        });

        this._addParentFilter(ct, items);

        ct.add({
            xtype: 'container',
            margin: '0 25 25 25',
            itemId: 'ct-num-items',
            flex: 1,
            tpl: '<tpl>{count} items found.</tpl>'
        });

        ct.add({
            xtype: 'container',
            margin: '0 25 25 100',
            itemId: 'ct-project-health-key',
            flex: 1,
            html: 'Project Health Key: <span style="text-decoration:underline;"><b>T</b></span>imeline, <span style="text-decoration:underline;"><b>S</b></span>cope, <span style="text-decoration:underline;"><b>Q</b></span>uality, <span style="text-decoration:underline;"><b>R</b></span>esources, <span style="text-decoration:underline;"><b>B</b></span>udget Spend, <span style="text-decoration:underline;"><b>C</b></span>hange'
        });


    },
    getPRBView: function(){
        return false;
    },
    _updateReport: function(cb){

        var filters = cb && cb.getValue() || [];

        var filteredItems = this.portfolioItems;
        if (filters.length > 0){
            filteredItems = _.filter(filteredItems, function(item){
                var parent = item.Parent && item.Parent.Name || null;
                return Ext.Array.contains(filters, parent);
            });
        }
        this.logger.log('filteredItems', filters, filteredItems)

        if (this.down('#tpl-report')){
            this.down('#tpl-report').destroy();
        }

        var appSettings = Ext.create('Rally.technicalservices.prbDashboard.Settings', this.getSettings()),
            tplConfig = appSettings.getFieldMappings(this.getSettings()),
            noParentString = "(No Parent)";

        tplConfig.maxChars = this.getSetting('maxChars');
        tplConfig.noParentString = noParentString;
        tplConfig.prbView = this.getPRBView();

        var tpl = new Rally.technicalservices.prbDashboard.Template(tplConfig);

        this.add({
            xtype: 'container',
            itemId: 'tpl-report',
            tpl: tpl,
            margin: '0 100 0 100',
            flex: 1
        }).update(filteredItems);
        this.down('#ct-num-items').update({count: filteredItems.length});

        console.log('html', this.down('#tpl-report').getEl().dom.innerHTML);
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
        return Rally.technicalservices.prbDashboard.Settings.getFields(this.getSetting('model'));
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
